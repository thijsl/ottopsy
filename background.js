// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        //pageUrl: {hostEquals: '*.*.*'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

let components;

var initiators = {};

let onBeforeRequestListener = function(details) {
  let initiator = details.initiator;
  let url = details.url;
  process(getHostName(initiator), url);
};

let process = function(initiator, url) {

  for (var h = 0; h < components.length; h++) {
    let component = components[h];
    for (var i = 0; i < component.types.length; i++) {
      let type = component.types[i];
      for (var j = 0; j < type.patterns.length; j++) {
        let pattern = type.patterns[j].key;
        let match =  url.match(new RegExp(pattern, "i"));
        if (match) {
          if (!initiators[initiator]) {
            initiators[initiator] = {};
          }
          if (!initiators[initiator][component.name]) {
            initiators[initiator][component.name] = {};
          }
          if (!initiators[initiator][component.name][type.name]) {
              initiators[initiator][component.name][type.name] = {status: 'unknown', url: []};
          }
          initiators[initiator][component.name][type.name].status = true;
          if (initiators[initiator][component.name][type.name].url.indexOf(url) < 0) {
            if (initiators[initiator][component.name][type.name].url.length < 10) {
              initiators[initiator][component.name][type.name].url.push(url);
              chrome.storage.local.set({comps: initiators}, function() {
                console.log('Updated components');
              });
            } else if (type.patterns[j].weight > 0.5) {
              initiators[initiator][component.name][type.name].url.splice(-1,1);
              initiators[initiator][component.name][type.name].url = [url].concat(initiators[initiator][component.name][type.name].url)
              chrome.storage.local.set({comps: initiators}, function() {
                console.log('Updated components');
              });
            }

            if (type.name == "dash") {
              fetch(url)
                  .then(function(response) {
                    return response.text();
                  })
                  .then(function(text) {
                    let isUSP = text.match(new RegExp("Unified Streaming Platform", "i"));
                    if (isUSP) {
                      if (!initiators[initiator].packager) {
                        initiators[initiator].packager = {};
                      }
                      initiators[initiator].packager["USP"] = {"status": true};
                      chrome.storage.local.set({comps: initiators}, function() {
                        console.log('Updated components');
                      });
                    }
                  });
            }

          }




        }
      }
    }
  }

};

let onHeadersReceivedListener = function(details) {
  console.log("onHeadersReceivedListener", details);
};

let onResponseStartedListener = function(details) {
  console.log("onResponseStartedListener", details);
};

let onCompletedListener = function(details) {
  console.log("onCompletedListener", details);
};

const url = chrome.runtime.getURL('data/patterns.json');

fetch(url)
    .then((response) => response.json()) //assuming file contains json
    .then(function(json) {
      console.log("test", json);
      components = json;
      chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeRequestListener, {urls:["<all_urls>"]});
    });


function getHostName(href) {
    var l = document.createElement("a");
    l.href = href;
    return l.hostname;
}
