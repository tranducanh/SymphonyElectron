const Application = require('./spectronSetup');
const specconst = require('./spectronConstants.js');
const WindowsAction = require('./spectronWindowsActions');
let windowAction;
let app = new Application({});

describe('Tests for Bring to front', () => {
    let originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = Application.getTimeOut();
    beforeAll(async (done) => {
        try {
            app = await new Application({}).startApplication({ testedHost: specconst.TESTED_HOST, alwaysOnTop: true });
            windowAction = await new WindowsAction(app);                   
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
   
    it('should restore the browser window and verify window focus',async (done) => {  
        let isFocused = await app.browserWindow.isFocused();        
        await expect(isFocused).toBe(true);
        done();
    });

});