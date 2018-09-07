const Application = require('./spectronSetup');
const path = require('path');
const { buildNumber } = require('../../package');
const electronVersion = require('../../package').devDependencies.electron;
const bluebird = require('bluebird');

const API_VERSION = '2.0.0';
const SEARCH_API_VERSION = '3.0.0-beta.8';

let mainApp = new Application({});
let app;

describe('Tests for getVersionInfo API', () => {

    let originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = Application.getTimeOut();

    beforeAll(async (done) => {
        try {
            let url = await 'file:///' + path.join(__dirname, '..', '..', 'demo/index.html')
            app = await mainApp.startApplication({ alwaysOnTop: false,testedHost:url });                    
            await done();
        } catch (err) {
            done.fail(new Error(`Unable to start application error: ${err}`));
        };
    });

    afterAll(async (done) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        try {
            if (app && app.isRunning()) {
                await app.stop();              
                done();
            }
        } catch (err) {
            await app.stop();           
            done.fail(new Error(`Failed at post-condition: ${err}`));
        };
    });


    // it('should launch the app', (done) => {
    //     return app.client.waitUntilWindowLoaded().then(() => {
    //         return app.client.getWindowCount().then((count) => {
    //             expect(count === 1).toBeTruthy();
    //             done();
    //         }).catch((err) => {
    //             done.fail(new Error(`getVersionInfo failed in getWindowCount with error: ${err}`));
    //         });
    //     }).catch((err) => {
    //         done.fail(new Error(`getVersionInfo failed in waitUntilWindowLoaded with error: ${err}`));
    //     });
    // });

    // it('should load demo html page', () => {
    //     return app.client.url('file:///' + path.join(__dirname, '..', '..', 'demo/index.html'));
    // });

    it('should verify if the version numbers are correct', async (done) => {
        try {
        await app.client.waitForExist('#get-version', 2000);
        await app.client.click('#get-version');
        let _api_version = await app.client.getText("#api-version")
        let _container_identifier = await app.client.getText("#container-identifier")
        let _container_ver = await app.client.getText("#container-ver")
        let _build_number = await app.client.getText("#build-number")
        let _search_api_ver = await app.client.getText("#search-api-ver")
        console.log("AAA"+_api_version)
        console.log(_container_identifier)
        console.log(_container_ver)
        console.log(_build_number)
        console.log(_search_api_ver)
        console.log(electronVersion)
        await expect( _api_version).toBe(API_VERSION);
        await expect( _container_identifier).toBe('Electron');
        await expect( _container_ver).toBe("3.0.0");
        await expect(_build_number).toBe(buildNumber);
        await expect(_search_api_ver).toBe(SEARCH_API_VERSION);   
        done();    
        } catch (err) {
            done.fail(new Error(`get Version error: ${err}`));
        };
    });
});
