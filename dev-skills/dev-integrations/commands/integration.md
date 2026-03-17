---
name: integration
version: 1.0.0
description: Design integrations with external services and providers
argument-hint: "[service or provider]"
arguments:
  - name: service
    description: The service or provider to integrate
    required: true
  - name: use-case
    description: Specific use case for the integration
    required: false
examples:
  - "/integration aws-lambda S3トリガーで画像処理"
  - "/integration stripe サブスクリプション決済"
  - "/integration terraform VPCモジュール設計"
  - "/integration google-sheets タスク管理シート作成"
  - "/integration google-docs 月次レポート自動生成"
---

# /integration

外部サービスやプロバイダとの統合設計ワークフローを実行します。

## Metadata

| Property | Value |
|----------|-------|
| Command | /integration |
| Category | Integration |

## Instructions

`/integration` コマンドが呼び出されたら、指定されたサービス/プロバイダに対応するスキルを使用して統合設計を支援します。

### Step 1: サービス特定

1. **プロバイダの識別**
   - クラウド: AWS, GCP, Azure
   - SaaS: Stripe, Auth0, Twilio
   - Google Workspace: Sheets, Docs, Drive
   - インフラ: Terraform, Pulumi
   - その他: 指定されたサービス

2. **対応スキルの確認**
   - 利用可能なスキルがある場合: そのスキルを適用
   - ない場合: `/skill-gap` で新規作成を提案

### Step 2: 要件収集

- [ ] ユースケースの明確化
- [ ] 技術スタックの確認
- [ ] 制約事項の把握
- [ ] セキュリティ要件

### Step 3: 設計実行

対応するスキルのワークフローを実行:

| サービス | スキル | 主な成果物 |
|----------|--------|-----------|
| AWS Lambda | aws-lambda | 関数設計、IAMポリシー |
| Terraform | terraform-modules | モジュール構造、変数設計 |
| Stripe | stripe-payments | 決済フロー、Webhook設計 |
| Google Sheets | google-sheets-tasks | データ管理、タスクトラッキング |
| Google Docs | google-docs-automation | ドキュメント生成、テンプレート |

### Step 4: 成果物提供

- 設計ドキュメント
- 実装コード例
- セットアップ手順
- テスト計画

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| service | string | Yes | 統合するサービスまたはプロバイダ |
| use_case | string | No | 具体的なユースケース |

## Output Format

```markdown
# 統合設計: [Service]

## サービス情報
- **プロバイダ**: [provider]
- **適用スキル**: [skill-name]
- **ユースケース**: [use-case]

## 設計

[対応スキルの出力フォーマットに従う]

## 実装ガイド

### 前提条件
- [requirement 1]
- [requirement 2]

### セットアップ手順
1. [step 1]
2. [step 2]

### 実装コード
```[language]
[code]
```

## テスト

### テストシナリオ
1. [scenario 1]
2. [scenario 2]

## 次のステップ
1. [action 1]
2. [action 2]
```

## Examples

### Input
```
/integration stripe サブスクリプション課金の実装
```

### Output
```markdown
# 統合設計: Stripe Subscriptions

## サービス情報
- **プロバイダ**: Stripe
- **適用スキル**: stripe-payments
- **ユースケース**: SaaSアプリケーションの月額課金

## 設計

[stripe-payments スキルの出力に従った詳細設計]

## 実装ガイド

### 前提条件
- Stripeアカウント
- Node.js 18+
- データベース（顧客情報保存用）

### セットアップ手順
1. Stripe SDK インストール: `npm install stripe`
2. 環境変数設定: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
3. Products/Prices の作成（Stripe Dashboard）

[続く...]
```

## Notes

- 対応スキルがない場合は `/skill-gap` を提案
- 複数サービスの組み合わせも対応可能
- セキュリティ要件は各スキルの推奨に従う
- 本番環境への適用前にテスト環境で検証
