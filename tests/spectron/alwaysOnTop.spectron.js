const Application = require('./spectronSetup');
const { isMac } = require('../../js/utils/misc.js');
const robot = require('robotjs');
const WindowsActions = require('./spectronWindowsActions');
let app = new Application({});
let config,mIsAlwaysOnTop, windowActions;


describe('Tests for Always on top', () => {

    let originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = Application.getTimeOut();

    function getConfigPath(app) {
        return new Promise(function (resolve, reject) {
            app.client.addCommand('getUserDataPath', function () {
                return app.client.execute(function () {
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
    beforeAll(async (done) => {
        try {
            app = await new Application({}).startApplication({ alwaysOnTop: true });
            windowActions = await new WindowsActions(app);           
            config = await getConfigPath(app);
            done();
        } catch (err) {
            done.fail(new Error(`Unable to start application error: ${err}`));
        };
    });

    afterAll(async (done) => {
        try {

            await windowActions.openMenu(["Window", "Always on Top"]);
            if (app && app.isRunning()) {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
                await app.stop();
                done();
            }
        } catch (err) {
            done.fail(new Error(`Failed at post-condition: ${err}`));
        };
    });

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

    it('should check is always on top', async (done) => {
        let userData = await Application.readConfig(config);
        mIsAlwaysOnTop = await app.browserWindow.isAlwaysOnTop();
        try {
            if (userData.alwaysOnTop) {
                await expect(mIsAlwaysOnTop).toBeTruthy();
                await done();
            } else {
                await expect(mIsAlwaysOnTop).toBeFalsy();
                await done();
            }
        }
        catch (err) {
            done.fail(new Error(`alwaysOnTop failed in readConfig with error: ${err}`));
        };
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
                expect(isAlwaysOnTop).toBeTruthy();
                done();
            }).catch((err) => {
                done.fail(new Error(`alwaysOnTop failed in isAlwaysOnTop with error: ${err}`));
            });
        }
    });

});
