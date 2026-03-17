/**
 * Google API スコープ定義
 */

export const GOOGLE_SCOPES = [
  // Google Sheets - スプレッドシートの読み書き
  'https://www.googleapis.com/auth/spreadsheets',

  // Google Docs - ドキュメントの読み書き
  'https://www.googleapis.com/auth/documents',

  // Google Drive - ファイルの管理
  'https://www.googleapis.com/auth/drive',
] as const;

export type GoogleScope = typeof GOOGLE_SCOPES[number];
