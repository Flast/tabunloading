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

browser.menus.create({
  id: "unload-me",
  title: browser.i18n.getMessage("unloadSingleTab"),
  // TODO: Recognize tree-style tab addon.
  contexts: ["tab"]
}, onCreated);

function unloadSingleTab(tab) {
  if (tab.active) {
    console.log("Unable to unload active tab");
    return;
  }

  browser.tabs.discard(tab.id).then(() => {
    console.log(`unloaded: ${tab.title}`);
  }, onError);
}

browser.menus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "unload-me":
      unloadSingleTab(tab);
      break;
  }
});
