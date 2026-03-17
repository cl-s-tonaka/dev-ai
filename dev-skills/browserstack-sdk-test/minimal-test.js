/**
 * BrowserStack Media Injection - Minimum Executable Script
 *
 * Usage: node minimal-test.js
 *
 * Error encountered:
 * [BROWSERSTACK_INVALID_ACTION_BY_GROUP] Currently Camera Injection feature
 * is not available for your group.
 */

const https = require('https');

// BrowserStack Credentials
const BROWSERSTACK_USERNAME = 'flatboysinc_TWyqfZ';
const BROWSERSTACK_ACCESS_KEY = '******************';

// Media URLs (uploaded via BrowserStack API)
const CAMERA_MEDIA_URL = 'media://a25c7b6f547b4c88ddca665cd6bf6e9b05896b8f';
const AUDIO_MEDIA_URL = 'media://2483ba59fc7888a34ec833e41dfc6f0a8a737536';

// WebDriver session capabilities with Camera Injection enabled
const capabilities = {
    capabilities: {
        alwaysMatch: {
            browserName: 'Chrome',
            browserVersion: 'latest',
            'bstack:options': {
                os: 'Windows',
                osVersion: '11',
                projectName: 'Media Injection Test',
                buildName: 'Minimal Test Build',
                sessionName: 'Camera Injection Test',
                debug: true,
                networkLogs: true,
                consoleLogs: 'info',
                // Camera Injection settings
                cameraInjection: true,
                cameraInjectionUrl: CAMERA_MEDIA_URL
            }
        }
    }
};

function createSession() {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}`).toString('base64');
        const data = JSON.stringify(capabilities);

        const options = {
            hostname: 'hub.browserstack.com',
            port: 443,
            path: '/wd/hub/session',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': `Basic ${auth}`
            }
        };

        console.log('=== BrowserStack Media Injection Test ===\n');
        console.log('Credentials:');
        console.log(`  Username: ${BROWSERSTACK_USERNAME}`);
        console.log(`  AccessKey: ${BROWSERSTACK_ACCESS_KEY.substring(0, 4)}...`);
        console.log('\nCapabilities:');
        console.log(JSON.stringify(capabilities, null, 2));
        console.log('\nCreating session...\n');

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                console.log(`Status: ${res.statusCode}`);
                console.log(`Response:\n${body}`);

                try {
                    const result = JSON.parse(body);
                    if (result.value && result.value.error) {
                        console.log('\n=== ERROR ===');
                        console.log(`Error: ${result.value.error}`);
                        console.log(`Message: ${result.value.message}`);
                        reject(new Error(result.value.message));
                    } else if (result.value && result.value.sessionId) {
                        console.log('\n=== SUCCESS ===');
                        console.log(`Session ID: ${result.value.sessionId}`);
                        resolve(result.value.sessionId);
                    } else {
                        reject(new Error(body));
                    }
                } catch (e) {
                    reject(new Error(body));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// Run test
createSession()
    .then(sessionId => {
        console.log('\nCamera Injection session created successfully!');
        console.log(`Dashboard: https://automate.browserstack.com/dashboard`);
    })
    .catch(err => {
        console.error('\nFailed to create session with Camera Injection');
        console.error('This error occurs despite having Automate Pro plan.');
        process.exit(1);
    });
