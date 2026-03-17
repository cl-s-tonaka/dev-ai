---
name: terraform-modules
version: 1.0.0
description: Design and structure Terraform modules following best practices
tags:
  - terraform
  - iac
  - infrastructure
  - modules
---

# Terraform Modules

## Metadata

| Property | Value |
|----------|-------|
| Name | terraform-modules |
| Version | 1.0.0 |
| Category | Integration |
| Complexity | Medium |
| Provider | HashiCorp |

## Instructions

再利用可能で保守性の高いTerraformモジュールの設計と実装に関するガイダンスを提供します。モジュール構造、変数設計、出力定義、バージョニング戦略など、チーム開発に適したベストプラクティスに従います。

### 対応領域

1. **モジュール設計**: 構造、インターフェース設計
2. **変数とバリデーション**: 型制約、カスタムバリデーション
3. **出力設計**: 必要な出力の特定と命名
4. **テスト**: Terratest、terraform test
5. **ドキュメント**: terraform-docs、例の提供

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| resource_type | string | Yes | 管理するリソースの種類 |
| provider | string | Yes | クラウドプロバイダ（aws, gcp, azure） |
| reusability | string | No | 再利用スコープ（team, org, public） |
| complexity | string | No | モジュールの複雑度 |

## Output Process

### Step 1: モジュール設計

- [ ] モジュールの責務を明確化
- [ ] 入出力インターフェースを定義
- [ ] 依存関係を特定
- [ ] 命名規則を決定

**モジュール構造:**

```
modules/
└── [module-name]/
    ├── main.tf          # メインリソース定義
    ├── variables.tf     # 入力変数
    ├── outputs.tf       # 出力値
    ├── versions.tf      # プロバイダバージョン
    ├── locals.tf        # ローカル変数（オプション）
    ├── data.tf          # データソース（オプション）
    ├── README.md        # ドキュメント
    └── examples/        # 使用例
        └── basic/
            └── main.tf
```

### Step 2: 変数設計

- [ ] 必須/オプション変数の分類
- [ ] 適切な型制約の設定
- [ ] デフォルト値の検討
- [ ] バリデーションルールの追加

**変数定義のベストプラクティス:**

```hcl
# variables.tf

variable "name" {
  description = "Name of the resource. Used as prefix for all created resources."
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]*$", var.name))
    error_message = "Name must start with a letter and contain only lowercase letters, numbers, and hyphens."
  }
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "config" {
  description = "Advanced configuration options"
  type = object({
    enable_logging    = optional(bool, true)
    retention_days    = optional(number, 30)
    allowed_ips       = optional(list(string), [])
  })
  default = {}
}
```

### Step 3: リソース実装

- [ ] リソース命名の一貫性
- [ ] タグ/ラベルの統一
- [ ] 条件付きリソース作成
- [ ] for_each vs count の使い分け

**実装パターン:**

```hcl
# main.tf

locals {
  common_tags = merge(
    var.tags,
    {
      Module      = "module-name"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  )
}

resource "aws_s3_bucket" "this" {
  bucket = "${var.name}-${var.environment}"
  tags   = local.common_tags
}

resource "aws_s3_bucket_versioning" "this" {
  count  = var.config.enable_versioning ? 1 : 0
  bucket = aws_s3_bucket.this.id

  versioning_configuration {
    status = "Enabled"
  }
}

# for_each での複数リソース作成
resource "aws_s3_bucket_notification" "this" {
  for_each = var.notifications
  bucket   = aws_s3_bucket.this.id

  lambda_function {
    lambda_function_arn = each.value.lambda_arn
    events              = each.value.events
    filter_prefix       = each.value.prefix
  }
}
```

### Step 4: 出力定義

- [ ] 他モジュールで必要な値を出力
- [ ] 一貫した命名規則
- [ ] 説明文の追加

```hcl
# outputs.tf

output "bucket_id" {
  description = "The ID of the S3 bucket"
  value       = aws_s3_bucket.this.id
}

output "bucket_arn" {
  description = "The ARN of the S3 bucket"
  value       = aws_s3_bucket.this.arn
}

output "bucket_domain_name" {
  description = "The bucket domain name"
  value       = aws_s3_bucket.this.bucket_domain_name
}
```

### Step 5: ドキュメントとテスト

- [ ] README.mdの作成
- [ ] terraform-docsの設定
- [ ] 使用例の追加
- [ ] テストの実装

**terraform-docs設定:**

```yaml
# .terraform-docs.yml
formatter: markdown table

sections:
  show:
    - requirements
    - providers
    - inputs
    - outputs
    - resources

output:
  file: README.md
  mode: inject
```

## Output Format

