# dev-ai

Claude Code 向けの AI 駆動開発スキル集です。ソフトウェア開発のあらゆるフェーズを支援する **60 個のドメイン特化スキル** と **27 個の連携ワークフロー** を提供します。

## 特徴

- **Claude Code ネイティブ対応** - スラッシュコマンドとスキルの両方で利用可能
- **マルチツール互換** - Claude Code、Cursor、OpenCode、その他 agentskills.io 仕様対応ツール
- **8 つの開発ドメイン** - コード品質からセキュリティまで網羅的にカバー
- **マーケットプレイス対応** - `claude plugin marketplace` で共有可能

## クイックスタート

### インストール

```bash
# 単一プラグインをインストール
claude plugin install ./dev-skills/dev-toolkit

# すべてのプラグインを一括インストール
for dir in dev-skills/dev-*/; do
  claude plugin install "./$dir"
done

# インストール済みプラグインを確認
claude plugin list
```

### 使い方

**スラッシュコマンド（ワークフロー）:**
```
/commit Added user authentication    # Conventional Commits 形式で生成
/review src/auth/login.ts            # 包括的コードレビュー
/test-plan                           # テスト戦略を作成
/design user-service                 # システム設計ワークフロー
/security                            # セキュリティレビュー
```

**スキル（コンテキスト内で自動適用）:**
```
"この関数に code-review スキルを適用して"
"tdd-guide スキルでテスト作成を手伝って"
"api-design でエンドポイント設計を支援して"
```

## プラグイン一覧

| プラグイン | スキル | コマンド | 説明 |
|-----------|--------|----------|------|
| **dev-toolkit** | 6 | 5 | Git、コミット、PR、コード生成、正規表現、SQL |
| **dev-code-quality** | 8 | 3 | コードレビュー、リファクタリング、クリーンコード |
| **dev-testing** | 8 | 3 | テスト戦略、TDD、単体/統合/E2E テスト |
| **dev-architecture** | 10 | 4 | システム設計、ADR、API、マイクロサービス |
| **dev-debugging** | 6 | 3 | 根本原因分析、ログ分析、ポストモーテム |
| **dev-documentation** | 7 | 3 | README、API ドキュメント、変更履歴 |
| **dev-devops** | 8 | 3 | CI/CD、Docker、Kubernetes、監視 |
| **dev-security** | 7 | 3 | セキュリティレビュー、脅威モデリング |

**合計: 60 スキル、27 コマンド**

## コマンドリファレンス

### 日常開発
| コマンド | 説明 |
|---------|------|
| `/commit` | Conventional Commits 準拠のコミットメッセージ生成 |
| `/pr` | PR 作成（説明文とレビューチェックリスト付き） |
| `/review` | 包括的なコードレビュー |
| `/refactor` | リファクタリング計画と実行 |

### テスト・品質
| コマンド | 説明 |
|---------|------|
| `/test-plan` | テスト戦略とテストケース作成 |
| `/tdd` | TDD ワークフロー（Red → Green → Refactor） |
| `/coverage` | カバレッジ分析と改善計画 |

### 設計・アーキテクチャ
| コマンド | 説明 |
|---------|------|
| `/design` | システム設計ワークフロー |
| `/adr` | Architecture Decision Record 作成 |
| `/api` | API 設計ワークフロー |

### 運用・セキュリティ
| コマンド | 説明 |
|---------|------|
| `/debug` | デバッグワークフロー |
| `/security` | セキュリティレビュー |
| `/pipeline` | CI/CD パイプライン設計 |

## マーケットプレイスとして利用

このプロジェクトを他者と共有する場合、マーケットプレイスとして登録できます。

```bash
# ローカルからマーケットプレイスとして追加
claude plugin marketplace add ./dev-skills

# または GitHub リポジトリから追加
claude plugin marketplace add https://github.com/your-org/dev-ai

# マーケットプレイス経由でインストール
claude plugin install dev-toolkit@dev-skills
```

### 登録済みマーケットプレイスを確認
```bash
claude plugin marketplace list
```

## ディレクトリ構造

```
dev-ai/
├── README.md
└── dev-skills/
    ├── .claude-plugin/
    │   └── marketplace.json      # マーケットプレイス定義
    ├── dev-toolkit/
    │   ├── .claude-plugin/
    │   │   └── plugin.json       # プラグイン定義
    │   ├── commands/             # スラッシュコマンド
    │   │   ├── commit.md
    │   │   ├── pr.md
    │   │   └── ...
    │   └── skills/               # ドメインスキル
    │       ├── commit-message/
    │       │   └── SKILL.md
    │       └── ...
    ├── dev-code-quality/
    ├── dev-testing/
    ├── dev-architecture/
    ├── dev-debugging/
    ├── dev-documentation/
    ├── dev-devops/
    └── dev-security/
```

## スキルとコマンドの違い

| | スキル | コマンド |
|---|--------|----------|
| **役割** | ドメイン知識（何をするか） | ワークフロー（どう進めるか） |
| **呼び出し** | 文脈に応じて自動適用 | `/command` で明示的に実行 |
| **粒度** | 単一タスク | 複数スキルを連結 |
| **例** | `commit-message`, `code-review` | `/commit`, `/review` |

## 開発・コントリビューション

```bash
# プラグインの検証
python3 dev-skills/validate_plugins.py

# 新しいスキルを追加
# 1. skills/<skill-name>/SKILL.md を作成
# 2. frontmatter に name, description を記載
# 3. バリデータで検証
```

詳細は [CONTRIBUTING.md](./dev-skills/CONTRIBUTING.md) を参照してください。

## 互換性

| ツール | 対応状況 |
|--------|----------|
| Claude Code | フル対応 |
| Cursor | 対応 |
| OpenCode | 対応 |
| agentskills.io 仕様 | 互換 |

## ライセンス

[MIT License](./dev-skills/LICENSE)
