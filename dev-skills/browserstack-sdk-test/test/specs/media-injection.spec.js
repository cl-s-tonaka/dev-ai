const { mediaInjectionConfig } = require('../../wdio.conf.js');

const cameraEnabled = mediaInjectionConfig.cameraEnabled;
const audioEnabled = mediaInjectionConfig.audioEnabled;

describe('Media Injection Test', () => {
    describe('Camera Injection', function() {
        before(function() {
            if (!cameraEnabled) this.skip();
        });

        it('should inject camera on WebRTC page', async () => {
            await browser.url('https://webcamtests.com/');
            await browser.pause(3000);
            console.log('Camera injection test executed');
        });
    });

    describe('Audio Injection', function() {
        before(function() {
            if (!audioEnabled) this.skip();
        });

        it('should inject audio on mic test page', async () => {
            await browser.url('https://www.onlinemictest.com/');
            await browser.pause(3000);
            console.log('Audio injection test executed');
        });
    });
});
