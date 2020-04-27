// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                //pageUrl: {hostEquals: '*.*.*'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

var initiators = {};

var allInitiators = {

};

function getRootInitiator(details) {
  let currentParentId = details.parentFrameId;
  let currentInitiator = details.initiator;
  while (currentParentId != -1) {
    details = allInitiators[currentParentId];
    if (details) {
      currentParentId = details.parentFrameId;
      currentInitiator = details.initiator;
    } else {
      console.warn("details is undefined at", currentParentId, allInitiators);
      currentParentId = -1;
    }
  }
  return currentInitiator;
}

let onBeforeRequestListener = function (details) {
    let url = details.url;
    allInitiators[details.frameId] = {
        initiator: details.initiator,
        parentFrameId: details.parentFrameId
    };
    process(getHostName(getRootInitiator(details)), url);
};

function createInitiatorIfNeeded(initiators, initiator, product) {
    if (!initiators[initiator]) {
        initiators[initiator] = {};
    }
    if (!initiators[initiator][product.category]) {
        initiators[initiator][product.category] = {};
    }
    if (!initiators[initiator][product.category][product.name]) {
        initiators[initiator][product.category][product.name] = {status: 'unknown', url: []};
    }
}

function isUrlNotYetAdded(initiators, initiator, product, url) {
    return (initiators[initiator][product.category][product.name].url.indexOf(url) < 0);
}

let process = function (initiator, url) {
    products.forEach((product) => {
        if (product.isMatch(url)) {
            createInitiatorIfNeeded(initiators, initiator, product);
            initiators[initiator][product.category][product.name].status = true;
            if (isUrlNotYetAdded(initiators, initiator, product, url)) {
                if (initiators[initiator][product.category][product.name].url.length < 10) {
                    initiators[initiator][product.category][product.name].url.push(url);
                    chrome.storage.local.set({comps: initiators}, function () {
                        console.log('Updated components:', product.name, url);
                    });
                }

                if (product.name == "dash" || product.name == "hls") {
                    fetch(url)
                        .then(function (response) {
                            return response.text();
                        })
                        .then(function (text) {
                            const packagers = Product.getProductsByCategory(products, "packager");
                            packagers.forEach((packager) => {
                               const packagerMatch = packager.isMatch(text);
                               if (packagerMatch) {
                                   if (!initiators[initiator].packager) {
                                       initiators[initiator].packager = {};
                                   }
                                   initiators[initiator].packager[[packager.name]] = {"status": true};
                                   chrome.storage.local.set({comps: initiators}, function () {
                                       console.log('Updated components:', product.name, "with", packager.name, "for", url);
                                   });
                               }
                            });
                        });
                }

            }
        }
    });

};

class Product {
    constructor(product, category) {
        this.name = product.name;
        this.patterns = product.patterns;
        this.category = category;
    }
    isMatch(url) {
        let match = false;
        for (let i = 0; (i < this.patterns.length) && !match; i++) {
            match = (url.indexOf(this.patterns[i].key) > -1);
        }
        return match;
    }
    static initProducts(products, json) {
        for (let i = 0; i < json.length; i++) {
            const component = json[i];
            const componentTypes = component.types;
            for (let j = 0; j < componentTypes.length; j++) {
                const componentType = componentTypes[j];
                let product = new Product(componentType, component.name);
                products.push(product);
            }
        }
        return products;
    }
    static getProductsByCategory(products, category) {
        return products.filter((product) => {return (product.category == category)})
    }
}

const url = chrome.runtime.getURL('data/patterns.json');
const products = [];

fetch(url)
    .then((response) => response.json()) //assuming file contains json
    .then(function (json) {
        Product.initProducts(products, json);
        chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeRequestListener, {urls: ["<all_urls>"]});
    });


function getHostName(href) {
    var l = document.createElement("a");
    l.href = href;
    return l.hostname;
}
