# dev-integrations

特定のサービスやプロバイダに依存するスキル集です。クラウドサービス、SaaS プラットフォーム、インフラツールなど、オプショナルな統合スキルを提供します。

## 特徴

- **オプショナル**: 必要なプロバイダのスキルだけを利用可能
- **プロバイダ固有**: 各サービスのベストプラクティスと実装パターン
- **最新対応**: プロバイダのAPI変更に追従

## スキル

### クラウドプロバイダ

| スキル | プロバイダ | 説明 |
|--------|------------|------|
| aws-lambda | AWS | Lambda関数の設計とデプロイ |
| aws-s3 | AWS | S3バケットの設計とアクセスパターン |
| aws-dynamodb | AWS | DynamoDBのテーブル設計とクエリ最適化 |
| gcp-cloud-functions | GCP | Cloud Functionsの設計 |
| gcp-bigquery | GCP | BigQueryのスキーマ設計とクエリ最適化 |
| azure-functions | Azure | Azure Functionsの設計 |

### SaaS プラットフォーム

| スキル | サービス | 説明 |
|--------|----------|------|
| stripe-payments | Stripe | 決済統合の設計とベストプラクティス |
| auth0-integration | Auth0 | 認証・認可の統合パターン |
| twilio-messaging | Twilio | SMS/音声統合の設計 |

### インフラストラクチャツール

| スキル | ツール | 説明 |
|--------|--------|------|
| terraform-modules | Terraform | モジュール設計とベストプラクティス |
| pulumi-components | Pulumi | コンポーネント設計パターン |
| github-actions | GitHub | ワークフロー設計 |

### データベース

| スキル | DB | 説明 |
|--------|-----|------|
| postgresql-optimization | PostgreSQL | クエリ最適化とインデックス設計 |
| mongodb-schema | MongoDB | スキーマ設計とアグリゲーション |
| redis-patterns | Redis | キャッシュパターンとデータ構造 |

## コマンド

| コマンド | 説明 |
|----------|------|
| `/integration` | 統合設計のワークフロー |

## インストール

```bash
claude plugins:install ./dev-skills/dev-integrations
```

## 使用例

```
"AWS Lambda関数の設計について、aws-lambdaスキルを適用して"
"Stripeの決済フローを設計したい"
"Terraformモジュールの構成をレビューして"
```

## スキル追加

新しいプロバイダやサービスのスキルを追加する場合は、以下の命名規則に従ってください：

```
[provider]-[service]
例: aws-lambda, gcp-bigquery, stripe-payments
```

`/skill-gap` や `/new-skill` コマンドを使用してスキルを生成できます。
