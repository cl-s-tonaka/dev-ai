# BrowserStack Media Injection サンプル

BrowserStack Automate Proプランのmedia injection機能を検証するためのサンプルプロジェクトです。

## 前提条件

- **BrowserStack Automate Pro プラン**（Media Injectionはプレミアム機能）
- Node.js 18+
- FFmpeg（メディアファイル作成用）

## セットアップ

### 1. 依存関係のインストール

```bash
cd browserstack-media-injection
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` ファイルを編集して BrowserStack の認証情報を設定:

```
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
```

### 3. メディアファイルの準備

#### サンプルビデオの作成（カメラ用）

```bash
ffmpeg -f lavfi -i testsrc=duration=10:size=640x480:rate=30 \
  -f lavfi -i sine=frequency=440:duration=10 \
  -c:v libx264 -c:a aac -shortest \
  ./media/sample-video.mp4
```

#### サンプル音声の作成（マイク用）

```bash
# Windows/macOSは2MB制限があるため、ビットレートを抑える
ffmpeg -f lavfi -i sine=frequency=440:duration=10 \
  -c:a libmp3lame -b:a 128k \
  ./media/sample-audio.mp3
```

### 4. メディアファイルのアップロード

```bash
# ビデオファイルのアップロード
npm run upload-media -- ./media/sample-video.mp4

# 音声ファイルのアップロード
npm run upload-media -- ./media/sample-audio.mp3
```

出力された `media://` URLを `.env` ファイルに設定:

```
CAMERA_MEDIA_URL=media://xxxxxxxx
AUDIO_MEDIA_URL=media://yyyyyyyy
```

## テスト実行

```bash
npm test
```

## プロジェクト構造

```
browserstack-media-injection/
├── package.json          # プロジェクト定義・依存関係
├── wdio.conf.js          # WebdriverIO/BrowserStack設定
├── .env.example          # 環境変数テンプレート
├── .gitignore
├── README.md
├── media/                # メディアファイル格納（gitignore対象）
│   └── .gitkeep
├── scripts/
│   └── upload-media.js   # BrowserStackへのメディアアップロード
└── test/
    └── specs/
        └── media-injection.spec.js  # テストスペック
```

## テスト内容

1. **カメラインジェクションテスト**
   - WebRTCテストサイトでカメラアクセスを確認
   - インジェクトされたビデオが表示されることを検証

2. **音声インジェクションテスト**
   - マイクテストサイトで音声入力を確認
   - インジェクトされた音声が認識されることを検証

3. **複合テスト**
   - カメラ・マイク両方を使用するWebRTCテスト

## 設定可能なCapabilities

`wdio.conf.js` で設定可能な主なオプション:

```javascript
'bstack:options': {
    // カメラインジェクション
    cameraInjection: true,
    cameraInjectionUrl: 'media://xxx',

    // 音声インジェクション
    enableAudioInjection: true,
    audioInjectionURL: 'media://xxx',

    // その他
    os: 'Windows',          // Windows / OS X
    osVersion: '11',
    browserVersion: 'latest'
}
```

## サポート環境

### カメラインジェクション

| プラットフォーム | ブラウザ | バージョン |
|------------------|----------|------------|
| Windows | Chrome | 101+ |
| Windows | Edge | 101+ |
| macOS | Chrome | 101+ |
| macOS | Edge | 101+ |
| Android | Chrome | Android 9+ |
| iOS | Safari | iOS 12+ |

### 音声インジェクション

| プラットフォーム | ブラウザ | バージョン |
|------------------|----------|------------|
| Windows 10+ | Chrome/Edge | 最新 |
| macOS | Chrome/Edge | 最新 |
| Android 11+ | Chrome | 最新 |

※ 音声インジェクションは **Private Beta** 機能（Desktop & Mobile Pro, Enterprise Pro プラン）

## アップロード済みメディアの確認

```bash
# .envを読み込んで確認
source .env && curl -s -u "$BROWSERSTACK_USERNAME:$BROWSERSTACK_ACCESS_KEY" \
  -X GET "https://api-cloud.browserstack.com/automate/recent_media_files" | jq .
```

## 注意事項

- メディアURLの有効期限は **30日間**
- ファイルサイズ上限:
  - 動画: **15MB**
  - 音声: **15MB** (Android), **2MB** (Windows/macOS)
- サポートフォーマット:
  - 動画: **MP4のみ**
  - 音声: **MP3, WAV**
- 音声インジェクション（Windows/macOS）はBrowserStack JavaScript Executorで再生制御が必要

## トラブルシューティング

### アップロードが401エラーになる

BrowserStackの認証情報を確認してください:
```bash
echo $BROWSERSTACK_USERNAME
echo $BROWSERSTACK_ACCESS_KEY
```

### テストでカメラ/マイクが認識されない

1. Automate **Pro** プランであることを確認
2. media:// URLが正しく設定されているか確認
3. メディアファイルが有効期限内か確認

### スクリーンショットが保存されない

`screenshots/` ディレクトリの書き込み権限を確認してください。

## 参考リンク

- [BrowserStack Camera Injection](https://www.browserstack.com/docs/automate/selenium/camera-injection)
- [BrowserStack Audio Injection](https://www.browserstack.com/docs/automate/selenium/audio-injection)
- [WebdriverIO BrowserStack Service](https://webdriver.io/docs/browserstack-service/)
