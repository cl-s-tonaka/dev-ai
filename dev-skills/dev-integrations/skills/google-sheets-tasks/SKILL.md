---
name: google-sheets-tasks
version: 1.0.0
description: Manage tasks and data using Google Sheets with MCP tools
tags:
  - google
  - sheets
  - tasks
  - spreadsheet
  - productivity
---

# Google Sheets Tasks

## Metadata

| Property | Value |
|----------|-------|
| Name | google-sheets-tasks |
| Version | 1.0.0 |
| Category | Integration |
| Complexity | Medium |
| Provider | Google Workspace |

## Instructions

Google Sheetsをタスク管理やデータ操作のバックエンドとして使用します。MCPサーバー `google-workspace` のツールを活用して、スプレッドシートのCRUD操作、進捗トラッキング、レポート生成を行います。

### 前提条件

- `google-workspace` MCPサーバーが設定済み
- OAuth認証が完了していること
- 対象のスプレッドシートへのアクセス権限

### 対応領域

1. **タスク管理**: タスクの作成、更新、完了、削除
2. **データ読み込み**: スプレッドシートからの構造化データ取得
3. **データ書き込み**: 新規データの追加、既存データの更新
4. **進捗レポート**: タスク完了率、期限管理
5. **テンプレート作成**: 新規スプレッドシートの構造化作成

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| spreadsheet_id | string | No | スプレッドシートID（新規作成の場合は不要） |
| operation | string | Yes | 実行する操作タイプ |
| data | object | Varies | 操作に必要なデータ |

## Output Process

### Step 1: スプレッドシートの確認/作成

- [ ] 既存シートを使用するか新規作成か判断
- [ ] 新規の場合は適切な構造で作成
- [ ] シート構造（ヘッダー、列定義）の確認

**タスク管理用シート構造例:**

| 列 | 内容 | 形式 |
|----|------|------|
| A | ID | 自動採番 |
| B | タスク名 | テキスト |
| C | 説明 | テキスト |
| D | ステータス | TODO/進行中/完了 |
| E | 優先度 | 高/中/低 |
| F | 担当者 | テキスト |
| G | 期限 | 日付 |
| H | 作成日 | 日付 |
| I | 更新日 | 日付 |

### Step 2: データ操作の実行

**MCPツールの使用:**

```
# データ読み取り
google_sheets_read_data(spreadsheetId, range)

# データ書き込み
google_sheets_write_data(spreadsheetId, range, values)

# 新規シート作成
google_sheets_create(title, sheets)

# セル更新
google_sheets_update_cells(spreadsheetId, range, values)
```

### Step 3: 結果の整形と出力

- [ ] 操作結果の確認
- [ ] ユーザーへのフィードバック
- [ ] 必要に応じてリンクを提供

## Output Format

```markdown
# Google Sheets タスク操作結果

## 操作サマリー
- **操作タイプ**: [operation_type]
- **スプレッドシート**: [title]
- **対象範囲**: [range]

## 結果

### 読み取りデータ
| [headers] |
|-----------|
| [data rows] |

### 更新内容
- 更新セル数: [count]
- 更新範囲: [range]

## リンク
- [スプレッドシートを開く](spreadsheet_url)

## 次のアクション
- [suggested_actions]
```

## Examples

### Example 1: タスク一覧の取得

**Input:**
```
タスク管理シートからすべてのタスクを読み込んで
SpreadsheetID: 1ABC...xyz
```

**Output:**
```markdown
# タスク一覧

| ID | タスク名 | ステータス | 優先度 | 期限 |
|----|----------|-----------|--------|------|
| 1 | ドキュメント作成 | 進行中 | 高 | 2024-01-15 |
| 2 | レビュー依頼 | TODO | 中 | 2024-01-20 |
| 3 | デプロイ | TODO | 高 | 2024-01-25 |

## サマリー
- 総タスク数: 3
- 完了: 0
- 進行中: 1
- TODO: 2
```

### Example 2: 新規タスクの追加

**Input:**
```
新しいタスクを追加して：
- タスク名: API実装
- 優先度: 高
- 期限: 2024-02-01
```

**Output:**
```markdown
# タスク追加完了

## 追加されたタスク
| 項目 | 値 |
|------|-----|
| ID | 4 |
| タスク名 | API実装 |
| ステータス | TODO |
| 優先度 | 高 |
| 期限 | 2024-02-01 |
| 作成日 | 2024-01-10 |

更新範囲: Tasks!A5:I5
```

### Example 3: 新規タスク管理シートの作成

**Input:**
```
「Q1プロジェクト」という名前で新しいタスク管理シートを作成して
```

**Output:**
```markdown
# スプレッドシート作成完了

## 詳細
- **タイトル**: Q1プロジェクト
- **シート**: Tasks, 進捗, 設定

## 構造
Tasks シートに以下のヘッダーを設定しました:
ID | タスク名 | 説明 | ステータス | 優先度 | 担当者 | 期限 | 作成日 | 更新日

[スプレッドシートを開く](https://docs.google.com/spreadsheets/d/xxx/edit)
```

## Notes

- **APIレート制限**: 100リクエスト/100秒を超えないように注意
- **セル数制限**: 一度に書き込めるセル数には制限あり（大量データは分割）
- **日付形式**: シリアル値での入力を推奨（USER_ENTERED使用時はテキストも可）
- **数式**: `valueInputOption: USER_ENTERED` で数式を解釈
- **権限**: 共有スプレッドシートでは適切な権限が必要
- 関連スキル: [google-docs-automation](../google-docs-automation)
