/**
 * Google OAuth 2.0 クライアント
 */

import * as fs from 'fs';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_SCOPES } from './scopes.js';
import { TokenManager } from './token-manager.js';

export interface OAuthConfig {
  credentialsPath: string;
  tokenPath: string;
  redirectUri?: string;
}

export interface CredentialsFile {
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

export class GoogleOAuthClient {
  private oauth2Client: OAuth2Client | null = null;
  private tokenManager: TokenManager;
  private credentialsPath: string;
  private redirectUri: string;

  constructor(config: OAuthConfig) {
    this.credentialsPath = config.credentialsPath.replace(/^~/, process.env.HOME || '');
    this.tokenManager = new TokenManager(config.tokenPath);
    this.redirectUri = config.redirectUri || 'http://localhost:3000/oauth2callback';
  }

  /**
   * OAuth2クライアントを初期化
   */
  private initializeClient(): OAuth2Client {
    if (this.oauth2Client) {
      return this.oauth2Client;
    }

    if (!fs.existsSync(this.credentialsPath)) {
      throw new Error(
        `Credentials file not found at ${this.credentialsPath}. ` +
        'Please download credentials.json from Google Cloud Console.'
      );
    }

    const credentials: CredentialsFile = JSON.parse(
      fs.readFileSync(this.credentialsPath, 'utf-8')
    );

    const config = credentials.installed || credentials.web;
    if (!config) {
      throw new Error('Invalid credentials file format');
    }

    this.oauth2Client = new google.auth.OAuth2(
      config.client_id,
      config.client_secret,
      this.redirectUri
    );

    return this.oauth2Client;
  }

  /**
   * 認証済みクライアントを取得
   */
  async getAuthenticatedClient(): Promise<OAuth2Client> {
    const client = this.initializeClient();
    const token = this.tokenManager.loadToken();

    if (!token) {
      throw new Error(
        'Not authenticated. Please run setup-oauth script first: npm run setup-oauth'
      );
    }

    client.setCredentials({
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expiry_date: token.expiry_date,
      token_type: token.token_type,
      scope: token.scope,
    });

    // トークンが期限切れの場合は更新
    if (this.tokenManager.isTokenExpired(token) && token.refresh_token) {
      try {
        const { credentials } = await client.refreshAccessToken();
        this.tokenManager.saveToken(credentials);
        client.setCredentials(credentials);
      } catch (error) {
        throw new Error(
          'Failed to refresh access token. Please re-authenticate: npm run setup-oauth'
        );
      }
    }

    return client;
  }

  /**
   * 認証URLを生成
   */
  getAuthUrl(): string {
    const client = this.initializeClient();
    return client.generateAuthUrl({
      access_type: 'offline',
      scope: GOOGLE_SCOPES as unknown as string[],
      prompt: 'consent', // 常にリフレッシュトークンを取得
    });
  }

  /**
   * 認証コードからトークンを取得して保存
   */
  async handleAuthCode(code: string): Promise<void> {
    const client = this.initializeClient();
    const { tokens } = await client.getToken(code);
    this.tokenManager.saveToken(tokens);
    client.setCredentials(tokens);
  }

  /**
   * 認証状態を確認
   */
  isAuthenticated(): boolean {
    const token = this.tokenManager.loadToken();
    if (!token) return false;

    // リフレッシュトークンがある、または期限内であれば認証済み
    return !this.tokenManager.isTokenExpired(token) || !!token.refresh_token;
  }

  /**
   * ログアウト（トークン削除）
   */
  logout(): void {
    this.tokenManager.deleteToken();
    this.oauth2Client = null;
  }
}
