// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js

'use strict';

promise_test(async t => {
  await test_driver.set_permission({name: 'compute-pressure'}, 'denied');

  const observer = new PressureObserver(() => {
    assert_unreached('The observer callback should not be called');
  }, {sampleRate: 1.0});

  observer.observe('cpu');

  return new Promise(resolve => t.step_timeout(resolve, 2000));
}, 'Denying compute-pressure permission should block access.');
