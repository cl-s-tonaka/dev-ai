require('dotenv').config();

// Media Injection設定を環境変数から取得
const enableCameraInjection = process.env.ENABLE_CAMERA_INJECTION === 'true';
const enableAudioInjection = process.env.ENABLE_AUDIO_INJECTION === 'true';

// BrowserStack capabilitiesを動的に構築
const bstackOptions = {
    os: 'Windows',
    osVersion: '11',
    browserVersion: 'latest',
    projectName: 'Media Injection Test',
    buildName: 'Media Injection Build',
    sessionName: 'BrowserStack Test',
    debug: true,
    networkLogs: true,
    consoleLogs: 'info'
};

// Camera Injection設定（有効時のみ追加）
if (enableCameraInjection) {
    bstackOptions.cameraInjection = true;
    bstackOptions.cameraInjectionUrl = process.env.CAMERA_MEDIA_URL || '';
    console.log('Camera Injection: ENABLED');
} else {
    console.log('Camera Injection: DISABLED');
}

// Audio Injection設定（有効時のみ追加）
if (enableAudioInjection) {
    bstackOptions.enableAudioInjection = true;
    bstackOptions.audioInjectionURL = process.env.AUDIO_MEDIA_URL || '';
    console.log('Audio Injection: ENABLED');
} else {
    console.log('Audio Injection: DISABLED');
}

exports.config = {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,

    specs: [
        './test/specs/**/*.spec.js'
    ],

    maxInstances: 1,

    capabilities: [{
        browserName: 'Chrome',
        acceptInsecureCerts: true,
        'bstack:options': bstackOptions
    }],

    services: [
        ['browserstack', {
            testObservability: false
        }]
    ],

    framework: 'mocha',
    reporters: ['spec'],

    mochaOpts: {
        ui: 'bdd',
        timeout: 120000
    },

    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    afterTest: async function (test, context, { error, result, duration, passed, retries }) {
        if (!passed) {
            await browser.takeScreenshot();
        }
    }
};

// 設定内容をエクスポート（テストから参照用）
exports.mediaInjectionConfig = {
    cameraEnabled: enableCameraInjection,
    audioEnabled: enableAudioInjection
};
