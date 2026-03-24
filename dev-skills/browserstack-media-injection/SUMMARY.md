# BrowserStack Media Injection - Project Summary

## Purpose

This is a **validation project** to verify whether BrowserStack's Media Injection feature works correctly.

This project is **independent** from our main development work and serves solely as a proof-of-concept to confirm the availability and functionality of BrowserStack's premium features.

| Item | Description |
|------|-------------|
| **Target Feature** | BrowserStack Media Injection (Camera & Audio) |
| **Objective** | Verify if the injection features are available and functional |
| **Output** | Test results (pass/fail) and screenshots |

---

## What We Test

### 1. Camera Injection Test

| Aspect | Detail |
|--------|--------|
| Test Site | https://webcamtests.com/ |
| Validation | Check if injected camera feed is displayed |
| Success Criteria | `<video>` element exists and video is playing |

**Test Flow:**
1. Navigate to WebRTC camera test site
2. Start camera test
3. Verify injected video feed appears
4. Capture screenshot for evidence

### 2. Audio Injection Test

| Aspect | Detail |
|--------|--------|
| Test Site | https://www.onlinemictest.com/ |
| Validation | Check if injected audio is recognized as microphone input |
| Success Criteria | Audio visualization (waveform) is visible |

**Test Flow:**
1. Navigate to microphone test site
2. Start microphone test
3. Trigger audio playback via BrowserStack Executor
4. Verify audio input is detected
5. Capture screenshot for evidence
6. Stop audio playback

---

## How to Run

### Prerequisites

- BrowserStack **Automate Pro** plan or higher
- Node.js 18+
- FFmpeg (for creating sample media files)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure credentials
cp .env.example .env
# Edit .env with your BrowserStack credentials

# 3. Create and upload media files
ffmpeg -f lavfi -i testsrc=duration=10:size=640x480:rate=30 \
  -f lavfi -i sine=frequency=440:duration=10 \
  -c:v libx264 -c:a aac -shortest ./media/sample-video.mp4

npm run upload-media -- ./media/sample-video.mp4

# 4. Add media URL to .env
# ENABLE_CAMERA_INJECTION=true
# CAMERA_MEDIA_URL=media://xxxxx
```

### Execute Tests

```bash
npm test
```

---

## Results

| Outcome | Meaning |
|---------|---------|
| **Pass** | Test passes and screenshot confirms media is displayed/recognized |
| **Fail** | Test fails or media is not displayed/recognized |

Screenshots are saved to `./screenshots/` directory for manual verification.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Test Framework | WebdriverIO + Mocha |
| BrowserStack Integration | @wdio/browserstack-service |
| Media Upload | axios + form-data |

---

## Limitations

- Requires **Automate Pro** plan or higher
- Audio Injection is in **Private Beta** (Desktop & Mobile Pro, Enterprise Pro)
- Media URL expires after **30 days**
- File size limits: Video 15MB, Audio 2MB (Windows/macOS)

---

## References

- [BrowserStack Camera Injection Docs](https://www.browserstack.com/docs/automate/selenium/camera-injection)
- [BrowserStack Audio Injection Docs](https://www.browserstack.com/docs/automate/selenium/audio-injection)
