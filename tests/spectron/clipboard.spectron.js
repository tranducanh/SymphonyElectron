const Application = require('./spectronSetup');
const path = require('path');

let app = new Application({});

describe('Tests for clipboard', () => {

    let originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = Application.getTimeOut();

    beforeAll((done) => {
        return app.startApplication().then((startedApp) => {
            app = startedApp;
            app.client.url('file:///' + path.join(__dirname, '..', '..', 'demo/index.html'));
            done();
        }).catch((err) => {
            done.fail(new Error(`Unable to start application error: ${err}`));
        });
    });

    afterAll((done) => {
        if (app && app.isRunning()) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            app.stop().then(() => {
                done();
            }).catch((err) => {
                done();
            });
        }
    });   

    it('should set the username field', () => {
        return app.client
            .windowByIndex(0)
            .setValue('#tag', 'Test')
            .getValue('#tag').then((value) => {
                expect(value === 'Test').toBeTruthy();
            });
    });

    it('should verify electron clipboard', () => {
        return app.client
            .getValue('#tag').then((value) => {
                return app.electron.clipboard.writeText(value)
                    .electron.clipboard.readText().then((clipboardText) => {
                        expect(clipboardText === 'Test').toBeTruthy();
                    });
            });
    });

    it('should verify electron clipboard copy', () => {
        return app.electron.clipboard.writeText('Testing copy')
            .electron.clipboard.readText().then((clipboardText) => {
                return app.client.setValue('#tag', clipboardText).getValue('#tag').then((value) => {
                    expect(value === 'Testing copy').toBeTruthy();
                });
            });
    });
});
