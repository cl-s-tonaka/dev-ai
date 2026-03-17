/**
 * BrowserStack Media Injection Test
 *
 * Camera/Audio Injectionの機能テスト
 * 環境変数 ENABLE_CAMERA_INJECTION / ENABLE_AUDIO_INJECTION で有効・無効を制御
 */

const fs = require('fs');
const path = require('path');

// 環境変数から設定を取得
const cameraEnabled = process.env.ENABLE_CAMERA_INJECTION === 'true';
const audioEnabled = process.env.ENABLE_AUDIO_INJECTION === 'true';

describe('BrowserStack Media Injection', () => {

    const screenshotDir = path.join(process.cwd(), 'screenshots');

    before(() => {
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        console.log('=== Media Injection Settings ===');
        console.log(`Camera Injection: ${cameraEnabled ? 'ENABLED' : 'DISABLED'}`);
        console.log(`Audio Injection: ${audioEnabled ? 'ENABLED' : 'DISABLED'}`);
        console.log('================================');
    });

    async function saveScreenshot(name) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `${name}_${timestamp}.png`;
        const filepath = path.join(screenshotDir, filename);
        await browser.saveScreenshot(filepath);
        console.log(`Screenshot saved: ${filepath}`);
        return filepath;
    }

    // Camera Injectionテスト（cameraEnabled時のみ実行）
    describe('Camera Injection', () => {

        before(function() {
            if (!cameraEnabled) {
                console.log('Skipping Camera Injection tests (ENABLE_CAMERA_INJECTION=false)');
                this.skip();
            }
        });

        it('should inject camera feed on WebRTC test page', async () => {
            console.log('Starting camera injection test...');

            await browser.url('https://webcamtests.com/');
            await browser.pause(3000);
            await saveScreenshot('camera_test');

            const testButton = await $('button*=Test');
            if (await testButton.isExisting()) {
                await testButton.click();
                console.log('Clicked test camera button');
            }

            await browser.pause(5000);

            const videoElement = await $('video');
            const isVideoPresent = await videoElement.isExisting();
            console.log(`Video element present: ${isVideoPresent}`);

            if (isVideoPresent) {
                const videoWidth = await browser.execute(() => {
                    const video = document.querySelector('video');
                    return video ? video.videoWidth : 0;
                });
                console.log(`Video width: ${videoWidth}`);
            }

            await saveScreenshot('camera_active');
            console.log('Camera injection test completed');
        });
    });

    // Audio Injectionテスト（audioEnabled時のみ実行）
    describe('Audio Injection', () => {

        before(function() {
            if (!audioEnabled) {
                console.log('Skipping Audio Injection tests (ENABLE_AUDIO_INJECTION=false)');
                this.skip();
            }
        });

        async function startAudioInjection() {
            try {
                await browser.execute('browserstack_executor: {"action":"startAudio"}');
                console.log('Audio injection started via BrowserStack executor');
            } catch (error) {
                console.log('startAudio executor not available:', error.message);
            }
        }

        async function stopAudioInjection() {
            try {
                await browser.execute('browserstack_executor: {"action":"stopAudio"}');
                console.log('Audio injection stopped');
            } catch (error) {
                console.log('stopAudio executor not available');
            }
        }

        it('should inject audio on microphone test page', async () => {
            console.log('Starting audio injection test...');

            await browser.url('https://www.onlinemictest.com/');
            await browser.pause(3000);
            await saveScreenshot('audio_initial');

            const startButton = await $('button*=Start');
            if (await startButton.isExisting()) {
                await startButton.click();
                console.log('Started microphone test');
            }

            await startAudioInjection();
            await browser.pause(5000);

            const hasAudioVisualization = await browser.execute(() => {
                const canvases = document.querySelectorAll('canvas');
                return canvases.length > 0;
            });
            console.log(`Audio visualization present: ${hasAudioVisualization}`);

            await saveScreenshot('audio_active');
            await stopAudioInjection();

            console.log('Audio injection test completed');
        });
    });

    after(async () => {
        console.log('\n========================================');
        console.log('Media Injection tests completed');
        console.log(`Screenshots saved to: ${screenshotDir}`);
        console.log('========================================\n');
    });
});
