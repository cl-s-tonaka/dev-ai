# Dev Toolkit プラグイン

Git ワークフロー、コミットメッセージ、PR テンプレート、コード生成、正規表現作成、SQL クエリ最適化のための開発ユーティリティスキルを提供します。

## 概要

`dev-toolkit` プラグインは、よくある開発作業を効率化するための基本的な生産性スキルを提供します。適切なコミットメッセージ作成から複雑な SQL クエリ構築まで、開発ワークフロー全体で一貫性とベストプラクティス維持を支援します。

## スキル

| スキル | 説明 |
|-------|-------------|
| [git-workflow](skills/git-workflow/SKILL.md) | Git ブランチ戦略（GitFlow、GitHub Flow、Trunk-based）を設計・実装 |
| [commit-message](skills/commit-message/SKILL.md) | Conventional Commits 準拠のコミットメッセージを作成 |
| [pr-template](skills/pr-template/SKILL.md) | PR テンプレートと包括的な説明文を生成 |
| [code-generation](skills/code-generation/SKILL.md) | ボイラープレートコードとプロジェクト雛形を生成 |
| [regex-builder](skills/regex-builder/SKILL.md) | 正規表現を構築・解説・テスト |
| [sql-query-builder](skills/sql-query-builder/SKILL.md) | SQL クエリを構築・最適化 |

## コマンド

| コマンド | 説明 | 使い方 |
|---------|-------------|-------|
| `/commit` | Conventional Commits 形式のメッセージを生成 | `/commit [changes description]` |
| `/pr` | 説明文とチェックリスト付きで PR を作成 | `/pr [feature/changes description]` |
| `/git` | Git ワークフローのガイダンスとコマンド支援 | `/git [workflow question or task]` |
| `/generate` | 仕様からコードを生成 | `/generate [code requirements]` |
| `/sql` | SQL クエリの構築と最適化 | `/sql [query requirements]` |

## クイックスタート

### コミットメッセージ
```
/commit Added user authentication with JWT tokens
```

### プルリクエスト
```
/pr Implemented user dashboard with analytics
```

### Git ワークフロー
```
/git How should I set up GitFlow for a release?
```

### コード生成
```
/generate Create a REST API endpoint for user management
```

### SQL クエリ
```
/sql Find all users who made purchases in the last 30 days with total spend
```

## ベストプラクティス

1. **コミットの一貫性**: `/commit` を使い、すべてのコミットを Conventional Commits 形式で統一する
2. **網羅的な PR**: `/pr` でレビューチェックリスト付きの明確な PR を作成する
3. **ワークフロー統一**: `/git` を使ってチーム内の Git 運用を統一する
4. **コード標準化**: `/generate` をプロジェクト固有テンプレートと組み合わせ、構造を統一する
5. **クエリ最適化**: `/sql` で効率的かつ可読性の高い DB クエリを作成する

## 連携

このプラグインは、他の pm-skills プラグインとシームレスに連携できます。
- **code-quality**: Lint やテストスキルと組み合わせる
- **documentation**: コードとあわせてドキュメントを生成する
- **project-management**: コミットと PR をプロジェクトタスクに紐付ける

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照してください。
