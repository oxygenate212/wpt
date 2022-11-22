// META: title=RemoteContextHelper navigation using BFCache
// META: script=./test-helper.js
// META: script=/common/dispatcher/dispatcher.js
// META: script=/common/get-host-info.sub.js
// META: script=/common/utils.js
// META: script=/html/browsers/browsing-the-web/back-forward-cache/resources/rc-helper.js
// META: script=/html/browsers/browsing-the-web/remote-context-helper/resources/remote-context-helper.js
// META: script=/websockets/constants.sub.js

'use strict';

// Ensure that notRestoredReasons are only updated after non BFCache navigation.
promise_test(async t => {
  const rcHelper = new RemoteContextHelper();
  // Open a window with noopener so that BFCache will work.
  const rc1 = await rcHelper.addWindow(
      /*config=*/ null, /*options=*/ {features: 'noopener'});
  // Use WebSocket to block BFCache.
  await useWebSocket(rc1);

  var destUrl = make_absolute_url({subdomain: "www",
    path: "/common/redirect.py",
    query: "location=" + make_absolute_url(
                {path: "/navigation-timing/resources/blank_page_green.html"})
  });

  // Navigate away.
  const newRemoteContextHelper = await rc1.navigateToNew();

  // Replace the history state.
  await rc1.executeScript((destUrl) => {
    window.history.replaceState(null, '', destUrl);
  });
  // Go back.
  await newRemoteContextHelper.historyBack();

  const navigation_entry = performance.getEntriesByType("navigation")[0];
  assert_equals(navigation_entry.type,
    "navigate",
    "Expected navigation type to be navigate.");
  assert_equals(navigation_entry.redirectCount, 1, "Expected redirectCount to be 1.");
  assert_equals(navigation_entry.notRestoredReasons, undefined, "Expected notRestoredReasons is undefined.");
});
