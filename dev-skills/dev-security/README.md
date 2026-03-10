# Dev Security プラグイン

コードレビュー、脅威モデリング、依存関係監査、認証設計、セキュアコーディング、シークレット管理、ペネトレーションテスト計画に対応したセキュリティ重視の開発スキルを提供します。

## 概要

`dev-security` プラグインは、開発チームが安全なアプリケーションをゼロから構築するための包括的なセキュリティスキルを提供します。コード内の脆弱性特定から堅牢な認証システム設計まで、アプリケーションセキュリティの主要領域を幅広くカバーします。

## スキル

| スキル | 説明 |
|-------|-------------|
| [security-review](skills/security-review/SKILL.md) | OWASP Top 10 を枠組みにしたセキュリティコードレビューを実施 |
| [threat-modeling](skills/threat-modeling/SKILL.md) | STRIDE 手法を用いた脅威モデリングを実施 |
| [dependency-audit](skills/dependency-audit/SKILL.md) | 既知脆弱性やライセンス問題の観点で依存関係を監査 |
| [authentication-design](skills/authentication-design/SKILL.md) | 安全な認証・認可システムを設計 |
| [secure-coding](skills/secure-coding/SKILL.md) | セキュアコーディングのガイドラインとパターンを適用 |
| [secrets-management](skills/secrets-management/SKILL.md) | シークレット管理の戦略とベストプラクティスを実装 |
| [penetration-test-plan](skills/penetration-test-plan/SKILL.md) | ペネトレーションテストの計画とスコープを策定 |

## コマンド

| コマンド | 説明 | 使い方 |
|---------|-------------|-------|
| `/security` | セキュリティレビューのワークフローを実行 | `/security [code or feature to review]` |
| `/threat-model` | 脅威モデリング分析を実行 | `/threat-model [system or feature to analyze]` |
| `/audit` | 依存関係とコード脆弱性の監査を実施 | `/audit [project or codebase]` |

## クイックスタート

### セキュリティコードレビュー
```
/security Review the authentication module for vulnerabilities
```

### 脅威モデリング
```
/threat-model Analyze the payment processing system
```

### 依存関係監査
```
/audit Check all npm dependencies for known CVEs
```

## OWASP Top 10 対応範囲

このプラグインは、OWASP Top 10（2021）の全カテゴリに対するガイダンスを提供します。

1. **A01:2021 - Broken Access Control** - 認可・アクセス制御レビュー
2. **A02:2021 - Cryptographic Failures** - 暗号化とデータ保護
3. **A03:2021 - Injection** - SQL、NoSQL、OS、LDAP インジェクション対策
4. **A04:2021 - Insecure Design** - 脅威モデリングとセキュア設計パターン
5. **A05:2021 - Security Misconfiguration** - 設定レビューとハードニング
6. **A06:2021 - Vulnerable Components** - 依存関係監査と更新
7. **A07:2021 - Authentication Failures** - ID 管理と認証設計
8. **A08:2021 - Software and Data Integrity** - CI/CD セキュリティと整合性チェック
9. **A09:2021 - Security Logging Failures** - ログ実装と監視
10. **A10:2021 - Server-Side Request Forgery** - SSRF 防止パターン

## ベストプラクティス

1. **シフトレフト**: `/security` を開発初期から使い、本番前に問題を検出する
2. **継続的モデリング**: システム構成が変わるたびに `/threat-model` を適用する
3. **定期監査**: CI/CD パイプラインの一部として `/audit` を実行する
4. **多層防御**: 複数のセキュリティコントロールを組み合わせて層状に防御する
5. **最小権限**: 常に最小アクセス権で設計する

## 連携

このプラグインは、他の pm-skills プラグインとシームレスに連携できます。
- **dev-testing**: セキュリティテストと機能テストを組み合わせる
- **dev-code-quality**: コード品質基準にセキュリティチェックを統合する
- **dev-architecture**: 初期段階から安全なアーキテクチャを設計する

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照してください。
