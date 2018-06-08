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

function unloadSingleTab(menuitem, tab) {
  if (tab.active) {
    console.log("Unable to unload active tab");
    return;
  }

  browser.tabs.discard(tab.id).then(() => {
    console.log(`unloaded: ${tab.title}`);
  }, onError);
}

// TODO: Recognize tree-style tab addon.
browser.menus.create({
  title: browser.i18n.getMessage("unloadSingleTab"),
  contexts: ["tab"],
  onclick: unloadSingleTab
}, onCreated);
