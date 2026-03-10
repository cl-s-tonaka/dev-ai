---
name: cost-optimization
version: 1.0.0
description: Optimize cloud infrastructure costs across AWS, GCP, and Azure while maintaining performance and reliability
tags:
  - cost
  - optimization
  - cloud
  - finops
  - aws
  - gcp
  - azure
  - devops
---

# Cloud Cost Optimization

## Metadata

| Property | Value |
|----------|-------|
| Name | cost-optimization |
| Version | 1.0.0 |
| Category | DevOps |
| Complexity | Medium-High |

## Instructions

Identify and implement cloud cost optimization opportunities while maintaining performance, reliability, and security. Apply FinOps principles to establish cost awareness, governance, and continuous optimization practices.

### Cost Optimization Pillars

| Pillar | Description | Typical Savings |
|--------|-------------|-----------------|
| Right-sizing | Match resources to actual usage | 20-40% |
| Reserved/Committed | Commit to usage for discounts | 30-60% |
| Spot/Preemptible | Use interruptible instances | 60-90% |
| Scheduling | Stop non-production resources | 40-70% |
| Architecture | Optimize application design | 20-50% |
| Waste Elimination | Remove unused resources | 5-15% |

### Cost Visibility Framework

```
┌─────────────────────────────────────────────────────────────┐
│                    COST ALLOCATION                          │
├─────────────────────────────────────────────────────────────┤
│  Level 1: Business Unit    │  Engineering, Marketing, Sales │
├───────────────────────────┼─────────────────────────────────┤
│  Level 2: Team            │  Platform, Product, Data       │
├───────────────────────────┼─────────────────────────────────┤
│  Level 3: Service         │  API, Web, Database, Cache      │
├───────────────────────────┼─────────────────────────────────┤
│  Level 4: Environment     │  Production, Staging, Dev       │
└───────────────────────────┴─────────────────────────────────┘
```

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| cloud_provider | string | Yes | Cloud provider (aws, gcp, azure, multi-cloud) |
| monthly_spend | number | Yes | Current monthly cloud spend |
| architecture | object | No | Current architecture description |
| usage_patterns | string | No | Usage patterns (steady, variable, batch) |
| constraints | array | No | Constraints (compliance, performance, availability) |

## Output Process

### Step 1: Identify Optimization Opportunities

**Quick Wins Checklist:**
- [ ] Unused resources (unattached EBS, idle load balancers)
- [ ] Oversized instances (CPU < 40%, memory < 60%)
- [ ] Old generation instance types
- [ ] Unoptimized storage classes
- [ ] Missing Reserved Instances/Savings Plans
- [ ] Non-production resources running 24/7
- [ ] Redundant data transfer across regions/AZs

**AWS Cost Explorer Analysis:**
```bash
# Get top cost contributors by service
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics "UnblendedCost" \
  --group-by Type=DIMENSION,Key=SERVICE

# Get unused Elastic IPs
aws ec2 describe-addresses \
  --query "Addresses[?AssociationId==null]"

# Get unattached EBS volumes
aws ec2 describe-volumes \
  --filters "Name=status,Values=available" \
  --query "Volumes[*].{ID:VolumeId,Size:Size,Type:VolumeType}"
```

### Step 2: Right-Size Compute Resources

**Instance Sizing Analysis:**
| Current Instance | Avg CPU | Avg Memory | Recommendation | Monthly Savings |
|------------------|---------|------------|----------------|-----------------|
| m5.2xlarge x 10 | 25% | 40% | m5.xlarge x 10 | $1,200 |
| c5.4xlarge x 5 | 15% | 20% | c5.xlarge x 5 | $2,100 |
| r5.2xlarge x 3 | 30% | 35% | r5.xlarge x 3 | $650 |

**Right-Sizing Commands:**
```bash
# AWS Compute Optimizer recommendations
aws compute-optimizer get-ec2-instance-recommendations \
  --query "instanceRecommendations[*].{Instance:instanceArn,Current:currentInstanceType,Recommendation:recommendationOptions[0].instanceType,Savings:recommendationOptions[0].projectedUtilizationMetrics}"

# CloudWatch metrics for analysis
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-xxxxx \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-31T23:59:59Z \
  --period 3600 \
  --statistics Average Maximum
```

