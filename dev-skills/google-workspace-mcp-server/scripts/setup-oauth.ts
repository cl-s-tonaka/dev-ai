#!/usr/bin/env tsx

/**
 * OAuth セットアップスクリプト
 *
 * Google Cloud Consoleからダウンロードしたcredentials.jsonを使用して
 * OAuthフローを実行し、アクセストークンを取得・保存します。
 */

import * as http from 'http';
import * as url from 'url';
import * as fs from 'fs';
import * as path from 'path';
import { google } from 'googleapis';
import { GOOGLE_SCOPES } from '../src/auth/scopes.js';
import { TokenManager } from '../src/auth/token-manager.js';

// デフォルトのパス
const DEFAULT_CREDENTIALS_PATH = '~/.config/google-workspace-mcp/credentials.json';
const DEFAULT_TOKEN_PATH = '~/.config/google-workspace-mcp/token.json';

// ポート設定
const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

interface CredentialsFile {
  installed?: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
  web?: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

async function main() {
  console.log('=== Google Workspace MCP Server - OAuth Setup ===\n');

  // パスを解決
  const credentialsPath = (process.env.GOOGLE_CREDENTIALS_PATH || DEFAULT_CREDENTIALS_PATH)
    .replace(/^~/, process.env.HOME || '');
  const tokenPath = (process.env.GOOGLE_TOKEN_PATH || DEFAULT_TOKEN_PATH)
    .replace(/^~/, process.env.HOME || '');

  // credentials.json の存在確認
  if (!fs.existsSync(credentialsPath)) {
    console.error(`Error: credentials.json not found at ${credentialsPath}`);
    console.log('\n=== How to get credentials.json ===');
    console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
    console.log('2. Create a new project or select an existing one');
    console.log('3. Enable APIs: Sheets API, Docs API, Drive API');
    console.log('4. Go to "Credentials" > "Create Credentials" > "OAuth client ID"');
    console.log('5. Select "Desktop app" as application type');
    console.log('6. Download the JSON file and save it as:');
    console.log(`   ${credentialsPath}`);
    console.log('7. Run this script again\n');
    process.exit(1);
  }

  // 設定ディレクトリを作成
  const configDir = path.dirname(tokenPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });
    console.log(`Created config directory: ${configDir}`);
  }

  // credentials を読み込み
  const credentials: CredentialsFile = JSON.parse(
    fs.readFileSync(credentialsPath, 'utf-8')
  );

  const config = credentials.installed || credentials.web;
  if (!config) {
    console.error('Error: Invalid credentials.json format');
    process.exit(1);
  }

  // OAuth2 クライアントを作成
  const oauth2Client = new google.auth.OAuth2(
    config.client_id,
    config.client_secret,
    REDIRECT_URI
  );

  // 認証 URL を生成
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: GOOGLE_SCOPES as unknown as string[],
    prompt: 'consent', // 常にリフレッシュトークンを取得
  });

  console.log('Opening browser for authentication...\n');
  console.log('If the browser does not open automatically, please visit:');
  console.log(`\n${authUrl}\n`);

  // ブラウザを開く
  const { exec } = await import('child_process');
  const platform = process.platform;
  const openCommand = platform === 'darwin' ? 'open' :
                      platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${openCommand} "${authUrl}"`);

  // コールバックサーバーを起動
  return new Promise<void>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        const queryObject = url.parse(req.url || '', true).query;

        if (queryObject.error) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: sans-serif; padding: 20px;">
                <h1>❌ Authentication Failed</h1>
                <p>Error: ${queryObject.error}</p>
                <p>Please try again.</p>
              </body>
            </html>
          `);
          server.close();
          reject(new Error(`OAuth error: ${queryObject.error}`));
          return;
        }

        if (queryObject.code) {
          // 認証コードからトークンを取得
          const { tokens } = await oauth2Client.getToken(queryObject.code as string);

          // トークンを保存
          const tokenManager = new TokenManager(tokenPath);
          tokenManager.saveToken(tokens);

          console.log('\n✅ Authentication successful!');
          console.log(`Token saved to: ${tokenPath}`);

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: sans-serif; padding: 20px; text-align: center;">
                <h1>✅ Authentication Successful!</h1>
                <p>You can close this window and return to the terminal.</p>
                <p style="color: #666;">Token saved to: ${tokenPath}</p>
              </body>
            </html>
          `);

          server.close();
          resolve();
        } else {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end('<html><body><h1>Invalid request</h1></body></html>');
        }
      } catch (error) {
        console.error('Error during authentication:', error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <body style="font-family: sans-serif; padding: 20px;">
              <h1>❌ Authentication Error</h1>
              <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
            </body>
          </html>
        `);
        server.close();
        reject(error);
      }
    });

    server.listen(PORT, () => {
      console.log(`Waiting for authentication callback on port ${PORT}...`);
    });

    // タイムアウト（5分）
    setTimeout(() => {
      server.close();
      reject(new Error('Authentication timed out'));
    }, 5 * 60 * 1000);
  });
}

main()
  .then(() => {
    console.log('\n=== Next Steps ===');
    console.log('1. Build the server: npm run build');
    console.log('2. Add to Claude Code settings:');
    console.log(`
{
  "mcpServers": {
    "google-workspace": {
      "command": "node",
      "args": ["${process.cwd()}/dist/index.js"]
    }
  }
}
`);
    console.log('3. Restart Claude Code to load the MCP server');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nSetup failed:', error.message);
    process.exit(1);
  });
