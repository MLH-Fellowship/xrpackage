/* global XRPackage */
const test = require('ava');

const withPageAndStaticServer = require('./utils/_withPageAndStaticServer');

test('test for memory leaks', withPageAndStaticServer, async (t, page) => {
  const response = await page.evaluate(pageFunction, `${t.context.staticUrl}/assets/baked-xrpk.wbn`);
  t.true(response);
});

const pageFunction = async (path) => {
  
};
