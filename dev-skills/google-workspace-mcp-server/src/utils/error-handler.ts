/**
 * エラーハンドリングユーティリティ
 */

import { GaxiosError } from 'gaxios';

export interface ToolError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Google API エラーをユーザーフレンドリーなメッセージに変換
 */
export function handleGoogleApiError(error: unknown): ToolError {
  if (error instanceof GaxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.error?.message || error.message;

    switch (status) {
      case 400:
        return {
          code: 'INVALID_REQUEST',
          message: `Invalid request: ${message}`,
          details: error.response?.data,
        };
      case 401:
        return {
          code: 'UNAUTHORIZED',
          message: 'Authentication expired. Please re-authenticate using: npm run setup-oauth',
        };
      case 403:
        return {
          code: 'FORBIDDEN',
          message: `Permission denied: ${message}. Check API scopes and file permissions.`,
        };
      case 404:
        return {
          code: 'NOT_FOUND',
          message: `Resource not found: ${message}`,
        };
      case 429:
        return {
          code: 'RATE_LIMITED',
          message: 'API rate limit exceeded. Please wait and try again.',
        };
      case 500:
      case 502:
      case 503:
        return {
          code: 'SERVER_ERROR',
          message: 'Google API server error. Please try again later.',
        };
      default:
        return {
          code: 'API_ERROR',
          message: `Google API error: ${message}`,
          details: error.response?.data,
        };
    }
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    details: error,
  };
}

/**
 * ツール実行結果をフォーマット
 */
export function formatToolResult(
  success: boolean,
  data: unknown,
  error?: ToolError
): { content: Array<{ type: 'text'; text: string }> } {
  if (!success && error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: {
              code: error.code,
              message: error.message,
              ...(error.details ? { details: error.details } : {}),
            },
          }, null, 2),
        },
      ],
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          data,
        }, null, 2),
      },
    ],
  };
}

/**
 * スプレッドシートIDを検証・抽出
 */
export function extractSpreadsheetId(input: string): string {
  // URLの場合はIDを抽出
  const urlMatch = input.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) {
    return urlMatch[1];
  }

  // IDの形式を検証（英数字とハイフン、アンダースコア）
  if (/^[a-zA-Z0-9-_]+$/.test(input)) {
    return input;
  }

  throw new Error('Invalid spreadsheet ID or URL');
}

/**
 * ドキュメントIDを検証・抽出
 */
export function extractDocumentId(input: string): string {
  // URLの場合はIDを抽出
  const urlMatch = input.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) {
    return urlMatch[1];
  }

  // IDの形式を検証
  if (/^[a-zA-Z0-9-_]+$/.test(input)) {
    return input;
  }

  throw new Error('Invalid document ID or URL');
}

/**
 * フォルダIDを検証・抽出
 */
export function extractFolderId(input: string): string {
  // URLの場合はIDを抽出
  const urlMatch = input.match(/\/folders\/([a-zA-Z0-9-_]+)/);
  if (urlMatch) {
    return urlMatch[1];
  }

  // IDの形式を検証
  if (/^[a-zA-Z0-9-_]+$/.test(input)) {
    return input;
  }

  throw new Error('Invalid folder ID or URL');
}
