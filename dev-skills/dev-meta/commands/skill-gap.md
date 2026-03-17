---
name: skill-gap
version: 1.0.0
description: Analyze skill gaps, research missing domains, and generate new skills
argument-hint: "[topic or request]"
arguments:
  - name: topic
    description: The topic or request to analyze for skill coverage
    required: true
  - name: depth
    description: Research depth (quick, standard, comprehensive)
    required: false
  - name: auto-generate
    description: Automatically generate skill if gap is found
    required: false
examples:
  - "/skill-gap GraphQL API設計のベストプラクティス"
  - "/skill-gap Rustの並行処理パターン --depth comprehensive"
  - "/skill-gap WebSocket実装 --auto-generate"
---

# /skill-gap

スキルギャップの検出、調査、新スキル生成を一連のワークフローとして実行します。

## Metadata

| Property | Value |
|----------|-------|
| Command | /skill-gap |
| Skills | [skill-gap-analysis](../skills/skill-gap-analysis/SKILL.md), [skill-research](../skills/skill-research/SKILL.md), [skill-generator](../skills/skill-generator/SKILL.md) |
| Category | Meta |

## Instructions

`/skill-gap` コマンドが呼び出されたら、以下のワークフローを実行します：

### Phase 1: Gap Analysis（ギャップ分析）

1. **既存スキルのスキャン**
   - 全プラグイン（dev-toolkit, dev-code-quality, dev-testing, dev-architecture, dev-debugging, dev-documentation, dev-devops, dev-security）のスキルを確認
   - ユーザーのリクエストに関連するスキルを特定

2. **カバレッジ評価**
   - 関連スキルがリクエストをどの程度カバーするか評価
   - カバレッジレベル: Full (90-100%), Partial (50-89%), Minimal (20-49%), None (0-19%)

3. **判定**
   - Full: 既存スキルを推奨して終了
   - Partial以下: Phase 2へ進む

### Phase 2: Research（調査）

1. **スコープ定義**
   - 不足している領域を明確化
   - 調査すべき具体的なトピックをリストアップ

2. **情報収集**
   - ベストプラクティスの調査
   - デザインパターンの特定
   - アンチパターンの把握
   - ツール・技術のサーベイ

3. **統合**
   - 調査結果を構造化
   - スキル生成に必要な情報を整理

### Phase 3: Generation（生成）

1. **スキル設計**
   - スキル名の決定
   - カテゴリ・タグの選定
   - ターゲットプラグインの決定

2. **コンテンツ生成**
   - SKILL.md フォーマットで生成
   - 既存スキルと同等の品質を確保

3. **レビュー提示**
   - 生成したスキルをユーザーに提示
   - 保存先パスを提案

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| topic | string | Yes | 分析するトピックまたはリクエスト |
| depth | string | No | 調査深度: quick, standard, comprehensive（デフォルト: standard）|
| auto-generate | boolean | No | ギャップ発見時に自動でスキル生成するか |

## Output Format

```markdown
# スキルギャップ分析レポート

## リクエスト
[ユーザーのリクエスト内容]

---

## Phase 1: ギャップ分析

### 関連する既存スキル
| スキル | プラグイン | 関連度 | カバー範囲 |
|--------|------------|--------|------------|
| [skill] | [plugin] | [High/Medium/Low] | [説明] |

### カバレッジ評価
**総合カバレッジ**: [X]% ([Full/Partial/Minimal/None])

### ギャップ
1. **[ギャップ名]**
   - 不足: [何が足りないか]
   - 影響: [High/Medium/Low]

### 判定
[既存スキルで対応可能 / 新スキル作成を推奨]

---

## Phase 2: 調査 (ギャップがある場合)

### 調査範囲
- [トピック1]
- [トピック2]

### 主要な発見

#### ベストプラクティス
1. [プラクティス1]
2. [プラクティス2]

#### デザインパターン
1. [パターン1]
2. [パターン2]

#### アンチパターン
1. [アンチパターン1]

---

## Phase 3: スキル生成 (推奨される場合)

### 提案するスキル
- **名前**: [skill-name]
- **カテゴリ**: [Category]
- **ターゲット**: [target-plugin]
- **タグ**: [tag1], [tag2]

### 生成されたスキル

```markdown
[完全なSKILL.mdの内容]
```

### 保存先
`[plugin]/skills/[skill-name]/SKILL.md`

---

## 次のステップ
1. [アクション1]
2. [アクション2]
```

## Examples

### Input
```
/skill-gap GraphQL APIの設計とスキーマ管理
```

### Output
```markdown
# スキルギャップ分析レポート

## リクエスト
GraphQL APIの設計とスキーマ管理に関するガイダンス

---

## Phase 1: ギャップ分析

### 関連する既存スキル
| スキル | プラグイン | 関連度 | カバー範囲 |
|--------|------------|--------|------------|
| api-design | dev-architecture | Medium | REST API設計が主、GraphQL特有の内容なし |
| system-design | dev-architecture | Low | 全体設計、API層の詳細なし |

### カバレッジ評価
**総合カバレッジ**: 30% (Minimal)

### ギャップ
1. **GraphQLスキーマ設計**
   - 不足: SDL記法、型システム、スキーマファースト設計
   - 影響: High

2. **リゾルバーパターン**
   - 不足: DataLoader、N+1問題対策、コンテキスト設計
   - 影響: High

3. **GraphQLパフォーマンス**
   - 不足: クエリ複雑度分析、キャッシング戦略
   - 影響: Medium

### 判定
**新スキル作成を推奨** - 既存スキルではGraphQL特有の設計パターンとベストプラクティスをカバーできません。

---

## Phase 2: 調査

### 調査範囲
- GraphQL SDL とスキーマ設計原則
- リゾルバーアーキテクチャ
- パフォーマンス最適化手法

### 主要な発見

#### ベストプラクティス
1. スキーマファースト設計を採用し、APIコントラクトを先に定義
2. 適切なnullability（!マーク）の使用
3. Relay-styleのConnection/Edgeパターンでページネーション

#### デザインパターン
1. **DataLoaderパターン**: バッチ処理でN+1問題を解決
2. **Connectionパターン**: カーソルベースのページネーション

#### アンチパターン
1. DBスキーマをそのままGraphQLスキーマに反映（結合度が高くなる）

---

## Phase 3: スキル生成

### 提案するスキル
- **名前**: graphql-api-design
- **カテゴリ**: Architecture
- **ターゲット**: dev-architecture
- **タグ**: graphql, api, schema-design, performance

### 生成されたスキル

[完全なSKILL.mdがここに生成される]

### 保存先
`dev-architecture/skills/graphql-api-design/SKILL.md`

---

## 次のステップ
1. 生成されたスキルをレビュー
2. 必要に応じて内容を調整
3. 指定されたパスに保存
4. `python3 validate_plugins.py` で検証
```

## Notes

- ギャップ分析は全8プラグインを対象に実施
- 調査にはWeb検索を活用して最新のベストプラクティスを収集
- 生成されたスキルは既存スキルと同等の品質・フォーマットに準拠
- 保存は手動で行う（自動保存はしない）
- 必要に応じて `example-skills:skill-creator` スキルも参照可能
