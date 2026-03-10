---
name: infrastructure-as-code
version: 1.0.0
description: Design Infrastructure as Code configurations using Terraform, CloudFormation, Pulumi, and other IaC tools
tags:
  - terraform
  - cloudformation
  - pulumi
  - iac
  - infrastructure
  - devops
---

# Infrastructure as Code Design

## Metadata

| Property | Value |
|----------|-------|
| Name | infrastructure-as-code |
| Version | 1.0.0 |
| Category | DevOps |
| Complexity | High |

## Instructions

Design maintainable, secure, and scalable Infrastructure as Code configurations. Create modular, reusable infrastructure components that follow cloud provider best practices and organizational standards.

### IaC Tool Selection Guide

| Tool | Best For | State Management | Language |
|------|----------|------------------|----------|
| Terraform | Multi-cloud, mature ecosystem | Remote state (S3, GCS, Azure) | HCL |
| CloudFormation | AWS-native, AWS integrations | AWS-managed | YAML/JSON |
| Pulumi | Dev teams, existing languages | Pulumi Cloud, S3, Azure | Python, TS, Go |
| CDK | AWS + TypeScript teams | CloudFormation | TypeScript |
| Crossplane | Kubernetes-native | Kubernetes | YAML |

### Project Structure (Terraform)

```
infrastructure/
├── modules/
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── README.md
│   ├── compute/
│   ├── database/
│   └── security/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   ├── staging/
│   └── production/
├── shared/
│   ├── providers.tf
│   └── versions.tf
└── scripts/
    ├── init.sh
    └── plan.sh
```

### Best Practices

| Category | Practice | Why |
|----------|----------|-----|
| State | Remote state with locking | Collaboration, prevent corruption |
| Secrets | Use secrets manager, not variables | Security, rotation |
| Modules | Version-pinned modules | Reproducibility |
| Naming | Consistent naming convention | Maintainability |
| Tags | Mandatory resource tagging | Cost allocation, ownership |
| Reviews | Plan review before apply | Prevent accidents |

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| cloud_provider | string | Yes | Cloud provider (aws, gcp, azure) |
| iac_tool | string | Yes | IaC tool (terraform, cloudformation, pulumi) |
| resources | array | Yes | Resources to provision |
| environment | string | Yes | Target environment (dev, staging, prod) |
| region | string | Yes | Primary region |
| compliance | array | No | Compliance requirements (hipaa, pci, soc2) |

## Output Process

### Step 1: Design Module Structure

**Networking Module Example (Terraform):**
```hcl
# modules/networking/main.tf

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.common_tags, {
    Name = "${var.environment}-vpc"
  })
}

resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 4, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = merge(var.common_tags, {
    Name = "${var.environment}-public-${count.index + 1}"
    Tier = "public"
  })
}

resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 4, count.index + length(var.availability_zones))
  availability_zone = var.availability_zones[count.index]

  tags = merge(var.common_tags, {
    Name = "${var.environment}-private-${count.index + 1}"
    Tier = "private"
  })
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(var.common_tags, {
    Name = "${var.environment}-igw"
  })
}

resource "aws_nat_gateway" "main" {
  count         = var.enable_nat_gateway ? length(var.availability_zones) : 0
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id

  tags = merge(var.common_tags, {
    Name = "${var.environment}-nat-${count.index + 1}"
  })

  depends_on = [aws_internet_gateway.main]
}
```

### Step 2: Define Variables and Outputs

```hcl
# modules/networking/variables.tf

variable "environment" {
  description = "Environment name"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be dev, staging, or production."
  }
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
  validation {
    condition     = can(cidrhost(var.vpc_cidr, 0))
    error_message = "Must be a valid CIDR block."
  }
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = true
}

variable "common_tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default     = {}
}

# modules/networking/outputs.tf

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of private subnets"
  value       = aws_subnet.private[*].id
}

output "nat_gateway_ips" {
  description = "Public IPs of NAT Gateways"
  value       = aws_eip.nat[*].public_ip
}
```

### Step 3: Configure Environment

