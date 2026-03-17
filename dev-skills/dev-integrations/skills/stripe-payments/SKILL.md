---
name: stripe-payments
version: 1.0.0
description: Design and implement Stripe payment integrations following best practices
tags:
  - stripe
  - payments
  - saas
  - billing
---

# Stripe Payments

## Metadata

| Property | Value |
|----------|-------|
| Name | stripe-payments |
| Version | 1.0.0 |
| Category | Integration |
| Complexity | High |
| Provider | Stripe |

## Instructions

Stripe決済統合の設計と実装に関するガイダンスを提供します。Payment Intents、Subscriptions、Webhooks、セキュリティなど、PCI DSSコンプライアンスに準拠したベストプラクティスに従います。

### 対応領域

1. **決済フロー**: 単発決済、定期課金、従量課金
2. **Webhook処理**: イベント処理、べき等性、リトライ
3. **セキュリティ**: PCI DSS、キー管理
4. **エラーハンドリング**: 決済失敗、リカバリー
5. **テスト**: テストモード、シナリオテスト

## Input Requirements

| Input | Type | Required | Description |
|-------|------|----------|-------------|
| payment_type | string | Yes | 決済タイプ（one-time, subscription, metered） |
| use_case | string | Yes | ビジネスユースケース |
| platform | string | No | バックエンド言語/フレームワーク |
| requirements | string | No | 特殊要件（マーケットプレイス、Connect等） |

## Output Process

### Step 1: 決済モデル設計

- [ ] 決済フロータイプの選定
- [ ] 価格モデルの設計
- [ ] Customer/Productモデルの設計
- [ ] メタデータ戦略の決定

**決済フロータイプ:**

| タイプ | ユースケース | Stripe API |
|--------|-------------|------------|
| 単発決済 | 一回限りの購入 | Payment Intents |
| 定額課金 | 月額/年額サブスク | Subscriptions |
| 従量課金 | 使用量ベース | Usage Records |
| マーケットプレイス | プラットフォーム | Connect |

### Step 2: サーバー実装

- [ ] Stripe SDK の設定
- [ ] APIエンドポイントの実装
- [ ] Webhook エンドポイントの実装
- [ ] エラーハンドリング

**Payment Intent 作成 (Node.js):**

```javascript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createPaymentIntent(req, res) {
  try {
    const { amount, currency, customerId, metadata } = req.body;

    // 入力バリデーション
    if (!amount || amount < 50) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'jpy',
      customer: customerId,
      automatic_payment_methods: { enabled: true },
      metadata: {
        ...metadata,
        created_by: 'api',
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation failed:', error);

    if (error.type === 'StripeCardError') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Payment processing failed' });
  }
}
```

**Subscription 作成:**

```javascript
export async function createSubscription(req, res) {
  try {
    const { customerId, priceId, trialDays } = req.body;

    // Customer に支払い方法が設定されているか確認
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer.invoice_settings.default_payment_method) {
      return res.status(400).json({
        error: 'No payment method on file'
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      trial_period_days: trialDays,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent?.client_secret,
      status: subscription.status,
    });
  } catch (error) {
    console.error('Subscription creation failed:', error);
    res.status(500).json({ error: 'Subscription creation failed' });
  }
}
```

### Step 3: Webhook 実装

- [ ] 署名検証の実装
- [ ] イベントハンドラーの実装
- [ ] べき等性の確保
- [ ] リトライ対応

**Webhook ハンドラー:**

```javascript
import { buffer } from 'micro';

export const config = {
  api: { bodyParser: false },
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function webhookHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // べき等性チェック
  const processed = await checkIfProcessed(event.id);
  if (processed) {
    return res.json({ received: true, skipped: true });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // 処理済みとしてマーク
    await markAsProcessed(event.id);

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handlePaymentSuccess(paymentIntent) {
  const { customer, metadata, amount } = paymentIntent;

  // 注文確定処理
  await fulfillOrder(metadata.orderId);

  // 通知送信
  await sendPaymentConfirmation(customer, amount);
}

async function handleSubscriptionUpdated(subscription) {
  const { customer, status, items } = subscription;

  // ユーザーのサブスク状態を更新
  await updateUserSubscription(customer, {
    status,
    plan: items.data[0].price.id,
    currentPeriodEnd: subscription.current_period_end,
  });
}
```

### Step 4: フロントエンド実装

- [ ] Stripe.js の設定
- [ ] Elements の実装
- [ ] エラー表示の実装
- [ ] ローディング状態の管理

**React での実装例:**

```tsx
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setProcessing(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/complete`,
      },
    });

    if (confirmError) {
      setError(confirmError.message);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <div className="error">{error}</div>}
      <button disabled={!stripe || processing}>
        {processing ? '処理中...' : '支払う'}
      </button>
    </form>
  );
}

export function Checkout({ clientSecret }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: 'stripe' } }}
    >
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}
```

### Step 5: セキュリティとテスト

- [ ] APIキーの安全な管理
- [ ] テストモードでの検証
- [ ] 各種カードシナリオのテスト
- [ ] Webhookのローカルテスト

**テストカード番号:**

| シナリオ | カード番号 |
|----------|-----------|
| 成功 | 4242 4242 4242 4242 |
| 認証必要 | 4000 0025 0000 3155 |
| 拒否 | 4000 0000 0000 9995 |
| 残高不足 | 4000 0000 0000 9995 |

## Output Format

```markdown
# Stripe 決済設計: [プロジェクト名]

## 概要
- **決済タイプ**: [one-time/subscription/metered]
- **ユースケース**: [説明]

## 価格モデル
[Products/Prices の設計]

## アーキテクチャ
```
[フロー図]
```

## API エンドポイント

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/payment/create-intent | Payment Intent 作成 |
| POST | /api/webhooks/stripe | Webhook 処理 |

## 実装コード

### サーバーサイド
```[language]
[コード]
```

### クライアントサイド
```[language]
[コード]
```

## Webhook イベント

| Event | Action |
|-------|--------|
| [event] | [action] |

## テスト計画
[テストシナリオ]

## セキュリティチェックリスト
- [ ] APIキーの安全な保管
- [ ] Webhook 署名検証
- [ ] べき等性の確保
```

## Notes

- 本番環境では必ず Live API キーを使用
- Webhook の署名検証は必須
- PCI DSS コンプライアンスのため、カード情報は直接扱わない
- Stripe CLI でローカル Webhook テストが可能
- ダッシュボードでのイベントログ確認を活用
- 関連スキル: [authentication-design](../../dev-security/skills/authentication-design)
