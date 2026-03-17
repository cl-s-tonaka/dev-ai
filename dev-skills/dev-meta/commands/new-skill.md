---
name: new-skill
version: 1.0.0
description: Generate a new skill directly without gap analysis
argument-hint: "[skill name] [options]"
arguments:
  - name: name
    description: Name of the skill to create
    required: true
  - name: category
    description: Target category/plugin
    required: false
  - name: tags
    description: Comma-separated tags
    required: false
  - name: description
    description: Brief description of the skill
    required: false
examples:
  - "/new-skill graphql-api-design --category architecture"
  - "/new-skill websocket-patterns --category architecture --tags websocket,realtime"
  - "/new-skill flutter-testing --category testing --description 'Flutter widget and integration testing'"
---

# /new-skill

新しいスキルを直接生成します。ギャップ分析をスキップして、指定されたトピックのスキルを即座に作成します。

## Metadata

| Property | Value |
|----------|-------|
| Command | /new-skill |
| Skills | [skill-research](../skills/skill-research/SKILL.md), [skill-generator](../skills/skill-generator/SKILL.md) |
| Category | Meta |

## Instructions

`/new-skill` コマンドが呼び出されたら、以下の手順で新しいスキルを生成します：

### Step 1: 入力の検証

1. **スキル名の検証**
   - 形式: lowercase-hyphenated（例: `api-design`, `test-strategy`）
   - 既存スキルとの重複チェック

2. **カテゴリの決定**
   - 指定がある場合: 指定されたカテゴリを使用
   - 指定がない場合: スキル名から推測、またはユーザーに確認

3. **ターゲットプラグインの決定**

| カテゴリ | プラグイン |
|----------|------------|
| toolkit, utility | dev-toolkit |
| quality, review, refactoring | dev-code-quality |
| testing, tdd, coverage | dev-testing |
| architecture, design, api | dev-architecture |
| debugging, profiling, analysis | dev-debugging |
| documentation, docs, readme | dev-documentation |
| devops, ci, deployment, kubernetes | dev-devops |
| security, audit, threat | dev-security |

### Step 2: 調査の実施

1. **クイック調査**
   - トピックに関する主要概念
   - ベストプラクティス
   - 一般的なパターン

2. **構造化**
   - 調査結果をスキル生成に適した形式に整理

### Step 3: スキル生成

1. **SKILL.md の生成**
   - 標準フォーマットに準拠
   - 全必須セクションを含む
   - 実践的な例を追加

2. **品質チェック**
   - フロントマターの検証
   - セクションの完全性
   - 例の妥当性

### Step 4: 出力

1. **プレビュー表示**
   - 生成されたスキルの全内容を表示

2. **保存パスの提案**
   - ディレクトリ構造を含む完全なパス

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | スキル名（lowercase-hyphenated形式）|
| category | string | No | カテゴリ（architecture, testing, etc.）|
| tags | string | No | カンマ区切りのタグ |
| description | string | No | スキルの簡潔な説明 |

## Output Format

```markdown
# 新規スキル生成

## スキル情報
- **名前**: [skill-name]
- **カテゴリ**: [Category]
- **プラグイン**: [target-plugin]
- **タグ**: [tag1], [tag2], [tag3]
- **説明**: [description]

## 調査サマリー

### 主要トピック
- [トピック1]
- [トピック2]

### ベストプラクティス
- [プラクティス1]
- [プラクティス2]

---

## 生成されたスキル

```markdown
---
name: [skill-name]
version: 1.0.0
description: [description]
tags:
  - [tag1]
  - [tag2]
---

# [Skill Title]

[完全なSKILL.mdの内容]
```

---

## 保存先
```
[plugin]/skills/[skill-name]/SKILL.md
```

## 保存コマンド
```bash
mkdir -p [plugin]/skills/[skill-name]
# 上記のスキル内容を SKILL.md として保存
```

## 検証
```bash
python3 validate_plugins.py
```
```

## Examples

### Example 1: 基本的な使用

#### Input
```
/new-skill graphql-api-design --category architecture
```

#### Output
```markdown
# 新規スキル生成

## スキル情報
- **名前**: graphql-api-design
- **カテゴリ**: Architecture
- **プラグイン**: dev-architecture
- **タグ**: graphql, api, schema-design
- **説明**: Design GraphQL APIs with proper schema structure and best practices

## 調査サマリー

### 主要トピック
- GraphQL Schema Definition Language (SDL)
- Type system and resolvers
- Performance optimization

### ベストプラクティス
- Schema-first design approach
- Use DataLoader for batching
- Implement query complexity limits

---

## 生成されたスキル

```markdown
---
name: graphql-api-design
version: 1.0.0
description: Design GraphQL APIs with proper schema structure and best practices
tags:
  - graphql
  - api
  - schema-design
---

# GraphQL API Design

## Metadata

| Property | Value |
|----------|-------|
| Name | graphql-api-design |
| Version | 1.0.0 |
| Category | Architecture |
| Complexity | High |

## Instructions

[...完全な内容...]
```

---

## 保存先
```
dev-architecture/skills/graphql-api-design/SKILL.md
```
```

### Example 2: タグと説明を指定

#### Input
```
/new-skill flutter-widget-testing --category testing --tags flutter,widget,mobile --description "Flutter widget testing patterns and best practices"
```

#### Output
```markdown
# 新規スキル生成

## スキル情報
- **名前**: flutter-widget-testing
- **カテゴリ**: Testing
- **プラグイン**: dev-testing
- **タグ**: flutter, widget, mobile
- **説明**: Flutter widget testing patterns and best practices

[...続く...]
```

## Notes

- スキル名は必ず lowercase-hyphenated 形式で指定
- カテゴリを省略した場合、スキル名から推測を試みる
- 生成されたスキルは自動保存されない（レビュー後に手動保存）
- 既存スキルとの重複がある場合は警告を表示
- 詳細な調査が必要な場合は `/skill-gap` コマンドを使用推奨
