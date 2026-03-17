/**
 * Google Sheets API ツール
 */

import { google, sheets_v4 } from 'googleapis';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import {
  handleGoogleApiError,
  formatToolResult,
  extractSpreadsheetId,
} from '../../utils/error-handler.js';

// スキーマ定義
export const ReadDataSchema = z.object({
  spreadsheetId: z.string().describe('Spreadsheet ID or URL'),
  range: z.string().describe('A1 notation range (e.g., "Sheet1!A1:D10")'),
  valueRenderOption: z
    .enum(['FORMATTED_VALUE', 'UNFORMATTED_VALUE', 'FORMULA'])
    .optional()
    .default('FORMATTED_VALUE')
    .describe('How values should be rendered'),
});

export const WriteDataSchema = z.object({
  spreadsheetId: z.string().describe('Spreadsheet ID or URL'),
  range: z.string().describe('A1 notation range (e.g., "Sheet1!A1")'),
  values: z.array(z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])))
    .describe('2D array of values to write'),
  valueInputOption: z
    .enum(['RAW', 'USER_ENTERED'])
    .optional()
    .default('USER_ENTERED')
    .describe('How input data should be interpreted'),
});

export const CreateSpreadsheetSchema = z.object({
  title: z.string().describe('Title of the new spreadsheet'),
  sheets: z
    .array(z.object({
      title: z.string().describe('Sheet tab name'),
    }))
    .optional()
    .describe('Optional list of sheets to create'),
  folderId: z.string().optional().describe('Optional folder ID to create in'),
});

export const UpdateCellsSchema = z.object({
  spreadsheetId: z.string().describe('Spreadsheet ID or URL'),
  range: z.string().describe('A1 notation range (e.g., "Sheet1!A1:B2")'),
  values: z.array(z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])))
    .describe('2D array of values to update'),
  valueInputOption: z
    .enum(['RAW', 'USER_ENTERED'])
    .optional()
    .default('USER_ENTERED'),
});

export class SheetsTools {
  private sheets: sheets_v4.Sheets;
  private drive: ReturnType<typeof google.drive>;

  constructor(authClient: OAuth2Client) {
    this.sheets = google.sheets({ version: 'v4', auth: authClient });
    this.drive = google.drive({ version: 'v3', auth: authClient });
  }

  /**
   * スプレッドシートからデータを読み取り
   */
  async readData(params: z.infer<typeof ReadDataSchema>) {
    try {
      const spreadsheetId = extractSpreadsheetId(params.spreadsheetId);

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: params.range,
        valueRenderOption: params.valueRenderOption,
      });

      return formatToolResult(true, {
        range: response.data.range,
        values: response.data.values || [],
        rowCount: response.data.values?.length || 0,
        columnCount: response.data.values?.[0]?.length || 0,
      });
    } catch (error) {
      const toolError = handleGoogleApiError(error);
      return formatToolResult(false, null, toolError);
    }
  }

  /**
   * スプレッドシートにデータを書き込み
   */
  async writeData(params: z.infer<typeof WriteDataSchema>) {
    try {
      const spreadsheetId = extractSpreadsheetId(params.spreadsheetId);

      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: params.range,
        valueInputOption: params.valueInputOption,
        requestBody: {
          values: params.values,
        },
      });

      return formatToolResult(true, {
        updatedRange: response.data.updatedRange,
        updatedRows: response.data.updatedRows,
        updatedColumns: response.data.updatedColumns,
        updatedCells: response.data.updatedCells,
      });
    } catch (error) {
      const toolError = handleGoogleApiError(error);
      return formatToolResult(false, null, toolError);
    }
  }

  /**
   * 新しいスプレッドシートを作成
   */
  async createSpreadsheet(params: z.infer<typeof CreateSpreadsheetSchema>) {
    try {
      const sheets: sheets_v4.Schema$Sheet[] = params.sheets?.map((sheet) => ({
        properties: { title: sheet.title },
      })) || [];

      const response = await this.sheets.spreadsheets.create({
        requestBody: {
          properties: { title: params.title },
          sheets: sheets.length > 0 ? sheets : undefined,
        },
      });

      const spreadsheetId = response.data.spreadsheetId!;

      // フォルダに移動する場合
      if (params.folderId) {
        await this.drive.files.update({
          fileId: spreadsheetId,
          addParents: params.folderId,
          fields: 'id, parents',
        });
      }

      return formatToolResult(true, {
        spreadsheetId,
        spreadsheetUrl: response.data.spreadsheetUrl,
        title: response.data.properties?.title,
        sheets: response.data.sheets?.map((s) => ({
          sheetId: s.properties?.sheetId,
          title: s.properties?.title,
        })),
      });
    } catch (error) {
      const toolError = handleGoogleApiError(error);
      return formatToolResult(false, null, toolError);
    }
  }

  /**
   * セルを更新（append/更新の両方に対応）
   */
  async updateCells(params: z.infer<typeof UpdateCellsSchema>) {
    try {
      const spreadsheetId = extractSpreadsheetId(params.spreadsheetId);

      const response = await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: params.range,
        valueInputOption: params.valueInputOption,
        requestBody: {
          values: params.values,
        },
      });

      return formatToolResult(true, {
        updatedRange: response.data.updatedRange,
        updatedRows: response.data.updatedRows,
        updatedColumns: response.data.updatedColumns,
        updatedCells: response.data.updatedCells,
      });
    } catch (error) {
      const toolError = handleGoogleApiError(error);
      return formatToolResult(false, null, toolError);
    }
  }
}

