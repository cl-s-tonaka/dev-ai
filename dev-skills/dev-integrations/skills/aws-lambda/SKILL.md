---
name: aws-lambda
version: 1.0.0
description: Design and implement AWS Lambda functions following best practices
tags:
  - aws
  - lambda
  - serverless
  - cloud
---

# AWS Lambda

## Metadata

| Property | Value |
|----------|-------|
| Name | aws-lambda |
| Version | 1.0.0 |
| Category | Integration |
| Complexity | Medium |
| Provider | AWS |

## Instructions

AWS Lambda関数の設計、実装、デプロイに関するガイダンスを提供します。コールドスタート最適化、エラーハンドリング、セキュリティ設定など、プロダクションレディな関数を構築するためのベストプラクティスに従います。

### 対応領域

1. **関数設計**: ハンドラー構造、依存関係管理
2. **パフォーマンス**: コールドスタート対策、メモリ/タイムアウト設定
3. **セキュリティ**: IAMロール、VPC設定、環境変数
4. **モニタリング**: CloudWatch、X-Ray統合
5. **デプロイ**: SAM、CDK、Terraform連携

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| use_case | string | Yes | Lambda関数のユースケース |
| runtime | string | No | ランタイム（nodejs, python, go, etc.） |
| trigger | string | No | トリガーソース（API Gateway, S3, SQS, etc.） |
| constraints | string | No | パフォーマンスやセキュリティ要件 |

## Output Process

### Step 1: 要件分析

- [ ] ユースケースの特定（同期/非同期）
- [ ] トリガーソースの選定
- [ ] 期待されるトラフィックパターン
- [ ] レイテンシ要件の確認

**トリガータイプ別考慮事項:**

| トリガー | 同期/非同期 | 考慮点 |
|----------|-------------|--------|
| API Gateway | 同期 | コールドスタート、タイムアウト29秒制限 |
| S3 | 非同期 | リトライ、べき等性 |
| SQS | 非同期 | バッチサイズ、可視性タイムアウト |
| EventBridge | 非同期 | イベントパターン、DLQ設定 |
| DynamoDB Streams | 非同期 | バッチサイズ、並列度 |

### Step 2: 関数設計

- [ ] ハンドラー構造の定義
- [ ] レイヤー活用の検討
- [ ] 環境変数の設計
- [ ] エラーハンドリング戦略

**推奨ハンドラー構造 (Node.js):**

```javascript
// handler.js
import { Logger } from '@aws-lambda-powertools/logger';
import { Tracer } from '@aws-lambda-powertools/tracer';
import { Metrics } from '@aws-lambda-powertools/metrics';

const logger = new Logger();
const tracer = new Tracer();
const metrics = new Metrics();

export const handler = async (event, context) => {
  // コンテキスト設定
  logger.addContext(context);

  try {
    // 入力バリデーション
    const input = validateInput(event);

    // ビジネスロジック
    const result = await processRequest(input);

    // メトリクス記録
    metrics.addMetric('SuccessfulInvocations', 'Count', 1);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    logger.error('Handler error', { error });
    metrics.addMetric('FailedInvocations', 'Count', 1);

    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

### Step 3: パフォーマンス最適化

- [ ] メモリサイズの最適化
- [ ] Provisioned Concurrencyの検討
- [ ] 接続再利用の実装
- [ ] バンドルサイズの最小化

**コールドスタート対策:**

| 対策 | 効果 | コスト影響 |
|------|------|-----------|
| メモリ増加 | CPU比例で改善 | 増加 |
| Provisioned Concurrency | 劇的に改善 | 大幅増加 |
| 軽量ランタイム (Go, Rust) | 大幅改善 | なし |
| 依存関係の最小化 | 改善 | なし |
| Lambda Layers | 改善 | なし |

### Step 4: セキュリティ設定

- [ ] 最小権限IAMロール
- [ ] VPC設定（必要な場合）
- [ ] 環境変数の暗号化
- [ ] リソースポリシーの設定

**IAMポリシー例:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/MyTable"
    }
  ]
}
```

### Step 5: モニタリング設定

- [ ] CloudWatch Logsの構造化
- [ ] カスタムメトリクスの定義
- [ ] X-Rayトレースの有効化
- [ ] アラームの設定

## Output Format

```markdown
# AWS Lambda 設計: [関数名]

## 概要
- **目的**: [ユースケース]
- **ランタイム**: [runtime]
- **トリガー**: [trigger]

## アーキテクチャ
[関数の位置づけと連携図]

## 設定

### 基本設定
| 項目 | 値 | 理由 |
|------|-----|------|
| メモリ | [MB] | [理由] |
| タイムアウト | [秒] | [理由] |
| 同時実行数 | [数] | [理由] |

### 環境変数
| 変数名 | 説明 | 暗号化 |
|--------|------|--------|
| [VAR] | [説明] | [Yes/No] |

## コード構造
```[language]
[ハンドラーコード]
```

## IAMポリシー
```json
[ポリシー]
```

## モニタリング
- メトリクス: [一覧]
- アラーム: [設定]

## デプロイメント
[SAM/CDK/Terraform設定]
```

## Examples

### Input
```
AWS Lambda関数でS3にアップロードされた画像をリサイズしたい
```

### Output
```markdown
# AWS Lambda 設計: image-resizer

## 概要
- **目的**: S3にアップロードされた画像を複数サイズにリサイズ
- **ランタイム**: Node.js 20.x
- **トリガー**: S3 (ObjectCreated)

## アーキテクチャ
```
S3 (uploads/) → Lambda → S3 (thumbnails/, medium/, large/)
                  ↓
              CloudWatch Logs
```

## 設定

### 基本設定
| 項目 | 値 | 理由 |
|------|-----|------|
| メモリ | 1024 MB | 画像処理にCPU必要 |
| タイムアウト | 30秒 | 大きな画像対応 |
| 同時実行数 | 100 | バースト対応 |

### 環境変数
| 変数名 | 説明 | 暗号化 |
|--------|------|--------|
| DEST_BUCKET | 出力先バケット | No |
| SIZES | リサイズサイズJSON | No |

## コード構造
```javascript
import sharp from 'sharp';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({});
const SIZES = JSON.parse(process.env.SIZES);

export const handler = async (event) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key);

  // 元画像取得
  const { Body } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const image = await Body.transformToByteArray();

  // 各サイズにリサイズ
  await Promise.all(SIZES.map(async ({ name, width, height }) => {
    const resized = await sharp(image)
      .resize(width, height, { fit: 'inside' })
      .toBuffer();

    await s3.send(new PutObjectCommand({
      Bucket: process.env.DEST_BUCKET,
      Key: `${name}/${key}`,
      Body: resized,
      ContentType: 'image/jpeg',
    }));
  }));

  return { statusCode: 200 };
};
```

## IAMポリシー
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::uploads-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws:s3:::thumbnails-bucket/*"
    }
  ]
}
```
```

## Notes

- 本番環境ではProvisioned Concurrencyを検討
- 大きなファイル処理はEFSマウントやStep Functions連携を検討
- コールドスタートが問題の場合はGo/Rustランタイムを検討
- Lambda Powertoolsの活用を推奨
- 関連スキル: [ci-pipeline-design](../../dev-devops/skills/ci-pipeline-design), [infrastructure-as-code](../../dev-devops/skills/infrastructure-as-code)
