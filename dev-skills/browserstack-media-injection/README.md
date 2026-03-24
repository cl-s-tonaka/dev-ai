# BrowserStack Media Injection 検証プロジェクト

## 概要

このプロジェクトは、**BrowserStack の Media Injection 機能が正常に動作するかを検証するためのテストプロジェクト**です。

本プロジェクト（dev-skills）とは関係なく、BrowserStack Automate Pro プランで提供されるカメラ・音声インジェクション機能の動作確認を目的としています。

## 目的

| 項目 | 内容 |
|------|------|
| **検証対象** | BrowserStack Media Injection（Camera / Audio） |
| **確認事項** | インジェクション機能が使用可能か、正常に動作するか |
| **成果物** | テスト実行結果（成功/失敗）、スクリーンショット |

### 背景

BrowserStack の Media Injection は Automate Pro プラン以上で利用可能なプレミアム機能です。WebRTC を使用するアプリケーションのテストにおいて、仮想的なカメラ映像や音声をブラウザに注入することで、実デバイスがなくてもメディア入力のテストが可能になります。

---

## テスト手順

### 事前準備

#### 1. 依存関係のインストール

```bash
cd browserstack-media-injection
npm install
```

#### 2. BrowserStack 認証情報の設定

```bash
cp .env.example .env
```

`.env` ファイルを編集:

```env
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
```

#### 3. メディアファイルの準備

**カメラ用サンプル動画の作成:**

```bash
ffmpeg -f lavfi -i testsrc=duration=10:size=640x480:rate=30 \
  -f lavfi -i sine=frequency=440:duration=10 \
  -c:v libx264 -c:a aac -shortest \
  ./media/sample-video.mp4
```

**マイク用サンプル音声の作成:**

```bash
ffmpeg -f lavfi -i sine=frequency=440:duration=10 \
  -c:a libmp3lame -b:a 128k \
  ./media/sample-audio.mp3
```

#### 4. BrowserStack へのメディアアップロード

```bash
# ビデオファイル
npm run upload-media -- ./media/sample-video.mp4

# 音声ファイル
npm run upload-media -- ./media/sample-audio.mp3
```

出力された `media://` URL を `.env` に設定:

```env
ENABLE_CAMERA_INJECTION=true
ENABLE_AUDIO_INJECTION=true
CAMERA_MEDIA_URL=media://xxxxxxxx
AUDIO_MEDIA_URL=media://yyyyyyyy
```

---

### テスト実行

```bash
npm test
```

---

## テスト内容

### 1. Camera Injection テスト

| 項目 | 内容 |
|------|------|
| **テストサイト** | https://webcamtests.com/ |
| **検証内容** | インジェクトされたカメラ映像が表示されるか |
| **成功条件** | `<video>` 要素が存在し、映像が再生されている |

**処理フロー:**
1. WebRTC テストサイトにアクセス
2. カメラテストを開始
3. インジェクトされた映像が表示されるか確認
4. スクリーンショットを保存

### 2. Audio Injection テスト

| 項目 | 内容 |
|------|------|
| **テストサイト** | https://www.onlinemictest.com/ |
| **検証内容** | インジェクトされた音声がマイク入力として認識されるか |
| **成功条件** | 音声の可視化（波形表示など）が確認できる |

**処理フロー:**
1. マイクテストサイトにアクセス
2. マイクテストを開始
3. BrowserStack Executor で音声再生を開始
4. 音声が認識されているか確認
5. スクリーンショットを保存
6. 音声再生を停止

### 3. 基本接続テスト（simple.spec.js）

BrowserStack への接続確認用の基本テストも含まれています:
- ページアクセス確認
- ブラウザ情報取得
- JavaScript 実行
- スクリーンショット取得

---

## 結果の確認

### 成功/失敗の判定

| 結果 | 説明 |
|------|------|
| **成功** | テストがパスし、スクリーンショットでメディアの表示/認識が確認できる |
| **失敗** | テストが失敗、またはメディアが表示/認識されない |

### 出力ファイル

```
browserstack-media-injection/
├── screenshots/           # テスト中に取得したスクリーンショット
│   ├── camera_test_*.png
│   ├── camera_active_*.png
│   ├── audio_initial_*.png
│   └── audio_active_*.png
└── logs/                  # 実行ログ
```

---

## プロジェクト構造

```
browserstack-media-injection/
├── package.json          # プロジェクト定義
├── wdio.conf.js          # WebdriverIO / BrowserStack 設定
├── .env.example          # 環境変数テンプレート
├── .env                  # 認証情報・設定（gitignore対象）
├── README.md             # このファイル
├── media/                # メディアファイル格納
│   ├── sample-video.mp4
│   └── sample-audio.mp3
├── scripts/
│   └── upload-media.js   # BrowserStack へのメディアアップロード
├── test/
│   └── specs/
│       ├── media-injection.spec.js  # メインテスト
│       └── simple.spec.js           # 接続確認テスト
├── screenshots/          # テスト実行時のスクリーンショット
└── logs/                 # 実行ログ
```

---

## 技術スタック

| コンポーネント | 技術 |
|---------------|------|
| テストフレームワーク | WebdriverIO + Mocha |
| BrowserStack連携 | @wdio/browserstack-service |
| メディアアップロード | axios + form-data |

---

## 環境変数一覧

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `BROWSERSTACK_USERNAME` | Yes | BrowserStack ユーザー名 |
| `BROWSERSTACK_ACCESS_KEY` | Yes | BrowserStack アクセスキー |
| `ENABLE_CAMERA_INJECTION` | No | カメラインジェクションの有効化 (`true`/`false`) |
| `ENABLE_AUDIO_INJECTION` | No | 音声インジェクションの有効化 (`true`/`false`) |
| `CAMERA_MEDIA_URL` | No | アップロード済みカメラ用メディアURL |
| `AUDIO_MEDIA_URL` | No | アップロード済み音声用メディアURL |

---

## 制約事項

### プラン要件

- **Automate Pro プラン以上**が必要
- 音声インジェクションは **Private Beta**（Desktop & Mobile Pro, Enterprise Pro）

### ファイル制限

| 種別 | 形式 | サイズ上限 |
|------|------|-----------|
| 動画 | MP4 | 15MB |
| 音声 | MP3, WAV | 15MB (Android) / 2MB (Windows/macOS) |

### メディア URL 有効期限

- アップロードしたメディアの URL は **30日間** 有効

---

## トラブルシューティング

### 認証エラー (401)

```bash
echo $BROWSERSTACK_USERNAME
echo $BROWSERSTACK_ACCESS_KEY
```

### カメラ/マイクが認識されない

1. Automate **Pro** プランであることを確認
2. `ENABLE_*_INJECTION=true` が設定されているか確認
3. `media://` URL が正しく設定されているか確認
4. メディアファイルが有効期限内か確認

### アップロード済みメディアの確認

```bash
source .env && curl -s -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
  -X GET "https://api-cloud.browserstack.com/automate/recent_media_files" | jq .
```

---

## 参考リンク

- [BrowserStack Camera Injection](https://www.browserstack.com/docs/automate/selenium/camera-injection)
- [BrowserStack Audio Injection](https://www.browserstack.com/docs/automate/selenium/audio-injection)
- [WebdriverIO BrowserStack Service](https://webdriver.io/docs/browserstack-service/)
