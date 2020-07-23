const test = require('ava');
const fetch = require('node-fetch');
const withPage = require('./utils/_withPage');

const BASE_API_URL = 'http://packages.exokit.org/';
const TEST_PACKAGE_NAME = 'blob';

test('test passes if icon exists', withPage, async (t, page) => {
    const TEST_ICON_HASH = 'QmPufMhjmvso9dt5gcQP77imeSy25VGhp4d5mnaTjRtNEE';

    await page.goto(process.env.STATIC_URL);
    const packageRes = await fetch(`${BASE_API_URL}${TEST_PACKAGE_NAME}`);
    const json = await packageRes.json();
    t.true(Object.entries(json.icons.find(i => i.hash === TEST_ICON_HASH)).length > 0);
});

test('test fails if icon is not found', withPage, async (t, page) => {
    const TEST_ICON_HASH = 'QmUR8kzUWowv2iBpSJVYGwfPuFKWpd6quevA3jSJkxhFSi';

    await page.goto(process.env.STATIC_URL);
    const packageRes = await fetch(`${BASE_API_URL}${TEST_PACKAGE_NAME}`);
    const json = await packageRes.json();
    t.true(typeof json.icons.find(i => i.hash === TEST_ICON_HASH) == 'undefined');
});