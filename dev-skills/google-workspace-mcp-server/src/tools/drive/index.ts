/**
 * Google Drive API ツール
 */

import { google, drive_v3 } from 'googleapis';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import {
  handleGoogleApiError,
  formatToolResult,
  extractFolderId,
} from '../../utils/error-handler.js';

// スキーマ定義
export const ListFilesSchema = z.object({
  folderId: z.string().optional().describe('Folder ID to list files from (root if not specified)'),
  pageSize: z.number().optional().default(20).describe('Number of files to return (max 100)'),
  pageToken: z.string().optional().describe('Page token for pagination'),
  mimeType: z.string().optional().describe('Filter by MIME type'),
  orderBy: z.string().optional().default('modifiedTime desc').describe('Sort order'),
});

export const SearchFilesSchema = z.object({
  query: z.string().describe('Search query (file name or content)'),
  mimeType: z.string().optional().describe('Filter by MIME type'),
  pageSize: z.number().optional().default(20).describe('Number of results'),
  includeTrash: z.boolean().optional().default(false).describe('Include trashed files'),
});

export const CreateFolderSchema = z.object({
  name: z.string().describe('Folder name'),
  parentId: z.string().optional().describe('Parent folder ID'),
  description: z.string().optional().describe('Folder description'),
});

export const ShareFileSchema = z.object({
  fileId: z.string().describe('File or folder ID'),
  email: z.string().email().optional().describe('Email to share with'),
  role: z.enum(['reader', 'writer', 'commenter', 'owner']).describe('Permission role'),
  type: z.enum(['user', 'group', 'domain', 'anyone']).describe('Permission type'),
  domain: z.string().optional().describe('Domain for domain-type sharing'),
  sendNotification: z.boolean().optional().default(true).describe('Send email notification'),
});

export class DriveTools {
  private drive: drive_v3.Drive;

  constructor(authClient: OAuth2Client) {
    this.drive = google.drive({ version: 'v3', auth: authClient });
  }

  /**
   * ファイル一覧を取得
   */
  async listFiles(params: z.infer<typeof ListFilesSchema>) {
    try {
      let query = 'trashed = false';

      if (params.folderId) {
        const folderId = extractFolderId(params.folderId);
        query += ` and '${folderId}' in parents`;
      }

      if (params.mimeType) {
        query += ` and mimeType = '${params.mimeType}'`;
      }

      const response = await this.drive.files.list({
        q: query,
        pageSize: Math.min(params.pageSize || 20, 100),
        pageToken: params.pageToken,
        orderBy: params.orderBy,
        fields: 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, parents, webViewLink)',
      });

      const files = response.data.files?.map((file) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size ? parseInt(file.size, 10) : undefined,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink,
        isFolder: file.mimeType === 'application/vnd.google-apps.folder',
      })) || [];

      return formatToolResult(true, {
        files,
        nextPageToken: response.data.nextPageToken,
        totalFiles: files.length,
      });
    } catch (error) {
      const toolError = handleGoogleApiError(error);
      return formatToolResult(false, null, toolError);
    }
  }

  /**
   * ファイルを検索
   */
  async searchFiles(params: z.infer<typeof SearchFilesSchema>) {
    try {
      let query = `name contains '${params.query.replace(/'/g, "\\'")}'`;

      if (!params.includeTrash) {
        query += ' and trashed = false';
      }

      if (params.mimeType) {
        query += ` and mimeType = '${params.mimeType}'`;
      }

      const response = await this.drive.files.list({
        q: query,
        pageSize: Math.min(params.pageSize || 20, 100),
        fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, parents, webViewLink)',
        orderBy: 'modifiedTime desc',
      });

      const files = response.data.files?.map((file) => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.size ? parseInt(file.size, 10) : undefined,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink,
        isFolder: file.mimeType === 'application/vnd.google-apps.folder',
      })) || [];

      return formatToolResult(true, {
        files,
        totalFound: files.length,
        query: params.query,
      });
    } catch (error) {
      const toolError = handleGoogleApiError(error);
      return formatToolResult(false, null, toolError);
    }
  }

  /**
   * フォルダを作成
   */
  async createFolder(params: z.infer<typeof CreateFolderSchema>) {
    try {
      const fileMetadata: drive_v3.Schema$File = {
        name: params.name,
        mimeType: 'application/vnd.google-apps.folder',
        description: params.description,
      };

      if (params.parentId) {
        const parentId = extractFolderId(params.parentId);
        fileMetadata.parents = [parentId];
      }

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id, name, webViewLink, createdTime',
      });

      return formatToolResult(true, {
        folderId: response.data.id,
        name: response.data.name,
        webViewLink: response.data.webViewLink,
        createdTime: response.data.createdTime,
      });
    } catch (error) {
      const toolError = handleGoogleApiError(error);
      return formatToolResult(false, null, toolError);
    }
  }

  /**
   * ファイル/フォルダを共有
   */
  async shareFile(params: z.infer<typeof ShareFileSchema>) {
    try {
      const permission: drive_v3.Schema$Permission = {
        type: params.type,
        role: params.role,
      };

      if (params.type === 'user' || params.type === 'group') {
        if (!params.email) {
          throw new Error('Email is required for user/group sharing');
        }
        permission.emailAddress = params.email;
      }

      if (params.type === 'domain') {
        if (!params.domain) {
          throw new Error('Domain is required for domain sharing');
        }
        permission.domain = params.domain;
      }

      const response = await this.drive.permissions.create({
        fileId: params.fileId,
        requestBody: permission,
        sendNotificationEmail: params.sendNotification,
        fields: 'id, type, role, emailAddress',
      });

      // ファイル情報を取得してリンクを返す
      const fileInfo = await this.drive.files.get({
        fileId: params.fileId,
        fields: 'id, name, webViewLink',
      });

      return formatToolResult(true, {
        permissionId: response.data.id,
        fileId: params.fileId,
        fileName: fileInfo.data.name,
        webViewLink: fileInfo.data.webViewLink,
        sharedWith: {
          type: params.type,
          role: params.role,
          email: params.email,
          domain: params.domain,
        },
      });
    } catch (error) {
      const toolError = handleGoogleApiError(error);
      return formatToolResult(false, null, toolError);
    }
  }
}

