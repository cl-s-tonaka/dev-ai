# Dev DevOps プラグイン

CI/CD パイプライン設計、Dockerfile 最適化、Kubernetes マニフェスト、Infrastructure as Code、デプロイ戦略、監視、SRE 原則、クラウドコスト最適化に対応した DevOps スキルを提供します。

## 概要

`dev-devops` プラグインは、信頼性・スケーラビリティ・コスト効率に優れたインフラ構築を支援する、包括的な DevOps/SRE スキルを提供します。CI/CD パイプライン設計から SLI/SLO フレームワークの実装まで、現代的な DevOps プラクティスを幅広くカバーします。

## スキル

| スキル | 説明 |
|-------|-------------|
| [ci-pipeline-design](skills/ci-pipeline-design/SKILL.md) | GitHub Actions、GitLab CI、Jenkins など向けの CI/CD パイプラインを設計 |
| [dockerfile-review](skills/dockerfile-review/SKILL.md) | サイズ・セキュリティ・ビルド性能の観点で Dockerfile を最適化 |
| [kubernetes-manifest](skills/kubernetes-manifest/SKILL.md) | 本番運用のベストプラクティスに沿った Kubernetes マニフェストを設計 |
| [infrastructure-as-code](skills/infrastructure-as-code/SKILL.md) | Terraform、CloudFormation、Pulumi の構成を作成 |
| [deployment-strategy](skills/deployment-strategy/SKILL.md) | デプロイ戦略（Blue-Green、Canary、Rolling）を設計 |
| [monitoring-setup](skills/monitoring-setup/SKILL.md) | 監視・アラート・オブザーバビリティの仕組みを設計 |
| [sre-principles](skills/sre-principles/SKILL.md) | SLI、SLO、SLA 定義を含む SRE 原則を適用 |
| [cost-optimization](skills/cost-optimization/SKILL.md) | マルチクラウド環境でインフラコストを最適化 |

## コマンド

| コマンド | 説明 | 使い方 |
|---------|-------------|-------|
| `/pipeline` | CI/CD パイプラインのワークフローを設計 | `/pipeline [platform] [requirements]` |
| `/deploy` | デプロイ戦略と実装方針を設計 | `/deploy [strategy] [context]` |
| `/monitor` | 監視、メトリクス、アラートを設計 | `/monitor [setup\|alerts\|dashboard] [context]` |

## クイックスタート

### CI/CD パイプライン設計
```
/pipeline GitHub Actions for a Node.js microservice with staging and production
```

### デプロイ戦略
```
/deploy Canary deployment for a high-traffic e-commerce API
```

### 監視設定
```
/monitor setup Prometheus + Grafana for Kubernetes cluster
```

## ベストプラクティス

1. **パイプライン効率**: `/pipeline` を使い、適切なキャッシュと並列化を取り入れた高速かつ安全な CI/CD ワークフローを設計する
2. **コンテナセキュリティ**: `dockerfile-review` スキルで脆弱性と最適化ポイントを特定する
3. **本番運用準備**: `kubernetes-manifest` スキルで K8s 設定が本番のベストプラクティスに準拠していることを確認する
4. **信頼性エンジニアリング**: `sre-principles` スキルで有意義な SLI と達成可能な SLO を定義する
5. **コスト管理**: `cost-optimization` スキルで性能を犠牲にせずにコスト削減機会を特定する

## 連携

このプラグインは、他の dev-skills プラグインとシームレスに連携できます。
- **dev-toolkit**: Git ワークフローと組み合わせて GitOps を実践
- **dev-testing**: テスト戦略を CI/CD パイプラインへ統合
- **dev-code-quality**: デプロイパイプラインにコード品質ゲートを追加

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照してください。