**Kubernetes Resource Optimization:**
```yaml
# Resource recommendations based on VPA
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: myapp-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  updatePolicy:
    updateMode: "Off"  # Just recommend, don't auto-update
  resourcePolicy:
    containerPolicies:
      - containerName: myapp
        minAllowed:
          cpu: 100m
          memory: 128Mi
        maxAllowed:
          cpu: 4
          memory: 8Gi
```

### Step 3: Implement Commitment Discounts

**Savings Plan / Reserved Instance Strategy:**
```
┌─────────────────────────────────────────────────────────────┐
│              COMMITMENT STRATEGY                             │
├─────────────────────────────────────────────────────────────┤
│  Baseline (70-80%)   │  3-year Reserved / Savings Plans    │
│                      │  Maximum discount (60-70% off)      │
├──────────────────────┼──────────────────────────────────────┤
│  Variable (15-25%)   │  1-year or Convertible Reserved     │
│                      │  Flexibility + discount (30-40% off)│
├──────────────────────┼──────────────────────────────────────┤
│  Burst (5-10%)       │  On-Demand + Spot                   │
│                      │  Handle peaks, no commitment        │
└──────────────────────┴──────────────────────────────────────┘
```

**AWS Savings Plans Analysis:**
```bash
# Get Savings Plans recommendations
aws ce get-savings-plans-purchase-recommendation \
  --savings-plans-type COMPUTE_SP \
  --term-in-years ONE_YEAR \
  --payment-option NO_UPFRONT \
  --lookback-period-in-days SIXTY_DAYS
```

### Step 4: Leverage Spot/Preemptible Instances

**Spot Instance Strategy:**
| Workload Type | Spot Suitable | Strategy |
|---------------|---------------|----------|
| Stateless web | Yes | Mixed ASG (50% spot) |
| Batch jobs | Yes | 100% spot with checkpointing |
| CI/CD runners | Yes | 100% spot |
| Databases | No | Use Reserved |
| ML Training | Yes | Spot with checkpointing |

**Kubernetes Spot Configuration:**
```yaml
# Mixed instance Auto Scaling Group
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig
metadata:
  name: production
  region: us-east-1
nodeGroups:
  - name: mixed-demand-spot
    desiredCapacity: 6
    instancesDistribution:
      maxPrice: 0.50
      instanceTypes: ["m5.xlarge", "m5a.xlarge", "m4.xlarge"]
      onDemandBaseCapacity: 2
      onDemandPercentageAboveBaseCapacity: 25
      spotInstancePools: 3
    labels:
      lifecycle: mixed
```

**Spot Interruption Handling:**
```bash
#!/bin/bash
# Spot interruption handler for EC2

# Check for interruption notice
INTERRUPTION=$(curl -s http://169.254.169.254/latest/meta-data/spot/termination-time)

if [ -n "$INTERRUPTION" ]; then
  echo "Spot interruption notice received: $INTERRUPTION"

  # Drain node (Kubernetes)
  kubectl drain $(hostname) --ignore-daemonsets --delete-local-data

  # Checkpoint work (if applicable)
  # save_checkpoint.sh

  # Deregister from load balancer
  # deregister_instance.sh
fi
```

### Step 5: Optimize Storage Costs

**Storage Tiering Strategy:**
| Data Age | Access Pattern | Storage Class | Cost ($/GB/mo) |
|----------|----------------|---------------|----------------|
| < 30 days | Frequent | S3 Standard / gp3 | $0.023 |
| 30-90 days | Infrequent | S3 IA / sc1 | $0.0125 |
| 90-365 days | Rare | S3 Glacier IR | $0.004 |
| > 365 days | Archive | S3 Glacier Deep | $0.00099 |

**S3 Lifecycle Policy:**
```json
{
  "Rules": [
    {
      "ID": "OptimizeStorageClasses",
      "Status": "Enabled",
      "Filter": { "Prefix": "" },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER_IR"
        },
        {
          "Days": 365,
          "StorageClass": "DEEP_ARCHIVE"
        }
      ],
      "NoncurrentVersionTransitions": [
        {
          "NoncurrentDays": 30,
          "StorageClass": "GLACIER"
        }
      ],
      "NoncurrentVersionExpiration": {
        "NoncurrentDays": 90
      }
    }
  ]
}
```

