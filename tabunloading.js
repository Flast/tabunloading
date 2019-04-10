// Copyright 2018,2019 Kohei Takahshi
//
// This software is released under the MIT License, see LICENSE.txt.

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