```markdown
# Terraform Module: [module-name]

## 概要
[モジュールの目的と機能]

## 構造
```
[module-name]/
├── main.tf
├── variables.tf
├── outputs.tf
├── versions.tf
└── examples/
```

## 使用例
```hcl
[基本的な使用例]
```

## 入力変数

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| [name] | [type] | [yes/no] | [default] | [description] |

## 出力値

| Name | Description |
|------|-------------|
| [name] | [description] |

## リソース

| Name | Type |
|------|------|
| [name] | [type] |

## 実装コード

### main.tf
```hcl
[コード]
```

### variables.tf
```hcl
[コード]
```

### outputs.tf
```hcl
[コード]
```

## テスト
[テスト方法の説明]
```

## Examples

### Input
```
S3バケットを管理するTerraformモジュールを設計したい
- バージョニングのオン/オフ
- ライフサイクルルール
- 暗号化設定
```

### Output
```markdown
# Terraform Module: s3-bucket

## 概要
セキュリティとコンプライアンスのベストプラクティスに従ったS3バケットを作成します。

## 使用例
```hcl
module "app_bucket" {
  source = "./modules/s3-bucket"

  name        = "my-app"
  environment = "prod"

  config = {
    enable_versioning = true
    enable_encryption = true
    retention_days    = 90
  }

  lifecycle_rules = [
    {
      id      = "archive"
      enabled = true
      transition = {
        days          = 30
        storage_class = "STANDARD_IA"
      }
    }
  ]

  tags = {
    Team    = "platform"
    Project = "infrastructure"
  }
}
```

## 入力変数

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| name | string | yes | - | バケット名のプレフィックス |
| environment | string | yes | - | 環境名 |
| config | object | no | {} | 詳細設定オプション |
| lifecycle_rules | list | no | [] | ライフサイクルルール |
| tags | map(string) | no | {} | リソースタグ |

## 出力値

| Name | Description |
|------|-------------|
| bucket_id | バケットID |
| bucket_arn | バケットARN |
| bucket_domain_name | バケットドメイン名 |

## 実装コード

### variables.tf
```hcl
variable "name" {
  description = "Bucket name prefix"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]*$", var.name))
    error_message = "Name must be lowercase alphanumeric with hyphens."
  }
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "config" {
  description = "Bucket configuration"
  type = object({
    enable_versioning = optional(bool, false)
    enable_encryption = optional(bool, true)
    retention_days    = optional(number, 30)
  })
  default = {}
}

variable "lifecycle_rules" {
  description = "S3 lifecycle rules"
  type = list(object({
    id      = string
    enabled = bool
    transition = optional(object({
      days          = number
      storage_class = string
    }))
    expiration_days = optional(number)
  }))
  default = []
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default     = {}
}
```

### main.tf
```hcl
locals {
  bucket_name = "${var.name}-${var.environment}-${random_id.suffix.hex}"
  common_tags = merge(var.tags, {
    Module      = "s3-bucket"
    Environment = var.environment
  })
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "this" {
  bucket = local.bucket_name
  tags   = local.common_tags
}

resource "aws_s3_bucket_versioning" "this" {
  count  = var.config.enable_versioning ? 1 : 0
  bucket = aws_s3_bucket.this.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  count  = var.config.enable_encryption ? 1 : 0
  bucket = aws_s3_bucket.this.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "this" {
  count  = length(var.lifecycle_rules) > 0 ? 1 : 0
  bucket = aws_s3_bucket.this.id

  dynamic "rule" {
    for_each = var.lifecycle_rules
    content {
      id     = rule.value.id
      status = rule.value.enabled ? "Enabled" : "Disabled"

      dynamic "transition" {
        for_each = rule.value.transition != null ? [rule.value.transition] : []
        content {
          days          = transition.value.days
          storage_class = transition.value.storage_class
        }
      }

      dynamic "expiration" {
        for_each = rule.value.expiration_days != null ? [rule.value.expiration_days] : []
        content {
          days = expiration.value
        }
      }
    }
  }
}
```

### outputs.tf
```hcl
output "bucket_id" {
  description = "The ID of the S3 bucket"
  value       = aws_s3_bucket.this.id
}

output "bucket_arn" {
  description = "The ARN of the S3 bucket"
  value       = aws_s3_bucket.this.arn
}

output "bucket_domain_name" {
  description = "The bucket domain name"
  value       = aws_s3_bucket.this.bucket_domain_name
}
```
```

## Notes

- モジュールバージョンは Semantic Versioning に従う
- 破壊的変更は major バージョンで管理
- terraform-docs で自動ドキュメント生成を推奨
- Terratest または terraform test でテストを実装
- 関連スキル: [infrastructure-as-code](../../dev-devops/skills/infrastructure-as-code)
