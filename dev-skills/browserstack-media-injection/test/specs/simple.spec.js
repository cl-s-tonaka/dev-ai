/**
 * シンプルなBrowserStackテスト
 *
 * BrowserStackへの接続確認とAPI呼び出しの基本テスト
 */

describe('BrowserStack Basic Test', () => {

    it('should connect to BrowserStack and open a page', async () => {
        // Googleにアクセス
        await browser.url('https://www.google.com');

        // ページタイトルを取得
        const title = await browser.getTitle();
        console.log(`Page title: ${title}`);

        // タイトルにGoogleが含まれることを確認
        expect(title).toContain('Google');
    });

    it('should get browser capabilities', async () => {
        // ブラウザ情報を取得
        const capabilities = await browser.capabilities;

        console.log('Browser Name:', capabilities.browserName);
        console.log('Browser Version:', capabilities.browserVersion);
        console.log('Platform:', capabilities.platformName);

        // capabilitiesが存在することを確認
        expect(capabilities.browserName).toBeDefined();
    });

    it('should execute JavaScript in browser', async () => {
        await browser.url('https://www.google.com');

        // JavaScriptを実行してユーザーエージェントを取得
        const userAgent = await browser.execute(() => {
            return navigator.userAgent;
        });

        console.log('User Agent:', userAgent);

        // User Agentが文字列であることを確認
        expect(typeof userAgent).toBe('string');
        expect(userAgent.length).toBeGreaterThan(0);
    });

    it('should take a screenshot', async () => {
        await browser.url('https://www.google.com');

        // スクリーンショットを取得（base64形式）
        const screenshot = await browser.takeScreenshot();

        console.log('Screenshot captured, length:', screenshot.length);

        // スクリーンショットが取得できていることを確認
        expect(screenshot).toBeDefined();
        expect(screenshot.length).toBeGreaterThan(0);
    });

});