// ツール定義
export const sheetsToolDefinitions = [
  {
    name: 'google_sheets_read_data',
    description: 'Read data from a Google Spreadsheet. Returns values from the specified range.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        spreadsheetId: {
          type: 'string',
          description: 'Spreadsheet ID or full URL',
        },
        range: {
          type: 'string',
          description: 'A1 notation range (e.g., "Sheet1!A1:D10", "A1:B5")',
        },
        valueRenderOption: {
          type: 'string',
          enum: ['FORMATTED_VALUE', 'UNFORMATTED_VALUE', 'FORMULA'],
          description: 'How values should be rendered (default: FORMATTED_VALUE)',
        },
      },
      required: ['spreadsheetId', 'range'],
    },
  },
  {
    name: 'google_sheets_write_data',
    description: 'Write data to a Google Spreadsheet. Overwrites existing data in the range.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        spreadsheetId: {
          type: 'string',
          description: 'Spreadsheet ID or full URL',
        },
        range: {
          type: 'string',
          description: 'A1 notation range where to start writing (e.g., "Sheet1!A1")',
        },
        values: {
          type: 'array',
          items: {
            type: 'array',
            items: { type: ['string', 'number', 'boolean', 'null'] },
          },
          description: '2D array of values to write (rows x columns)',
        },
        valueInputOption: {
          type: 'string',
          enum: ['RAW', 'USER_ENTERED'],
          description: 'How to interpret input (USER_ENTERED parses formulas, RAW stores as-is)',
        },
      },
      required: ['spreadsheetId', 'range', 'values'],
    },
  },
  {
    name: 'google_sheets_create',
    description: 'Create a new Google Spreadsheet with optional sheet tabs.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string',
          description: 'Title of the new spreadsheet',
        },
        sheets: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Sheet tab name' },
            },
            required: ['title'],
          },
          description: 'Optional list of sheet tabs to create',
        },
        folderId: {
          type: 'string',
          description: 'Optional Google Drive folder ID to create the spreadsheet in',
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'google_sheets_update_cells',
    description: 'Update specific cells in a Google Spreadsheet.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        spreadsheetId: {
          type: 'string',
          description: 'Spreadsheet ID or full URL',
        },
        range: {
          type: 'string',
          description: 'A1 notation range to update (e.g., "Sheet1!A1:B2")',
        },
        values: {
          type: 'array',
          items: {
            type: 'array',
            items: { type: ['string', 'number', 'boolean', 'null'] },
          },
          description: '2D array of values to update',
        },
        valueInputOption: {
          type: 'string',
          enum: ['RAW', 'USER_ENTERED'],
          description: 'How to interpret input (default: USER_ENTERED)',
        },
      },
      required: ['spreadsheetId', 'range', 'values'],
    },
  },
];
