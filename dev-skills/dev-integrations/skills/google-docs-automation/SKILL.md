---
name: google-docs-automation
version: 1.0.0
description: Automate document creation and editing using Google Docs with MCP tools
tags:
  - google
  - docs
  - document
  - automation
  - productivity
---

# Google Docs Automation

## Metadata

| Property | Value |
|----------|-------|
| Name | google-docs-automation |
| Version | 1.0.0 |
| Category | Integration |
| Complexity | Medium |
| Provider | Google Workspace |

## Instructions

Google Docsを使用したドキュメント自動生成と編集を行います。MCPサーバー `google-workspace` のツールを活用して、テンプレートベースの文書作成、レポート生成、ドキュメント更新を実現します。

### 前提条件

- `google-workspace` MCPサーバーが設定済み
- OAuth認証が完了していること
- 対象のドキュメントへのアクセス権限（既存ドキュメント編集時）

### 対応領域

1. **ドキュメント作成**: テンプレートからの文書生成
2. **コンテンツ追記**: 既存ドキュメントへの追記
3. **フォーマット適用**: 見出し、リスト、スタイル適用
4. **レポート生成**: データからの自動レポート作成
5. **ドキュメント読み取り**: 既存内容の抽出と分析

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| document_id | string | No | ドキュメントID（新規作成の場合は不要） |
| operation | string | Yes | 実行する操作タイプ |
| content | string | Varies | 追加/更新するコンテンツ |
| template | string | No | 使用するテンプレートタイプ |

## Output Process

### Step 1: ドキュメント準備

- [ ] 新規作成か既存編集かを判断
- [ ] テンプレートの選択（該当する場合）
- [ ] フォルダの指定（整理が必要な場合）

**テンプレートタイプ:**

| タイプ | 用途 | 構造 |
|--------|------|------|
| meeting-notes | 会議メモ | 日時、参加者、議題、決定事項、アクションアイテム |
| project-report | プロジェクト報告 | 概要、進捗、課題、次のステップ |
| technical-spec | 技術仕様書 | 概要、要件、設計、実装詳細 |
| weekly-report | 週報 | 今週の成果、来週の予定、課題、備考 |

### Step 2: コンテンツ操作

**MCPツールの使用:**

```
# ドキュメント作成
google_docs_create(title, content, folderId)

# ドキュメント読み取り
google_docs_read(documentId)

# コンテンツ追記
google_docs_append(documentId, content)

# フォーマット適用
google_docs_format(documentId, requests)
```

### Step 3: フォーマットとスタイリング

- [ ] 見出しレベルの設定
- [ ] リストの作成（箇条書き、番号付き）
- [ ] 強調（太字、斜体、下線）
- [ ] 構造の最終確認

## Output Format

```markdown
# Google Docs 操作結果

## ドキュメント情報
- **タイトル**: [title]
- **ドキュメントID**: [document_id]
- **操作**: [operation_type]

## 適用内容

### 追加コンテンツ
[content_summary]

### フォーマット
- [formatting_applied]

## リンク
- [ドキュメントを開く](document_url)

## プレビュー
[content_preview]
```

## Examples

### Example 1: 会議メモの作成

**Input:**
```
2024年1月10日のプロジェクトキックオフ会議メモを作成して
参加者: 田中、佐藤、鈴木
議題: Q1目標設定、タスク分担
```

**Output:**
```markdown
# ドキュメント作成完了

## ドキュメント
- **タイトル**: プロジェクトキックオフ会議メモ - 2024/01/10
- **テンプレート**: meeting-notes

## 内容プレビュー

# プロジェクトキックオフ会議メモ

**日時**: 2024年1月10日
**参加者**: 田中、佐藤、鈴木

## 議題
1. Q1目標設定
2. タスク分担

## 決定事項
- [追記してください]

## アクションアイテム
| 担当 | タスク | 期限 |
|------|--------|------|
| | | |

---

[ドキュメントを開く](https://docs.google.com/document/d/xxx/edit)
```

### Example 2: プロジェクト報告書の生成

**Input:**
```
プロジェクトAの月次報告書を作成
- 進捗: 70%完了
- 課題: リソース不足
- 次のマイルストーン: 2月末リリース
```

**Output:**
```markdown
# プロジェクト報告書作成完了

## ドキュメント詳細
- **タイトル**: プロジェクトA 月次報告書 - 2024年1月
- **作成日**: 2024-01-10

## 内容

### 進捗サマリー
- 全体進捗: 70%
- ステータス: オンスケジュール

### 主な課題
1. リソース不足
   - 影響: 一部タスクの遅延リスク
   - 対策: 追加リソースの検討中

### 次のステップ
- マイルストーン: 2月末リリース
- 重点項目: コア機能の完成

[ドキュメントを開く](https://docs.google.com/document/d/xxx/edit)
```

### Example 3: 既存ドキュメントへの追記

**Input:**
```
ドキュメントID: 1ABC...xyz に以下を追記して
## 更新情報 (2024-01-10)
- 仕様変更: APIエンドポイントの追加
- 影響範囲: フロントエンド、バックエンド
```

**Output:**
```markdown
# ドキュメント更新完了

## 更新内容
- **ドキュメント**: 技術仕様書 v1.2
- **追記位置**: 末尾

### 追加されたコンテンツ
## 更新情報 (2024-01-10)
- 仕様変更: APIエンドポイントの追加
- 影響範囲: フロントエンド、バックエンド

[ドキュメントを開く](https://docs.google.com/document/d/1ABC...xyz/edit)
```

## Templates

### 会議メモテンプレート

```markdown
# [会議タイトル]

**日時**: [日付]
**参加者**: [名前リスト]
**場所/方法**: [場所またはオンライン]

## 議題
1. [議題1]
2. [議題2]

## 議論内容

### [議題1]
-

### [議題2]
-

## 決定事項
-

## アクションアイテム
| 担当者 | タスク | 期限 |
|--------|--------|------|
| | | |

## 次回予定
- 日時:
- 議題:
```

### 週報テンプレート

```markdown
# 週報 - [名前] ([期間])

## 今週の成果
1.
2.
3.

## 進行中のタスク
- [ ]
- [ ]

## 来週の予定
1.
2.

## 課題・相談事項
-

## 備考
-
```

## Notes

- **インデックス**: Google Docs APIはドキュメント内の位置を1から始まるインデックスで管理
- **挿入順序**: 複数の挿入操作は逆順で実行（後ろから前へ）
- **フォーマット範囲**: 開始・終了インデックスを正確に指定する必要あり
- **日本語対応**: UTF-8で正しくエンコードされることを確認
- **制限事項**: 一度の操作でのリクエスト数に制限あり
- 関連スキル: [google-sheets-tasks](../google-sheets-tasks)
