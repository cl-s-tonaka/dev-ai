# BrowserStack SDK Test

BrowserStack SDK + browserstack.yml を使用した最小構成テスト

## セットアップ

```bash
npm install
```

## 使い方

### テスト実行

```bash
npm test
```

### Media Injection切り替え

browserstack.ymlを編集:
- Camera: `cameraInjection: true/false`
- Audio: `enableAudioInjection: true/false`

## ファイル構成

- `browserstack.yml`: BrowserStack設定
- `wdio.conf.js`: WebdriverIO設定
- `test/specs/`: テストファイル

## Sources

- [browserstack-node-sdk](https://www.npmjs.com/package/browserstack-node-sdk)
- [BrowserStack SDK Integration](https://www.browserstack.com/docs/automate/selenium/getting-started/nodejs/integrate-your-tests)
