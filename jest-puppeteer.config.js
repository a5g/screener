const globals = {
  browser: {
    width: 1800,
    height: 950,
  },
  elementTimeout: 25,
}

module.exports = {
  launch: {
    headless: true,
    slowMo: 0,
    devtools: false,
    // executablePath:
    //   '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // userDataDir: './puppeteer-profile',
    args: [`--window-size=${globals.browser.width},${globals.browser.height}`], // new option
    defaultViewport: {
      width: globals.browser.width,
      height: globals.browser.height,
    },
    timeout: globals.elementTimeout * 1000,
    ignoreHTTPSErrors: true,
    // dumpio: false,
    // slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
  },
  exitOnPageError: false,
}
