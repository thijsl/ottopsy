'use strict';

import {Product} from "./Product";
import {Util} from "./Util";

export class App {
    static init() {
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
            process(Util.getHostName(getRootInitiator(details)), url);
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

        const url = chrome.runtime.getURL('data/patterns.json');
        const products = [];

        fetch(url)
            .then((response) => response.json()) //assuming file contains json
            .then(function (json) {
                Product.initProducts(products, json);
                chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeRequestListener, {urls: ["<all_urls>"]});
            });

    }
}