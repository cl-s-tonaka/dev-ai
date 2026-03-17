describe('BrowserStack Basic Test', () => {
    it('should connect and open Google', async () => {
        await browser.url('https://www.google.com');
        const title = await browser.getTitle();
        console.log('Page title:', title);
        expect(title).toContain('Google');
    });

    it('should get browser capabilities', async () => {
        const caps = await browser.capabilities;
        console.log('Browser:', caps.browserName, caps.browserVersion);
        expect(caps.browserName).toBeDefined();
    });
});
