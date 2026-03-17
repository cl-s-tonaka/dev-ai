require('dotenv').config();
const yaml = require('js-yaml');
const fs = require('fs');

// browserstack.ymlから設定を読み込み
const bsConfig = yaml.load(fs.readFileSync('./browserstack.yml', 'utf8'));

// 環境変数を解決する関数
function resolveEnvVar(value) {
    if (typeof value === 'string' && value.startsWith('${') && value.endsWith('}')) {
        const envKey = value.slice(2, -1);
        return process.env[envKey] || '';
    }
    return value;
}

// BrowserStack capabilitiesを構築
const bstackOptions = {
    os: bsConfig.platforms[0].os,
    osVersion: bsConfig.platforms[0].osVersion,
    browserVersion: bsConfig.platforms[0].browserVersion,
    projectName: bsConfig.projectName,
    buildName: bsConfig.buildName,
    sessionName: 'BrowserStack Test',
    debug: bsConfig.debug,
    networkLogs: bsConfig.networkLogs,
    consoleLogs: bsConfig.consoleLogs
};

// Camera Injection設定
if (bsConfig.cameraInjection === true) {
    bstackOptions.cameraInjection = true;
    bstackOptions.cameraInjectionUrl = resolveEnvVar(bsConfig.cameraInjectionUrl);
    console.log('Camera Injection: ENABLED');
} else {
    console.log('Camera Injection: DISABLED');
}

// Audio Injection設定
if (bsConfig.enableAudioInjection === true) {
    bstackOptions.enableAudioInjection = true;
    bstackOptions.audioInjectionURL = resolveEnvVar(bsConfig.audioInjectionURL);
    console.log('Audio Injection: ENABLED');
} else {
    console.log('Audio Injection: DISABLED');
}

exports.config = {
    user: resolveEnvVar(bsConfig.userName),
    key: resolveEnvVar(bsConfig.accessKey),

    specs: ['./test/specs/**/*.spec.js'],
    maxInstances: 1,

    capabilities: [{
        browserName: bsConfig.platforms[0].browserName,
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
    cameraEnabled: bsConfig.cameraInjection === true,
    audioEnabled: bsConfig.enableAudioInjection === true
};
