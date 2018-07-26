const Application = require('./spectronSetup');
<<<<<<< Updated upstream
const {isMac} = require('../../js/utils/misc.js');
const robot = require('robotjs');

let app = new Application({});
let configPath;
let mIsAlwaysOnTop;
=======
const WindowsActions = require('./spectronWindowsActions');
const WebActions = require('./spectronWebActions');
const Utils = require('./spectronUtils');
const {isMac} = require('../../js/utils/misc.js');

let app;
let windowActions;
let webActions;
let menuItem;
>>>>>>> Stashed changes

describe('Tests for Always on top', () => {

    let originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = Application.getTimeOut();

<<<<<<< Updated upstream
    beforeAll((done) => {
        return app.startApplication({alwaysOnTop: false}).then((startedApp) => {
            app = startedApp;
            getConfigPath().then((config) => {
                configPath = config;
                done();
            }).catch((err) => {
                done.fail(new Error(`Unable to start application error: ${err}`));
            });
        }).catch((err) => {
=======
    beforeAll(async (done) => {
        try {
            app = await new Application({}).startApplication({alwaysOnTop: false});
            windowActions = await new WindowsActions(app);
            webActions = await new WebActions(app);
            if(isMac){
                menuItem = "View";
            } else {
                menuItem = "Window";
            }
            done();
        } catch(err) {
>>>>>>> Stashed changes
            done.fail(new Error(`Unable to start application error: ${err}`));
        });
    });

<<<<<<< Updated upstream
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

    afterAll((done) => {
        if (app && app.isRunning()) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            app.stop().then(() => {
=======
    afterAll(async (done) => {
        try {
            await Utils.killProcess("notepad.exe");
            await Utils.killProcess("mspaint.exe");
            await windowActions.openMenu([menuItem,"Always on Top"]);
            if (app && app.isRunning()) {
>>>>>>> Stashed changes
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                done();
            }).catch((err) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                done.fail(new Error(`alwaysOnTop failed in afterAll with error: ${err}`));
            });
        }
    });

    it('should launch the app', (done) => {
        return app.client.waitUntilWindowLoaded().then(() => {
            return app.client.getWindowCount().then((count) => {
                expect(count === 1).toBeTruthy();
                done();
            });
        }).catch((err) => {
            done.fail(new Error(`alwaysOnTop failed in waitUntilWindowLoaded with error: ${err}`));
        });
    });

    it('should check window count', (done) => {
        return app.client.getWindowCount().then((count) => {
            expect(count === 1).toBeTruthy();
            done();
        }).catch((err) => {
            done.fail(new Error(`alwaysOnTop failed in getWindowCount with error: ${err}`));
        });
    });

    it('should check browser window visibility', (done) => {
        return app.browserWindow.isVisible().then((isVisible) => {
            expect(isVisible).toBeTruthy();
            done();
        }).catch((err) => {
            done.fail(new Error(`alwaysOnTop failed in isVisible with error: ${err}`));
        });
    });

<<<<<<< Updated upstream
    it('should bring the app to front in windows', (done) => {
        if (!isMac) {
            app.browserWindow.focus();
            app.browserWindow.restore();
            app.browserWindow.setAlwaysOnTop(true).then(() => {
                app.browserWindow.isAlwaysOnTop().then((isOnTop) => {
                    app.browserWindow.getBounds().then((bounds) => {
                        robot.setMouseDelay(200);
                        app.browserWindow.restore().then(() => {
                            let x = bounds.x + 95;
                            let y = bounds.y + 35;

                            robot.moveMouseSmooth(x, y);
                            robot.mouseClick();
                            robot.setKeyboardDelay(200);
                            for (let i = 0; i < 4
                                ; i++) {
                                robot.keyTap('down');
                            }
                            robot.keyTap('enter');
                            expect(isOnTop).toBeTruthy();
                            done();
                        })
                    });
                });
            }).catch((err) => {
                done.fail(new Error(`alwaysOnTop failed in setAlwaysOnTop with error: ${err}`));
            });
        } else {
            done();
        }
    });

    it('should check is always on top', (done) => {
        return Application.readConfig(configPath).then((userData) => {
            return app.browserWindow.isAlwaysOnTop().then((isAlwaysOnTop) => {
                mIsAlwaysOnTop = isAlwaysOnTop;
                if (userData.alwaysOnTop) {
                    expect(isAlwaysOnTop).toBeTruthy();
                    done();
                } else {
                    expect(isAlwaysOnTop).toBeFalsy();
                    done();
                }
                done();
            });
        }).catch((err) => {
            done.fail(new Error(`alwaysOnTop failed in readConfig with error: ${err}`));
        });
    });

    it('should toggle the always on top property to true', (done) => {
        if (isMac) {
            robot.setMouseDelay(200);
            robot.moveMouse(190, 0);
            robot.mouseClick();
            // Key tap 7 times as "Always on Top" is in the
            // 7th position under view menu item
            for (let i = 0; i < 7; i++) {
                robot.keyTap('down');
            }
            robot.keyTap('enter');
=======
    /**
     * Verify Always on Top options when multiple applications are opened
     * TC-ID: 2898431
     * Cover scenarios in AVT-990
     */
    it('Verify Always on Top options when multiple applications are opened', async (done) => {
        try {
            await windowActions.openMenu([menuItem,"Always on Top"]);
            //await webActions.minimizeWindows();
            await Utils.openAppInMaximize("C:\\Windows\\notepad.exe");
            await Utils.openAppInMaximize("C:\\Windows\\system32\\mspaint.exe");
            await windowActions.showWindow();
            await windowActions.clickOutsideWindow();
            await windowActions.verifyWindowsOnTop();

            //Close and open app again, make sure it's always on top
            await app.stop();
            app = await new Application({}).startApplication();
            windowActions = await new WindowsActions(app);
            webActions = await new WebActions(app);
            await windowActions.clickOutsideWindow();
            await windowActions.verifyWindowsOnTop();
>>>>>>> Stashed changes
            done();
        } else {
            app.browserWindow.getBounds().then((bounds) => {
                app.browserWindow.focus();
                robot.setMouseDelay(200);
                app.browserWindow.restore().then(() => {
                    let x = bounds.x + 95;
                    let y = bounds.y + 35;

                    robot.moveMouseSmooth(x, y);
                    robot.mouseClick();
                    // Key tap 4 times as "Always on Top" is in the
                    // 4th position under window menu item
                    for (let i = 0; i < 4; i++) {
                        robot.keyTap('down');
                    }
                    robot.keyTap('enter');
                    done();
                });
            }).catch((err) => {
                done.fail(new Error(`alwaysOnTop failed in getBounds with error: ${err}`));
            });
        }
    });

    it('should check is always on top to be true', (done) => {
        if (!mIsAlwaysOnTop) {
            return app.browserWindow.isAlwaysOnTop().then((isAlwaysOnTop) => {
                expect(isAlwaysOnTop).toBeTruthy();
                done();
            }).catch((err) => {
                done.fail(new Error(`alwaysOnTop failed in isAlwaysOnTop with error: ${err}`));
            });
        } else {
            return app.browserWindow.isAlwaysOnTop().then((isAlwaysOnTop) => {
                expect(isAlwaysOnTop).toBeFalsy();
                done();
            }).catch((err) => {
                done.fail(new Error(`alwaysOnTop failed in isAlwaysOnTop with error: ${err}`));
            });
        }
    });

});
