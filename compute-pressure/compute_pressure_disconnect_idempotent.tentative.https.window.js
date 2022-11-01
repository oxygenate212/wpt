// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js

'use strict';

promise_test(async t => {
  await test_driver.set_permission({name: 'compute-pressure'}, 'granted');

  const observer1_changes = [];
  const observer1 = new PressureObserver(changes => {
    observer1_changes.push(changes);
  }, {sampleRate: 1});
  t.add_cleanup(() => observer1.disconnect());
  // Ensure that observer1's schema gets registered before observer2 starts.
  observer1.observe('cpu');
  observer1.disconnect();

  const observer2_changes = [];
  await new Promise(resolve => {
    const observer2 = new PressureObserver(changes => {
      observer2_changes.push(changes);
      resolve();
    }, {sampleRate: 1});
    t.add_cleanup(() => observer2.disconnect());
    observer2.observe('cpu');
  });

  assert_equals(
      observer1_changes.length, 0,
      'stopped observers should not receive callbacks');

  assert_equals(observer2_changes.length, 1);
  assert_in_array(
      observer2_changes[0][0].state, ['nominal', 'fair', 'serious', 'critical'],
      'cpu pressure state');
}, 'Stopped PressureObserver do not receive changes');
