const Application = require('./spectronSetup');
const WebDriver = require('./spectronWebDriver');
const { isMac } = require('../../js/utils/misc.js');
var app = new Application({});

var webdriver = new WebDriver({ browser: 'chrome' });
const WindowsAction = require('./spectronWindowsActions');
const WebActions = require('./spectronWebActions');
const specconst = require('./spectronConstants.js');
const Utils = require('./spectronUtils');
const ifc = require('./spectronInterfaces.js');
let webActions, windowAction;

describe('Verify Flash notification in taskbar option when multiple applications are opened', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = specconst.TIMEOUT_TEST_SUITE;
    let originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    beforeAll(async (done) => {
        try {
            app = await new Application({}).startApplication({ testedHost: specconst.TESTED_HOST, alwaysOnTop: true });
            windowAction = await new WindowsAction(app);
            webActions = await new WebActions(app);
            webdriver.windowAction = windowAction;
            webdriver.webActions = webActions;
            done();
        } catch (err) {
            done.fail(new Error(`Unable to start application error: ${err}`));
        };
    });
    afterAll(async (done) => {
        try {
            if (app && app.isRunning()) {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = await originalTimeout;
                await app.stop();
                await webdriver.quit();
                done();
            }
        } catch (err) {
            done.fail(new Error(`Failed at post-condition: ${err}`));
        };
    });
    /**
      * Verify Flash notification in taskbar option when multiple applications are opened
      * TC-ID: 47308146
     * Cover scenarios in AVT-1083
     */
    it('Verify Flash notification in taskbar option when multiple applications are opened', async (done) => {

        try {
            await webdriver.startDriver();
            await webdriver.login(specconst.USER_A);
            await webdriver.createIM(specconst.USER_B.username);
            await webActions.login(specconst.USER_B);
            await windowAction.reload();
            await app.client.waitForVisible(ifc.SETTTING_BUTTON, Utils.toMs(50));
            await webActions.persistToastIM(true);
            await webdriver.clickLeftNavItem(specconst.USER_B.name);
            let messages = [];
            await messages.push(await Utils.randomString());
            await messages.push(await Utils.randomString());
            await messages.push(await Utils.randomString());
            await webdriver.sendMessagesAndVerifyToast(messages);
            await done();
        }
        catch (err) {
            done.fail(new Error(`Failed at when multiple applications are opened: ${err}`));
        };

    });

})

