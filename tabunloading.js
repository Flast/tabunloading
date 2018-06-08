// Copyright 2018 Kohei Takahshi
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

function discard(tab) {
  browser.tabs.discard(tab.id).then(() => {
    console.log(`unloaded: ${tab.title}`);
  }, onError);
}

function unloadSingleTab(menuitem, tab) {
  if (tab.active) {
    console.log("Unable to unload active tab");
    return;
  }

  discard(tab);
}

function unloadAllTabsInWindow(menuitem, tab) {
  browser.windows.get(tab.windowId, {populate: true}).then((windowInfo) => {
    for (tab of windowInfo.tabs) {
      if (!tab.active) {
        discard(tab);
      }
    }
  }, onError);
}

// TODO: Recognize tree-style tab addon.
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
