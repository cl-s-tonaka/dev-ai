#!/usr/bin/env node

/**
 * Google Workspace MCP Server
 *
 * Entry point for the MCP server that provides Google Sheets, Docs, and Drive integration.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// .env ファイルを読み込み（存在する場合）
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// デフォルトのパス
const DEFAULT_CREDENTIALS_PATH = '~/.config/google-workspace-mcp/credentials.json';
const DEFAULT_TOKEN_PATH = '~/.config/google-workspace-mcp/token.json';

async function main() {
  // 環境変数またはデフォルト値からパスを取得
  const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH || DEFAULT_CREDENTIALS_PATH;
  const tokenPath = process.env.GOOGLE_TOKEN_PATH || DEFAULT_TOKEN_PATH;

  try {
    // MCP サーバーを作成
    const server = await createServer({
      credentialsPath,
      tokenPath,
    });

    // stdio トランスポートでサーバーを起動
    const transport = new StdioServerTransport();
    await server.connect(transport);

    // サーバー起動をログ
    console.error('Google Workspace MCP Server started successfully');
    console.error(`Credentials: ${credentialsPath}`);
    console.error(`Token: ${tokenPath}`);

  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to start server: ${error.message}`);

      // 認証が必要な場合のヘルプメッセージ
      if (error.message.includes('Authentication required') ||
          error.message.includes('Credentials file not found')) {
        console.error('\n=== Setup Instructions ===');
        console.error('1. Download credentials.json from Google Cloud Console');
        console.error(`2. Place it at: ${credentialsPath.replace(/^~/, process.env.HOME || '')}`);
        console.error('3. Run: npm run setup-oauth');
        console.error('4. Complete the OAuth flow in your browser');
        console.error('========================\n');
      }
    } else {
      console.error('Failed to start server:', error);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
