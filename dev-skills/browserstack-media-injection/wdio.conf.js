require('dotenv').config();

const enableCameraInjection = process.env.ENABLE_CAMERA_INJECTION === 'true';
const enableAudioInjection  = process.env.ENABLE_AUDIO_INJECTION === 'true';

const cameraUrl = process.env.CAMERA_MEDIA_URL;
const audioUrl  = process.env.AUDIO_MEDIA_URL;

// BrowserStack options (W3C vendor caps)
const bstackOptions = {
  os: 'Windows',
  osVersion: '11',
  projectName: 'Media Injection Test',
  buildName: 'Media Injection Build',
  sessionName: 'BrowserStack Test',
  debug: true,
  networkLogs: true,
  consoleLogs: 'info',
  // source: 'webdriverio:media-injection-minimal:v1.0', // 任意（入れておくと識別しやすい）citeturn4view0
};

if (enableCameraInjection) {
  if (!cameraUrl) {
    throw new Error('ENABLE_CAMERA_INJECTION=true but CAMERA_MEDIA_URL is not set (expected media://<hashedid>)');
  }
  bstackOptions.cameraInjection = true;
  bstackOptions.cameraInjectionUrl = cameraUrl; // media://<hashedid> citeturn1view0
  console.log('Camera Injection: ENABLED');
} else {
  console.log('Camera Injection: DISABLED');
}

if (enableAudioInjection) {
  if (!audioUrl) {
    throw new Error('ENABLE_AUDIO_INJECTION=true but AUDIO_MEDIA_URL is not set (expected media://<hashedid>)');
  }
  bstackOptions.enableAudioInjection = true;
  bstackOptions.audioInjectionURL = audioUrl; // media://<hashedid> (URLは大文字) citeturn1view1turn2view2
  console.log('Audio Injection: ENABLED');
} else {
  console.log('Audio Injection: DISABLED');
}

exports.config = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY, // WebdriverIO BrowserStack serviceは user/key を利用 citeturn4view3

  specs: ['./test/specs/**/*.spec.js'],
  maxInstances: 1,

  capabilities: [{
    browserName: 'chrome',
    browserVersion: 'latest',  // BrowserStack WebdriverIOガイドに合わせてcapabilities直下 citeturn4view0
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
  mochaOpts: { ui: 'bdd', timeout: 120000 },

  logLevel: 'info',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  afterTest: async function (test, context, { passed }) {
    if (!passed) {
      await browser.takeScreenshot();
    }
  }
};

exports.mediaInjectionConfig = {
  cameraEnabled: enableCameraInjection,
  audioEnabled: enableAudioInjection
};
