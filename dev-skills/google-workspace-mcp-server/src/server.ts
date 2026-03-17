/**
 * MCP Server 初期化とツール登録
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { GoogleOAuthClient, OAuthConfig } from './auth/oauth-client.js';
import { SheetsTools, sheetsToolDefinitions, ReadDataSchema, WriteDataSchema, CreateSpreadsheetSchema, UpdateCellsSchema } from './tools/sheets/index.js';
import { DocsTools, docsToolDefinitions, CreateDocumentSchema, ReadDocumentSchema, AppendContentSchema, FormatDocumentSchema } from './tools/docs/index.js';
import { DriveTools, driveToolDefinitions, ListFilesSchema, SearchFilesSchema, CreateFolderSchema, ShareFileSchema } from './tools/drive/index.js';

export interface ServerConfig extends OAuthConfig {}

export async function createServer(config: ServerConfig): Promise<McpServer> {
  const server = new McpServer({
    name: 'google-workspace',
    version: '1.0.0',
  });

  // OAuth クライアントを初期化
  const oauthClient = new GoogleOAuthClient(config);

  // 認証チェック
  if (!oauthClient.isAuthenticated()) {
    console.error('Not authenticated. Please run: npm run setup-oauth');
    throw new Error('Authentication required');
  }

  // 認証済みクライアントを取得
  const authClient = await oauthClient.getAuthenticatedClient();

  // ツールインスタンスを作成
  const sheetsTools = new SheetsTools(authClient);
  const docsTools = new DocsTools(authClient);
  const driveTools = new DriveTools(authClient);

  // Google Sheets ツール
  server.tool(
    'google_sheets_read_data',
    'Read data from a Google Spreadsheet. Returns values from the specified range.',
    {
      spreadsheetId: z.string().describe('Spreadsheet ID or full URL'),
      range: z.string().describe('A1 notation range (e.g., "Sheet1!A1:D10", "A1:B5")'),
      valueRenderOption: z.enum(['FORMATTED_VALUE', 'UNFORMATTED_VALUE', 'FORMULA']).optional().describe('How values should be rendered'),
    },
    async (params) => {
      return await sheetsTools.readData(ReadDataSchema.parse(params));
    }
  );

  server.tool(
    'google_sheets_write_data',
    'Write data to a Google Spreadsheet. Overwrites existing data in the range.',
    {
      spreadsheetId: z.string().describe('Spreadsheet ID or full URL'),
      range: z.string().describe('A1 notation range where to start writing (e.g., "Sheet1!A1")'),
      values: z.array(z.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))).describe('2D array of values to write (rows x columns)'),
      valueInputOption: z.enum(['RAW', 'USER_ENTERED']).optional().describe('How to interpret input (USER_ENTERED parses formulas, RAW stores as-is)'),
    },
    async (params) => {
      return await sheetsTools.writeData(WriteDataSchema.parse(params));
    }
  );

  server.tool(
    'google_sheets_create',
    'Create a new Google Spreadsheet with optional sheet tabs.',
    {
      title: z.string().describe('Title of the new spreadsheet'),
      sheets: z.array(z.object({ title: z.string() })).optional().describe('Optional list of sheet tabs to create'),
      folderId: z.string().optional().describe('Optional Google Drive folder ID to create the spreadsheet in'),
    },
    async (params) => {
      return await sheetsTools.createSpreadsheet(CreateSpreadsheetSchema.parse(params));
    }
  );

  server.tool(
    'google_sheets_update_cells',
    'Update specific cells in a Google Spreadsheet.',
    {
      spreadsheetId: z.string().describe('Spreadsheet ID or full URL'),
      range: z.string().describe('A1 notation range to update (e.g., "Sheet1!A1:B2")'),
      values: z.array(z.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))).describe('2D array of values to update'),
      valueInputOption: z.enum(['RAW', 'USER_ENTERED']).optional().describe('How to interpret input (default: USER_ENTERED)'),
    },
    async (params) => {
      return await sheetsTools.updateCells(UpdateCellsSchema.parse(params));
    }
  );

  // Google Docs ツール
  server.tool(
    'google_docs_create',
    'Create a new Google Document with optional initial content.',
    {
      title: z.string().describe('Title of the new document'),
      content: z.string().optional().describe('Optional initial text content'),
      folderId: z.string().optional().describe('Optional Google Drive folder ID to create the document in'),
    },
    async (params) => {
      return await docsTools.createDocument(CreateDocumentSchema.parse(params));
    }
  );

  server.tool(
    'google_docs_read',
    'Read content from a Google Document.',
    {
      documentId: z.string().describe('Document ID or full URL'),
    },
    async (params) => {
      return await docsTools.readDocument(ReadDocumentSchema.parse(params));
    }
  );

  server.tool(
    'google_docs_append',
    'Append text content to an existing Google Document.',
    {
      documentId: z.string().describe('Document ID or full URL'),
      content: z.string().describe('Text content to append'),
      insertAtEnd: z.boolean().optional().describe('Insert at end of document (default: true)'),
    },
    async (params) => {
      return await docsTools.appendContent(AppendContentSchema.parse(params));
    }
  );

  server.tool(
    'google_docs_format',
    'Apply formatting to a Google Document (headings, bold, italic, lists, etc.).',
    {
      documentId: z.string().describe('Document ID or full URL'),
      requests: z.array(z.object({
        type: z.enum(['heading', 'bold', 'italic', 'underline', 'bulletList', 'numberedList']),
        startIndex: z.number().describe('Start index in document'),
        endIndex: z.number().describe('End index in document'),
        headingLevel: z.number().optional().describe('Heading level 1-6 (for heading type)'),
      })).describe('List of formatting requests to apply'),
    },
    async (params) => {
      return await docsTools.formatDocument(FormatDocumentSchema.parse(params));
    }
  );

  // Google Drive ツール
  server.tool(
    'google_drive_list',
    'List files in Google Drive. Can filter by folder and file type.',
    {
      folderId: z.string().optional().describe('Folder ID to list files from (lists root if not specified)'),
      pageSize: z.number().optional().describe('Number of files to return (default: 20, max: 100)'),
      pageToken: z.string().optional().describe('Page token for pagination (from previous response)'),
      mimeType: z.string().optional().describe('Filter by MIME type (e.g., "application/vnd.google-apps.spreadsheet")'),
      orderBy: z.string().optional().describe('Sort order (default: "modifiedTime desc")'),
    },
    async (params) => {
      return await driveTools.listFiles(ListFilesSchema.parse(params));
    }
  );

  server.tool(
    'google_drive_search',
    'Search for files in Google Drive by name or content.',
    {
      query: z.string().describe('Search query (file name)'),
      mimeType: z.string().optional().describe('Filter by MIME type'),
      pageSize: z.number().optional().describe('Number of results to return (default: 20)'),
      includeTrash: z.boolean().optional().describe('Include files in trash (default: false)'),
    },
    async (params) => {
      return await driveTools.searchFiles(SearchFilesSchema.parse(params));
    }
  );

  server.tool(
    'google_drive_create_folder',
    'Create a new folder in Google Drive.',
    {
      name: z.string().describe('Name of the new folder'),
      parentId: z.string().optional().describe('Parent folder ID (creates in root if not specified)'),
      description: z.string().optional().describe('Optional folder description'),
    },
    async (params) => {
      return await driveTools.createFolder(CreateFolderSchema.parse(params));
    }
  );

  server.tool(
    'google_drive_share',
    'Share a file or folder with users, groups, or make it public.',
    {
      fileId: z.string().describe('File or folder ID to share'),
      email: z.string().optional().describe('Email address to share with (required for user/group type)'),
      role: z.enum(['reader', 'writer', 'commenter', 'owner']).describe('Permission role'),
      type: z.enum(['user', 'group', 'domain', 'anyone']).describe('Permission type'),
      domain: z.string().optional().describe('Domain for domain-type sharing'),
      sendNotification: z.boolean().optional().describe('Send email notification (default: true)'),
    },
    async (params) => {
      return await driveTools.shareFile(ShareFileSchema.parse(params));
    }
  );

  return server;
}

// ツール定義をエクスポート
export { sheetsToolDefinitions, docsToolDefinitions, driveToolDefinitions };
