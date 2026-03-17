/**
 * OAuth トークンの保存・読み込み・更新を管理
 */

import * as fs from 'fs';
import * as path from 'path';
import { Credentials } from 'google-auth-library';

export interface TokenData {
  access_token: string;
  refresh_token?: string;
  scope: string;
  token_type: string;
  expiry_date?: number;
}

export class TokenManager {
  private tokenPath: string;

  constructor(tokenPath: string) {
    // ~ を展開
    this.tokenPath = tokenPath.replace(/^~/, process.env.HOME || '');

    // ディレクトリが存在しない場合は作成
    const dir = path.dirname(this.tokenPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    }
  }

  /**
   * トークンを保存
   */
  saveToken(tokens: Credentials): void {
    const tokenData: TokenData = {
      access_token: tokens.access_token || '',
      refresh_token: tokens.refresh_token || undefined,
      scope: tokens.scope || '',
      token_type: tokens.token_type || 'Bearer',
      expiry_date: tokens.expiry_date || undefined,
    };

    fs.writeFileSync(
      this.tokenPath,
      JSON.stringify(tokenData, null, 2),
      { mode: 0o600 }
    );
  }

  /**
   * トークンを読み込み
   */
  loadToken(): TokenData | null {
    if (!fs.existsSync(this.tokenPath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(this.tokenPath, 'utf-8');
      return JSON.parse(content) as TokenData;
    } catch (error) {
      console.error('Failed to load token:', error);
      return null;
    }
  }

  /**
   * トークンが有効期限切れかどうかを確認
   */
  isTokenExpired(token: TokenData): boolean {
    if (!token.expiry_date) {
      return false;
    }
    // 5分のバッファを持たせる
    return Date.now() >= token.expiry_date - 5 * 60 * 1000;
  }

  /**
   * トークンを削除
   */
  deleteToken(): void {
    if (fs.existsSync(this.tokenPath)) {
      fs.unlinkSync(this.tokenPath);
    }
  }

  /**
   * トークンが存在するかどうか
   */
  hasToken(): boolean {
    return fs.existsSync(this.tokenPath);
  }
}
