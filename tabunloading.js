// Copyright 2018,2019 Kohei Takahshi
//
// This software is released under the MIT License, see LICENSE.txt.

// Initialize tree style tab
const TST_ID = 'treestyletab@piro.sakura.ne.jp';

async function registerToTST() {
  await browser.runtime.sendMessage(TST_ID, {
    type: 'register-self',
    name: browser.i18n.getMessage('extensionName'),
    icons: browser.runtime.getManifest().icons,
    listeningTypes: ['ready'],
  });

  return function(request) {
    return browser.runtime.sendMessage(TST_ID, request);
  };
}
let TST_sendMessage = registerToTST();

browser.runtime.onMessageExternal.addListener((message, sender) => {
  switch (sender.id) {
    case TST_ID:
      switch (message.type) {
        case 'ready':
          TST_sendMessage = registerToTST();
          onTSTReady();
          break;
      }
      break;
  }
});

function onTSTReady() {
  TST_sendMessage.then((send) => {
    return send({type: 'wait-for-shutdown'});
  }).finally(() => {
    TST_sendMessage = new Promise(() => { throw 'Unloaded'; });
    onTSTShutdown();
  });

  browser.menus.update(menu_unloadTreeTST, {visible: true});
}

function onTSTShutdown() {
  browser.menus.update(menu_unloadTreeTST, {visible: false});
}


function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  }
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function discard(tabs) {
  browser.tabs.discard(tabs.map(t => t.id)).then(() => {
    for (tab of tabs) {
      console.log(`unloaded: ${tab.title}`);
    }
  }, onError);
}

function unloadSingleTab(menuitem, tab) {
  if (tab.active) {
    console.log("Unable to unload active tab");
    return;
  }
  if (tab.discarded) {
    return;
  }

  discard([tab]);
}

function unloadAllTabsInWindow(menuitem, tab) {
  browser.windows.get(tab.windowId, {populate: true}).then((windowInfo) => {
    discard(windowInfo.tabs.filter(t => !t.discarded && !t.active));
  }, onError);
}

browser.menus.create({
  title: browser.i18n.getMessage("unloadSingleTab"),
  contexts: ["tab"],
  onclick: unloadSingleTab
}, onCreated);

browser.menus.create({
  title: browser.i18n.getMessage("unloadAllTabsInWindow"),
  contexts: ["tab"],
  onclick: unloadAllTabsInWindow
}, onCreated);

TST_sendMessage.then(onTSTReady); // This line should be last
