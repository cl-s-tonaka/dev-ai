/**
 * Google Docs API ツール
 */

import { google, docs_v1 } from 'googleapis';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import {
  handleGoogleApiError,
  formatToolResult,
  extractDocumentId,
} from '../../utils/error-handler.js';

// スキーマ定義
export const CreateDocumentSchema = z.object({
  title: z.string().describe('Title of the new document'),
  content: z.string().optional().describe('Optional initial content'),
  folderId: z.string().optional().describe('Optional folder ID to create in'),
});

export const ReadDocumentSchema = z.object({
  documentId: z.string().describe('Document ID or URL'),
});

export const AppendContentSchema = z.object({
  documentId: z.string().describe('Document ID or URL'),
  content: z.string().describe('Text content to append'),
  insertAtEnd: z.boolean().optional().default(true).describe('Insert at end of document'),
});

export const FormatDocumentSchema = z.object({
  documentId: z.string().describe('Document ID or URL'),
  requests: z.array(z.object({
    type: z.enum(['heading', 'bold', 'italic', 'underline', 'bulletList', 'numberedList']),
    startIndex: z.number().describe('Start index in document'),
    endIndex: z.number().describe('End index in document'),
    headingLevel: z.number().optional().describe('Heading level 1-6 (for heading type)'),
  })).describe('List of formatting requests'),
});

export class DocsTools {
  private docs: docs_v1.Docs;
  private drive: ReturnType<typeof google.drive>;

  constructor(authClient: OAuth2Client) {
    this.docs = google.docs({ version: 'v1', auth: authClient });
    this.drive = google.drive({ version: 'v3', auth: authClient });
  }

  /**
   * 新しいドキュメントを作成
   */
  async createDocument(params: z.infer<typeof CreateDocumentSchema>) {
    try {
      // ドキュメントを作成
      const response = await this.docs.documents.create({
        requestBody: {
          title: params.title,
        },
      });

      const documentId = response.data.documentId!;

      // 初期コンテンツを追加
      if (params.content) {
        await this.docs.documents.batchUpdate({
          documentId,
          requestBody: {
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: params.content,
                },
              },
            ],
          },
        });
      }

      // フォルダに移動
      if (params.folderId) {
        await this.drive.files.update({
          fileId: documentId,
          addParents: params.folderId,
          fields: 'id, parents',
        });
      }

      return formatToolResult(true, {
        documentId,
        documentUrl: `https://docs.google.com/document/d/${documentId}/edit`,
        title: params.title,
      });
    } catch (error) {
      const toolError = handleGoogleApiError(error);
      return formatToolResult(false, null, toolError);
    }
  }

  /**
   * ドキュメントを読み取り
   */
  async readDocument(params: z.infer<typeof ReadDocumentSchema>) {
    try {
      const documentId = extractDocumentId(params.documentId);

      const response = await this.docs.documents.get({
        documentId,
      });

      // テキストコンテンツを抽出
      const content = this.extractTextContent(response.data);

      return formatToolResult(true, {
        documentId: response.data.documentId,
        title: response.data.title,
        content,
        revisionId: response.data.revisionId,
      });
    } catch (error) {
      const toolError = handleGoogleApiError(error);
      return formatToolResult(false, null, toolError);
    }
  }

  /**
   * ドキュメントにコンテンツを追記
   */
  async appendContent(params: z.infer<typeof AppendContentSchema>) {
    try {
      const documentId = extractDocumentId(params.documentId);

      // まず現在のドキュメントの長さを取得
      const doc = await this.docs.documents.get({ documentId });
      const endIndex = this.getDocumentEndIndex(doc.data);

      // コンテンツを追加
      const response = await this.docs.documents.batchUpdate({
        documentId,
        requestBody: {
          requests: [
            {
              insertText: {
                location: { index: params.insertAtEnd ? endIndex : 1 },
                text: params.content,
              },
            },
          ],
        },
      });

      return formatToolResult(true, {
        documentId,
        updatedRevisionId: response.data.writeControl?.requiredRevisionId,
        insertedLength: params.content.length,
      });
    } catch (error) {
      const toolError = handleGoogleApiError(error);
      return formatToolResult(false, null, toolError);
    }
  }

  /**
   * ドキュメントにフォーマットを適用
   */
  async formatDocument(params: z.infer<typeof FormatDocumentSchema>) {
    try {
      const documentId = extractDocumentId(params.documentId);

      const requests: docs_v1.Schema$Request[] = params.requests.map((req) => {
        const range = {
          startIndex: req.startIndex,
          endIndex: req.endIndex,
        };

        switch (req.type) {
          case 'heading':
            return {
              updateParagraphStyle: {
                range,
                paragraphStyle: {
                  namedStyleType: `HEADING_${req.headingLevel || 1}` as docs_v1.Schema$ParagraphStyle['namedStyleType'],
                },
                fields: 'namedStyleType',
              },
            };
          case 'bold':
            return {
              updateTextStyle: {
                range,
                textStyle: { bold: true },
                fields: 'bold',
              },
            };
          case 'italic':
            return {
              updateTextStyle: {
                range,
                textStyle: { italic: true },
                fields: 'italic',
              },
            };
          case 'underline':
            return {
              updateTextStyle: {
                range,
                textStyle: { underline: true },
                fields: 'underline',
              },
            };
          case 'bulletList':
            return {
              createParagraphBullets: {
                range,
                bulletPreset: 'BULLET_DISC_CIRCLE_SQUARE',
              },
            };
          case 'numberedList':
            return {
              createParagraphBullets: {
                range,
                bulletPreset: 'NUMBERED_DECIMAL_NESTED',
              },
            };
          default:
            throw new Error(`Unknown format type: ${req.type}`);
        }
      });

      const response = await this.docs.documents.batchUpdate({
        documentId,
        requestBody: { requests },
      });

      return formatToolResult(true, {
        documentId,
        appliedFormats: params.requests.length,
        updatedRevisionId: response.data.writeControl?.requiredRevisionId,
      });
    } catch (error) {
      const toolError = handleGoogleApiError(error);
      return formatToolResult(false, null, toolError);
    }
  }

  /**
   * ドキュメントからテキストコンテンツを抽出
   */
  private extractTextContent(doc: docs_v1.Schema$Document): string {
    const content: string[] = [];

    const body = doc.body;
    if (!body?.content) return '';

    for (const element of body.content) {
      if (element.paragraph?.elements) {
        for (const textRun of element.paragraph.elements) {
          if (textRun.textRun?.content) {
            content.push(textRun.textRun.content);
          }
        }
      }
    }

    return content.join('');
  }

  /**
   * ドキュメントの終端インデックスを取得
   */
  private getDocumentEndIndex(doc: docs_v1.Schema$Document): number {
    const body = doc.body;
    if (!body?.content) return 1;

    const lastElement = body.content[body.content.length - 1];
    return (lastElement.endIndex || 1) - 1;
  }
}

