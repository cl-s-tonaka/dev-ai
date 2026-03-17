# Google Workspace MCP Server

Google Workspace（Sheets, Docs, Drive）と連携するMCP（Model Context Protocol）サーバー。Claude Codeから直接Google Workspaceのファイルを操作できます。

## 機能

### Google Sheets
- `google_sheets_read_data`: スプレッドシートからデータを読み取り
- `google_sheets_write_data`: スプレッドシートにデータを書き込み
- `google_sheets_create`: 新規スプレッドシートを作成
- `google_sheets_update_cells`: セルを更新

### Google Docs
- `google_docs_create`: 新規ドキュメントを作成
- `google_docs_read`: ドキュメントを読み取り
- `google_docs_append`: ドキュメントにコンテンツを追記
- `google_docs_format`: フォーマットを適用（見出し、太字、リストなど）

### Google Drive
- `google_drive_list`: ファイル一覧を取得
- `google_drive_search`: ファイルを検索
- `google_drive_create_folder`: フォルダを作成
- `google_drive_share`: ファイル/フォルダを共有

## セットアップ

### 1. Google Cloud Project の設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを選択）
3. 以下のAPIを有効化:
   - Google Sheets API
   - Google Docs API
   - Google Drive API
4. 「認証情報」→「認証情報を作成」→「OAuthクライアントID」
5. アプリケーションの種類: 「デスクトップアプリ」
6. JSONをダウンロード

### 2. credentials.json の配置

```bash
mkdir -p ~/.config/google-workspace-mcp
# ダウンロードしたJSONファイルをコピー
cp ~/Downloads/client_secret_*.json ~/.config/google-workspace-mcp/credentials.json
```

### 3. インストールとビルド

```bash
cd google-workspace-mcp-server
npm install
npm run build
```

### 4. OAuth認証

```bash
npm run setup-oauth
```

ブラウザが開くので、Googleアカウントでログインして権限を許可します。

### 5. Claude Code への設定

`~/.claude/settings.json` に以下を追加:

```json
{
  "mcpServers": {
    "google-workspace": {
      "command": "node",
      "args": ["/path/to/google-workspace-mcp-server/dist/index.js"]
    }
  }
}
```

Claude Codeを再起動して設定を反映します。

## 使用例

### スプレッドシートからデータを読む

```
スプレッドシート https://docs.google.com/spreadsheets/d/xxx/edit のA1:D10を読んで
```

### 新しいドキュメントを作成

```
「月次レポート」というタイトルでGoogle Docsを作成して
```

### ファイルを検索

```
Driveで「プロジェクト計画」を検索して
```

## 環境変数

| 変数名 | デフォルト値 | 説明 |
|--------|-------------|------|
| `GOOGLE_CREDENTIALS_PATH` | `~/.config/google-workspace-mcp/credentials.json` | credentials.jsonのパス |
| `GOOGLE_TOKEN_PATH` | `~/.config/google-workspace-mcp/token.json` | トークン保存先 |

## トラブルシューティング

### 認証エラー

```bash
# トークンを削除して再認証
rm ~/.config/google-workspace-mcp/token.json
npm run setup-oauth
```

### APIエラー

- APIが有効化されているか確認
- 割り当て（quota）を超えていないか確認
- ファイルへのアクセス権限があるか確認

## 開発

```bash
# 開発モードで実行
npm run dev

# MCP Inspector でテスト
npx @modelcontextprotocol/inspector node dist/index.js
```

## ライセンス

MIT
