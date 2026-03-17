#!/usr/bin/env node

/**
 * BrowserStack Media Upload Script
 *
 * Usage: npm run upload-media -- ./media/sample-video.mp4
 *
 * Uploads media files to BrowserStack and returns the media:// URL
 * for use in camera/audio injection tests.
 */

require('dotenv').config();

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME;
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;

// Automate (Desktop & Mobile Pro) - NOT app-automate
const UPLOAD_URL = 'https://api-cloud.browserstack.com/automate/upload-media';

async function uploadMedia(filePath) {
    if (!BROWSERSTACK_USERNAME || !BROWSERSTACK_ACCESS_KEY) {
        console.error('Error: BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set in .env');
        process.exit(1);
    }

    if (!filePath) {
        console.error('Usage: npm run upload-media -- <file-path>');
        console.error('Example: npm run upload-media -- ./media/sample-video.mp4');
        process.exit(1);
    }

    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
        console.error(`Error: File not found: ${absolutePath}`);
        process.exit(1);
    }

    const fileName = path.basename(absolutePath);
    const fileSize = fs.statSync(absolutePath).size;

    console.log(`Uploading: ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);

    const form = new FormData();
    form.append('file', fs.createReadStream(absolutePath));

    try {
        const response = await axios.post(UPLOAD_URL, form, {
            headers: {
                ...form.getHeaders()
            },
            auth: {
                username: BROWSERSTACK_USERNAME,
                password: BROWSERSTACK_ACCESS_KEY
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        const mediaUrl = response.data.media_url;

        console.log('\n✓ Upload successful!');
        console.log('----------------------------------------');
        console.log(`Media URL: ${mediaUrl}`);
        console.log('----------------------------------------');
        console.log('\nAdd this URL to your .env file:');

        // Detect if video or audio based on extension
        // Automate supports: MP4 (video), MP3/WAV (audio)
        const ext = path.extname(fileName).toLowerCase();
        if (['.mp4'].includes(ext)) {
            console.log(`CAMERA_MEDIA_URL=${mediaUrl}`);
        } else if (['.mp3', '.wav'].includes(ext)) {
            console.log(`AUDIO_MEDIA_URL=${mediaUrl}`);
        } else {
            console.log(`# Unknown type - set appropriate variable:`);
            console.log(`# Supported: MP4 (video), MP3/WAV (audio)`);
            console.log(`CAMERA_MEDIA_URL=${mediaUrl}  # for video`);
            console.log(`AUDIO_MEDIA_URL=${mediaUrl}   # for audio`);
        }

        return mediaUrl;

    } catch (error) {
        console.error('\n✗ Upload failed!');

        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Message: ${JSON.stringify(error.response.data, null, 2)}`);

            if (error.response.status === 401) {
                console.error('\nHint: Check your BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY');
            } else if (error.response.status === 422) {
                console.error('\nHint: File may be too large or in unsupported format');
                console.error('Supported formats: MP4 (video), MP3/WAV (audio)');
                console.error('Max file size: 15MB (video), 2MB (audio on Windows/macOS)');
            }
        } else {
            console.error(error.message);
        }

        process.exit(1);
    }
}

// Run if called directly
const filePath = process.argv[2];
uploadMedia(filePath);
