const Application = require('./spectronSetup');
const { isMac } = require('../../js/utils/misc');
const robot = require('robotjs');
const WindowsActions = require('./spectronWindowsActions');
const Utils = require('./spectronUtils');
let config, wActions, app;
let mainApp = new Application({});

describe('Tests for Minimize on Close', () => {

    jasmine.DEFAULT_TIMEOUT_INTERVAL = Application.getTimeOut();
    let originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

    beforeAll(async (done) => {
        try {
            app = await mainApp.startApplication({ alwaysOnTop: false });
            await Utils.sleep(2);
            wActions = await new WindowsActions(app);
            config = await getConfigPath();
            await wActions.focusWindow();
            await done();
        } catch (err) {
            done.fail(new Error(`Unable to start application error: ${err}`));
        };
    });

    function getConfigPath() {
        return new Promise(function (resolve, reject) {
            app.client.addCommand('getUserDataPath', function () {
                return this.execute(function () {
                    return require('electron').remote.app.getPath('userData');
                })
            });
            app.client.getUserDataPath().then((userConfigPath) => {
                resolve(userConfigPath.value)
            }).catch((err) => {
                reject(err);
            });
        });
    }

    afterAll(async (done) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        try {
            if (app && app.isRunning()) {
                wActions.closeChromeDriver();
                done();
            }
        } catch (error) {
            done.fail(new Error(`After all: ${error}`));

        }
    });

    it('should check whether the app is minimized', async (done) => {
        try {
            let userConfig = await Application.readConfig(config);           
            await wActions.bringToFront("Symphony");
            let count = await app.client.getWindowCount();
            console.log(count);
            if (!isMac)
                await wActions.openMenu(["Window", "Minimize on Close"]);
            else
                await wActions.openMenuOnMac(["View", "Minimize on Close"]);
            if (userConfig.minimizeOnClose == false) {
                if (!isMac)
                    await wActions.openMenu(["Window", "Minimize on Close"]);
                else
                    await wActions.openMenuOnMac(["View", "Minimize on Close"]);
            }
            if (!isMac)
                await wActions.openMenu(["Window", "Close"]);
            else
                await wActions.openMenuOnMac(["Window", "Close"]);   
            try
            {
                count = await app.client.getWindowCount();
            }
            catch(err1)
            {
                count =0;
            }
            await expect(count === 0).toBeTruthy();
            await done();
        } catch (err) {
            done.fail(new Error(`should check whether the app is minimized: ${err}`));
        };
    });
})







