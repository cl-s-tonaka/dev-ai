# BrowserStack Support Inquiry - Camera Injection Feature Not Available

## Issue Summary

Camera Injection feature returns error despite having Automate Pro plan.

**Error Message:**
```
[BROWSERSTACK_INVALID_ACTION_BY_GROUP] Currently Camera Injection feature is not available for your group.
```

## Account Information

- **Username:** flatboysinc_TWyqfZ
- **Plan:** Automate Pro (subscribed)

## Media Files Uploaded

Camera media uploaded via BrowserStack API:
- **Media URL:** `media://a25c7b6f547b4c88ddca665cd6bf6e9b05896b8f`

## Minimum Executable Script

```javascript
const https = require('https');

const BROWSERSTACK_USERNAME = 'flatboysinc_TWyqfZ';
const BROWSERSTACK_ACCESS_KEY = '********************';
const CAMERA_MEDIA_URL = 'media://a25c7b6f547b4c88ddca665cd6bf6e9b05896b8f';

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
                cameraInjection: true,
                cameraInjectionUrl: CAMERA_MEDIA_URL
            }
        }
    }
};

const auth = Buffer.from(`${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}`).toString('base64');
const data = JSON.stringify(capabilities);

const req = https.request({
    hostname: 'hub.browserstack.com',
    port: 443,
    path: '/wd/hub/session',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Basic ${auth}`
    }
}, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => console.log(body));
});

req.write(data);
req.end();
```

## Execution Result

```
Status: 200
Response:
{
  "value": {
    "error": "[BROWSERSTACK_INVALID_ACTION_BY_GROUP] Currently Camera Injection feature is not available for your group. If you have any concerns please reach out to support.",
    "message": "[BROWSERSTACK_INVALID_ACTION_BY_GROUP] Currently Camera Injection feature is not available for your group. If you have any concerns please reach out to support."
  },
  "sessionId": "",
  "status": 13
}
```

## Request

Please enable Camera Injection feature for our account/group, as we have subscribed to Automate Pro plan which should include this feature.

## Environment

- **Node.js version:** v22.x
- **Date:** 2026-03-17
- **Endpoint:** hub.browserstack.com/wd/hub/session