```hcl
# environments/production/main.tf

terraform {
  required_version = ">= 1.5.0"

  backend "s3" {
    bucket         = "mycompany-terraform-state"
    key            = "production/infrastructure.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Environment = "production"
      ManagedBy   = "terraform"
      Project     = "myproject"
      CostCenter  = "engineering"
    }
  }
}

module "networking" {
  source = "../../modules/networking"

  environment        = "production"
  vpc_cidr           = "10.0.0.0/16"
  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]
  enable_nat_gateway = true

  common_tags = local.common_tags
}

module "eks" {
  source = "../../modules/eks"

  cluster_name       = "production-cluster"
  vpc_id             = module.networking.vpc_id
  subnet_ids         = module.networking.private_subnet_ids
  kubernetes_version = "1.29"

  node_groups = {
    general = {
      instance_types = ["m6i.xlarge"]
      min_size       = 3
      max_size       = 10
      desired_size   = 3
    }
  }

  common_tags = local.common_tags
}

module "rds" {
  source = "../../modules/rds"

  identifier        = "production-db"
  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.r6g.xlarge"
  allocated_storage = 100

  vpc_id             = module.networking.vpc_id
  subnet_ids         = module.networking.private_subnet_ids

  multi_az               = true
  backup_retention_period = 30
  deletion_protection    = true

  common_tags = local.common_tags
}
```

### Step 4: Add Security and Compliance

```hcl
# modules/security/main.tf

# KMS key for encryption
resource "aws_kms_key" "main" {
  description             = "Main encryption key for ${var.environment}"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "Enable IAM policies"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action   = "kms:*"
        Resource = "*"
      }
    ]
  })

  tags = var.common_tags
}

# Security Group with strict rules
resource "aws_security_group" "app" {
  name_prefix = "${var.environment}-app-"
  vpc_id      = var.vpc_id
  description = "Security group for application instances"

  # No inline rules - use aws_security_group_rule
  lifecycle {
    create_before_destroy = true
  }

  tags = merge(var.common_tags, {
    Name = "${var.environment}-app-sg"
  })
}

resource "aws_security_group_rule" "app_ingress_https" {
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = [var.vpc_cidr]
  security_group_id = aws_security_group.app.id
  description       = "HTTPS from VPC"
}

resource "aws_security_group_rule" "app_egress_https" {
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.app.id
  description       = "HTTPS to internet"
}
```

## Output Format

```markdown
## Infrastructure as Code: [Project Name]

### Architecture Overview
[Description of infrastructure components]

### Module Structure
| Module | Purpose | Resources |
|--------|---------|-----------|
| networking | VPC, subnets, NAT | VPC, Subnets, IGW, NAT, Route Tables |
| compute | EKS cluster | EKS, Node Groups, IAM Roles |
| database | RDS PostgreSQL | RDS, Parameter Groups, Security Groups |
| security | KMS, IAM, SGs | KMS Keys, IAM Policies, Security Groups |

### Deployment Commands
```bash
# Initialize
cd environments/production
terraform init

# Plan changes
terraform plan -out=tfplan

# Apply (after review)
terraform apply tfplan

# Destroy (with caution)
terraform destroy
```

### Cost Estimate
| Resource | Monthly Cost |
|----------|-------------|
| EKS Cluster | $73 |
| EC2 Instances (3x m6i.xlarge) | $345 |
| RDS (r6g.xlarge, Multi-AZ) | $450 |
| NAT Gateway | $100 |
| **Total** | **~$968/month** |
```

## Notes

- Always use remote state with locking (S3 + DynamoDB, GCS, Azure Blob)
- Pin provider and module versions to prevent unexpected changes
- Use `terraform fmt` and `terraform validate` in CI/CD
- Implement policy-as-code with Sentinel, OPA, or Checkov
- Use workspaces sparingly; prefer separate state files per environment
- Never store secrets in state files; use secrets managers
- Document modules with README.md and examples
- Use `terraform plan` output for code review
- Enable AWS Config or similar for drift detection
- Consider Terragrunt for DRY configurations across environments
