// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'websiteLayout': function test(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    // const devServer = browser.globals.devServerURL;
    const devServer = 'http://127.0.0.1:8282/';

    browser
      .url(devServer)
      .waitForElementPresent('body', 500)
      .waitForElementPresent('.website-wrapper', 2000)
      .assert.cssClassPresent('body', 'dark-theme')
      .assert.containsText('nav li .router-link-active', '产品介绍')
      .assert.cssClassNotPresent('nav li:nth-child(2) a', 'router-link-active')
      .end();
  },
};