// ツール定義
export const docsToolDefinitions = [
  {
    name: 'google_docs_create',
    description: 'Create a new Google Document with optional initial content.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        title: {
          type: 'string',
          description: 'Title of the new document',
        },
        content: {
          type: 'string',
          description: 'Optional initial text content',
        },
        folderId: {
          type: 'string',
          description: 'Optional Google Drive folder ID to create the document in',
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'google_docs_read',
    description: 'Read content from a Google Document.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        documentId: {
          type: 'string',
          description: 'Document ID or full URL',
        },
      },
      required: ['documentId'],
    },
  },
  {
    name: 'google_docs_append',
    description: 'Append text content to an existing Google Document.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        documentId: {
          type: 'string',
          description: 'Document ID or full URL',
        },
        content: {
          type: 'string',
          description: 'Text content to append',
        },
        insertAtEnd: {
          type: 'boolean',
          description: 'Insert at end of document (default: true)',
        },
      },
      required: ['documentId', 'content'],
    },
  },
  {
    name: 'google_docs_format',
    description: 'Apply formatting to a Google Document (headings, bold, italic, lists, etc.).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        documentId: {
          type: 'string',
          description: 'Document ID or full URL',
        },
        requests: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['heading', 'bold', 'italic', 'underline', 'bulletList', 'numberedList'],
                description: 'Type of formatting to apply',
              },
              startIndex: {
                type: 'number',
                description: 'Start index in document (1-based)',
              },
              endIndex: {
                type: 'number',
                description: 'End index in document',
              },
              headingLevel: {
                type: 'number',
                description: 'Heading level 1-6 (only for heading type)',
              },
            },
            required: ['type', 'startIndex', 'endIndex'],
          },
          description: 'List of formatting requests to apply',
        },
      },
      required: ['documentId', 'requests'],
    },
  },
];