**EBS Optimization:**
```bash
# Find gp2 volumes to migrate to gp3 (better price/performance)
aws ec2 describe-volumes \
  --filters "Name=volume-type,Values=gp2" \
  --query "Volumes[*].{ID:VolumeId,Size:Size,IOPS:Iops}" \
  --output table

# Migrate gp2 to gp3
aws ec2 modify-volume \
  --volume-id vol-xxxxx \
  --volume-type gp3 \
  --iops 3000 \
  --throughput 125
```

### Step 6: Implement Non-Production Scheduling

**Schedule Non-Production Resources:**
```yaml
# AWS Instance Scheduler configuration
periods:
  - name: office-hours
    description: Standard office hours
    begintime: "08:00"
    endtime: "18:00"
    weekdays:
      - mon-fri
    timezone: America/New_York

schedules:
  - name: dev-schedule
    description: Development environment schedule
    periods:
      - office-hours
    retain_running: false
    enforced: true

# Tag instances with: Schedule=dev-schedule
```

**Kubernetes Non-Prod Scaling:**
```yaml
# Scale down dev cluster at night
apiVersion: batch/v1
kind: CronJob
metadata:
  name: scale-down-dev
spec:
  schedule: "0 19 * * 1-5"  # 7 PM weekdays
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: kubectl
              image: bitnami/kubectl
              command:
                - /bin/sh
                - -c
                - |
                  kubectl scale deployment --all --replicas=0 -n dev
          restartPolicy: OnFailure
---
# Scale up in the morning
apiVersion: batch/v1
kind: CronJob
metadata:
  name: scale-up-dev
spec:
  schedule: "0 7 * * 1-5"  # 7 AM weekdays
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: kubectl
              image: bitnami/kubectl
              command:
                - /bin/sh
                - -c
                - |
                  kubectl scale deployment --all --replicas=2 -n dev
          restartPolicy: OnFailure
```

## Output Format

```markdown
## Cost Optimization Report: [Organization/Project]

### Executive Summary
| Metric | Current | Optimized | Savings |
|--------|---------|-----------|---------|
| Monthly Spend | $50,000 | $32,000 | $18,000 (36%) |
| Annual Projection | $600,000 | $384,000 | $216,000 |

### Quick Wins (Immediate Implementation)
| Action | Effort | Monthly Savings | Timeline |
|--------|--------|-----------------|----------|
| Delete unused EBS volumes | Low | $500 | 1 day |
| Remove idle load balancers | Low | $200 | 1 day |
| Migrate gp2 to gp3 | Low | $800 | 1 week |
| **Total Quick Wins** | | **$1,500** | |

### Medium-Term Optimizations (1-3 months)
| Action | Effort | Monthly Savings | Timeline |
|--------|--------|-----------------|----------|
| Right-size instances | Medium | $3,000 | 2 weeks |
| Implement Savings Plans | Medium | $8,000 | 1 month |
| Non-prod scheduling | Medium | $2,500 | 2 weeks |
| **Total Medium-Term** | | **$13,500** | |

### Long-Term Optimizations (3-6 months)
| Action | Effort | Monthly Savings | Timeline |
|--------|--------|-----------------|----------|
| Spot instance adoption | High | $2,000 | 2 months |
| Storage lifecycle policies | Medium | $1,000 | 1 month |
| **Total Long-Term** | | **$3,000** | |

### Implementation Plan
1. **Week 1-2**: Quick wins and cost tagging
2. **Week 3-4**: Right-sizing analysis and implementation
3. **Month 2**: Reserved/Savings Plans purchase
4. **Month 3**: Spot instance migration
5. **Ongoing**: Monthly cost reviews and optimization

### Cost Governance Recommendations
1. Implement mandatory tagging for all resources
2. Set up budget alerts at 80% and 100% thresholds
3. Monthly FinOps review meeting
4. Quarterly optimization sprints
```

## Notes

- Always validate performance after right-sizing
- Purchase commitments based on at least 30 days of stable usage data
- Start spot adoption with fault-tolerant workloads
- Tag everything for accurate cost allocation
- Set up AWS Cost Anomaly Detection for unexpected spend
- Review Reserved Instance utilization monthly
- Consider AWS Organizations for consolidated billing discounts
- Use Savings Plans over Reserved Instances for flexibility
- Archive or delete old snapshots and AMIs
- Monitor data transfer costs between regions and AZs
