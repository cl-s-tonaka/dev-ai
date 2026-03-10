# Dev Code Quality プラグイン

包括的なコードレビュー、リファクタリング、クリーンコード原則、複雑度分析、性能最適化のためのコード品質スキルを提供します。

## 概要

`dev-code-quality` プラグインは、コードベース全体の品質維持・改善に必要な基本スキルを提供します。SOLID 原則の適用からコードスメル検出まで、クリーンで保守しやすく高性能なコード実現を支援します。

## スキル (8)

| スキル | 説明 |
|-------|-------------|
| [code-review](skills/code-review/SKILL.md) | SOLID 原則、可読性、性能観点を含む包括的なコードレビュー |
| [refactoring-plan](skills/refactoring-plan/SKILL.md) | 技術的負債の特定と優先付けを含むリファクタリング計画を作成 |
| [clean-code-check](skills/clean-code-check/SKILL.md) | クリーンコード原則とベストプラクティスへの準拠を検証 |
| [naming-conventions](skills/naming-conventions/SKILL.md) | 命名規約と一貫性を確認し、改善提案を提示 |
| [complexity-analysis](skills/complexity-analysis/SKILL.md) | 循環的複雑度・認知的複雑度を分析し、改善案を提示 |
| [code-smell-detection](skills/code-smell-detection/SKILL.md) | コードスメルを検出し、リファクタリング推奨を提示 |
| [dependency-analysis](skills/dependency-analysis/SKILL.md) | 依存関係の最適化、循環参照、結合度問題を分析 |
| [performance-review](skills/performance-review/SKILL.md) | ボトルネックと最適化機会を特定する性能重視コードレビュー |

## コマンド (3)

| コマンド | 説明 | 使い方 |
|---------|-------------|-------|
| `/review` | 包括的なコードレビュー | `/review [file or code block]` |
| `/refactor` | リファクタリングワークフロー | `/refactor [code or module to refactor]` |
| `/tech-debt` | 技術的負債分析 | `/tech-debt [codebase or module]` |

## クイックスタート

### コードレビュー
```
/review src/services/UserService.ts
```

### リファクタリング
```
/refactor The authentication module needs cleanup
```

### 技術的負債
```
/tech-debt Analyze the payment processing module
```

## ベストプラクティス

1. **定期レビュー**: すべての PR で `/review` を使い、問題を早期に検出する
2. **段階的リファクタリング**: `/refactor` で安全な段階的改善を計画する
3. **技術的負債の追跡**: 四半期ごとに `/tech-debt` を実施し、コード健全性を可視化する
4. **SOLID 準拠**: 保守しやすい設計のために SOLID 原則を徹底する
5. **複雑度予算**: モジュールごとに複雑度しきい値を設定し監視する

## 連携

このプラグインは、他の dev-skills プラグインとシームレスに連携できます。
- **dev-toolkit**: コミット/PR ワークフローと組み合わせる
- **dev-testing**: リファクタリングでテストが壊れないことを担保する
- **dev-documentation**: リファクタリング後のドキュメント更新を維持する

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照してください。
