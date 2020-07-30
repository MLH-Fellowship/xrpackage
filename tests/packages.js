const test = require('ava');
const fetch = require('node-fetch');

const withPage = require('./utils/_withPage');
const { testBeforeHook, testAfterHook } = require('./utils/_testHelpers');
const BASE_API_URL = 'http://packages.exokit.org/';
const BASE_USER_URL = 'https://users.exokit.org/';
const BASE_EDIT_URL = 'https://xrpackage.org/edit.html';
const USERNAME = 'bonia-egruna';
const TEST_PACKAGE_NAME = 'blob';

test.before(testBeforeHook);

test('adds a package to user\'s inventory', async t => {
    const packageRes = await fetch(`${BASE_API_URL}${TEST_PACKAGE_NAME}`);
    const packageObj = await packageRes.json();
    const userRes = await fetch(`${BASE_USER_URL}${USERNAME}`);
    const userObj = await userRes.json();
    const inventorySizeBefore = userObj.inventory.length;

    userObj.inventory.push({
        name: packageObj.name,
        dataHash: packageObj.dataHash,
        iconHash: packageObj.icons.find(i => i.type === 'image/gif').hash,
    });

    const setRes = await fetch(`${BASE_USER_URL}${USERNAME}`, {
        method: 'PUT',
        body: JSON.stringify(userObj),
    });

    t.true(await setRes.status === 200);
    t.true(userObj.inventory.length === inventorySizeBefore + 1);
});

test('removes a package to user\'s inventory', async t => {
    const packageRes = await fetch(`${BASE_API_URL}${TEST_PACKAGE_NAME}`);
    const packageObj = await packageRes.json();
    const userRes = await fetch(`${BASE_USER_URL}${USERNAME}`);
    const userObj = await userRes.json();
    const inventorySizeBefore = userObj.inventory.length;

    userObj.inventory = userObj.inventory.filter(item => {
        return item.name !== packageObj.name;
    });

    const setRes = await fetch(`${BASE_USER_URL}${USERNAME}`, {
        method: 'PUT',
        body: JSON.stringify(userObj),
    });

    t.true(await setRes.status === 200);
    t.true(userObj.inventory.length === inventorySizeBefore - 1);
});

test('removes a package to user\'s inventory', async t => {
    const packageRes = await fetch(`${BASE_API_URL}${TEST_PACKAGE_NAME}`);
    const packageObj = await packageRes.json();
    const userRes = await fetch(`${BASE_USER_URL}${USERNAME}`);
    const userObj = await userRes.json();
    const inventorySizeBefore = userObj.inventory.length;

    userObj.inventory = userObj.inventory.filter(item => {
        return item.name !== packageObj.name;
    });

    const setRes = await fetch(`${BASE_USER_URL}${USERNAME}`, {
        method: 'PUT',
        body: JSON.stringify(userObj),
    });

    t.true(await setRes.status === 200);
    t.true(userObj.inventory.length === inventorySizeBefore - 1);
});

test('add package to scene', async (t, page) => {
    const response = await page.evaluate(pageFunction, `${BASE_EDIT_URL}`);
    t.falsy(response);
});

const pageFunction = async path => {
    const file = await fetch(path).then(res => res.arrayBuffer());
    const p = new XRPackage(file);
    await p.waitForLoad();
}

test.after(testAfterHook);
