// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js

'use strict';

promise_test(async t => {
  await test_driver.set_permission({name: 'compute-pressure'}, 'granted');

  const changes1_promise = new Promise(resolve => {
    const observer = new PressureObserver(resolve, {sampleRate: 1.0});
    t.add_cleanup(() => observer.disconnect());
    observer.observe('cpu');
  });

  const changes2_promise = new Promise(resolve => {
    const observer = new PressureObserver(resolve, {sampleRate: 1.0});
    t.add_cleanup(() => observer.disconnect());
    observer.observe('cpu');
  });

  const changes3_promise = new Promise(resolve => {
    const observer = new PressureObserver(resolve, {sampleRate: 1.0});
    t.add_cleanup(() => observer.disconnect());
    observer.observe('cpu');
  });

  const [changes1, changes2, changes3] =
      await Promise.all([changes1_promise, changes2_promise, changes3_promise]);

  for (const changes of [changes1, changes2, changes3]) {
    assert_in_array(
        changes[0].state, ['nominal', 'fair', 'serious', 'critical'],
        'cpu pressure state');
  }
}, 'Three PressureObserver instances receive changes');