// MIME Type 定数
export const GOOGLE_MIME_TYPES = {
  FOLDER: 'application/vnd.google-apps.folder',
  DOCUMENT: 'application/vnd.google-apps.document',
  SPREADSHEET: 'application/vnd.google-apps.spreadsheet',
  PRESENTATION: 'application/vnd.google-apps.presentation',
  FORM: 'application/vnd.google-apps.form',
};

// ツール定義
export const driveToolDefinitions = [
  {
    name: 'google_drive_list',
    description: 'List files in Google Drive. Can filter by folder and file type.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        folderId: {
          type: 'string',
          description: 'Folder ID to list files from (lists root if not specified)',
        },
        pageSize: {
          type: 'number',
          description: 'Number of files to return (default: 20, max: 100)',
        },
        pageToken: {
          type: 'string',
          description: 'Page token for pagination (from previous response)',
        },
        mimeType: {
          type: 'string',
          description: 'Filter by MIME type (e.g., "application/vnd.google-apps.spreadsheet")',
        },
        orderBy: {
          type: 'string',
          description: 'Sort order (default: "modifiedTime desc")',
        },
      },
      required: [],
    },
  },
  {
    name: 'google_drive_search',
    description: 'Search for files in Google Drive by name or content.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search query (file name)',
        },
        mimeType: {
          type: 'string',
          description: 'Filter by MIME type',
        },
        pageSize: {
          type: 'number',
          description: 'Number of results to return (default: 20)',
        },
        includeTrash: {
          type: 'boolean',
          description: 'Include files in trash (default: false)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'google_drive_create_folder',
    description: 'Create a new folder in Google Drive.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        name: {
          type: 'string',
          description: 'Name of the new folder',
        },
        parentId: {
          type: 'string',
          description: 'Parent folder ID (creates in root if not specified)',
        },
        description: {
          type: 'string',
          description: 'Optional folder description',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'google_drive_share',
    description: 'Share a file or folder with users, groups, or make it public.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        fileId: {
          type: 'string',
          description: 'File or folder ID to share',
        },
        email: {
          type: 'string',
          description: 'Email address to share with (required for user/group type)',
        },
        role: {
          type: 'string',
          enum: ['reader', 'writer', 'commenter', 'owner'],
          description: 'Permission role',
        },
        type: {
          type: 'string',
          enum: ['user', 'group', 'domain', 'anyone'],
          description: 'Permission type',
        },
        domain: {
          type: 'string',
          description: 'Domain for domain-type sharing',
        },
        sendNotification: {
          type: 'boolean',
          description: 'Send email notification (default: true)',
        },
      },
      required: ['fileId', 'role', 'type'],
    },
  },
];
