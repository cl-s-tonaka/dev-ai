# Dev Skills マーケットプレイス

ソフトウェア開発向けに構造化された AI ワークフロー集です。8 つの開発者向けプラグインに **60 個のドメイン特化スキル** と **27 個の連携ワークフロー** を収録し、コード品質、アーキテクチャ、テスト、デバッグ、DevOps までカバーします。

## 概要

Dev Skills は、ソフトウェア開発者向けに設計された AI 駆動のスキルとコマンドを提供します。各スキルはドメイン知識（「何をするか」）をカプセル化し、コマンドは複数スキルを連結して実行可能なワークフロー（「どう進めるか」）にします。

### 共通スキルフォーマット

Dev Skills は pm-skills と同じ共通スキルフォーマットを採用しており、次と互換性があります。
- **Claude Code**（Anthropic 公式 CLI）
- **Cursor**
- **OpenCode**
- agentskills.io 仕様に対応した **その他の AI アシスタント**

## インストール

### Claude Code

```bash
# 単一プラグインをインストール
claude plugins:install ./dev-skills/dev-toolkit

# すべてのプラグインをインストール
for dir in dev-skills/dev-*/; do
  claude plugins:install "./$dir"
done
```

### Cursor / その他 IDE

プラグインディレクトリを IDE のプラグインフォルダにコピーするか、各 IDE のドキュメントに従って設定してください。

## プラグイン

| プラグイン | スキル数 | コマンド数 | 説明 |
|--------|--------|----------|-------------|
| [dev-toolkit](./dev-toolkit) | 6 | 5 | Git ワークフロー、コミット、PR、コード生成、正規表現、SQL |
| [dev-code-quality](./dev-code-quality) | 8 | 3 | コードレビュー、リファクタリング、クリーンコード、複雑度分析 |
| [dev-testing](./dev-testing) | 8 | 3 | テスト戦略、TDD、単体/統合/E2E テスト設計 |
| [dev-architecture](./dev-architecture) | 10 | 4 | システム設計、ADR、API 設計、マイクロサービス、C4 図 |
| [dev-debugging](./dev-debugging) | 6 | 3 | 根本原因分析、ログ分析、プロファイリング、ポストモーテム |
| [dev-documentation](./dev-documentation) | 7 | 3 | README、API ドキュメント、変更履歴、ランブック、オンボーディング |
| [dev-devops](./dev-devops) | 8 | 3 | CI/CD、Docker、Kubernetes、IaC、監視、SRE |
| [dev-security](./dev-security) | 7 | 3 | セキュリティレビュー、脅威モデリング、依存関係監査 |

**合計: 60 スキル、27 コマンド**

## クイックスタート

### コマンド（ワークフロー）

コマンドはスラッシュ付きで実行し、複数のスキルを連結して動かします。

```
/review src/auth/login.ts          # 包括的なコードレビュー
/test-plan                         # テスト戦略を作成
/design user-authentication        # システム設計ワークフロー
/debug                             # デバッグワークフロー
/commit                            # Conventional Commits 形式のメッセージ
```

### スキル（ドメイン知識）

スキルは文脈に応じて自動でトリガーされるほか、直接指定することもできます。

```
"この関数の分析に code-review スキルを適用して"
"テスト作成を手伝うために tdd-guide スキルを使って"
"REST エンドポイント向けの api-design で支援がほしい"
```

## コマンドリファレンス

### dev-toolkit
| コマンド | 説明 |
|---------|-------------|
| `/commit` | Conventional Commits 準拠のメッセージを生成 |
| `/pr` | 説明文とレビューチェックリスト付きで PR を作成 |
| `/git` | Git ワークフローのガイダンス |
| `/generate` | コード生成（ボイラープレート、スキャフォールディング） |
| `/sql` | SQL クエリの作成と最適化 |

### dev-code-quality
| コマンド | 説明 |
|---------|-------------|
| `/review` | 包括的なコードレビューのワークフロー |
| `/refactor` | リファクタリングのワークフロー（分析 → 計画 → 実行） |
| `/tech-debt` | 技術的負債の可視化と返済計画 |

### dev-testing
| コマンド | 説明 |
|---------|-------------|
| `/test-plan` | テスト戦略とテストケースを作成 |
| `/tdd` | TDD ワークフロー（red → green → refactor） |
| `/coverage` | カバレッジ分析と改善計画 |

### dev-architecture
| コマンド | 説明 |
|---------|-------------|
| `/design` | システム設計ワークフロー |
| `/adr` | Architecture Decision Record を作成 |
| `/api` | API 設計ワークフロー |
| `/scale` | スケーラビリティ分析と改善 |

### dev-debugging
| コマンド | 説明 |
|---------|-------------|
| `/debug` | デバッグワークフロー（再現 → 分析 → 修正） |
| `/postmortem` | インシデントのポストモーテム分析 |
| `/profile` | パフォーマンスのプロファイリングと最適化 |

### dev-documentation
| コマンド | 説明 |
|---------|-------------|
| `/docs` | ドキュメント生成ワークフロー |
| `/readme` | README.md を生成または更新 |
| `/changelog` | CHANGELOG エントリを生成 |

### dev-devops
| コマンド | 説明 |
|---------|-------------|
| `/pipeline` | CI/CD パイプライン設計 |
| `/deploy` | デプロイ戦略設計 |
| `/monitor` | 監視とアラート設定 |

### dev-security
| コマンド | 説明 |
|---------|-------------|
| `/security` | セキュリティレビューのワークフロー |
| `/threat-model` | STRIDE を用いた脅威モデリング |
| `/audit` | 依存関係とコード脆弱性の監査 |

## コントリビューション

ガイドラインは [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## 検証

すべてのプラグインを確認するには、バリデーターを実行します。

```bash
python3 validate_plugins.py
```

## ライセンス

[MIT License](./LICENSE)
