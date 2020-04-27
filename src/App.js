'use strict';

import {Product} from "./Product";
import {Util} from "./Util";

export class App {

    constructor() {
        this.initiators = {};
        this.allInitiators = {};
        this.products = [];
    }

    init() {
        const _self = this;
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

        const url = chrome.runtime.getURL('data/patterns.json');
        const products = [];

        fetch(url)
            .then((response) => response.json()) //assuming file contains json
            .then((json) => {
                this.products = Product.initProducts(products, json);
                let onBeforeRequestListener = (details) => {
                    let url = details.url;
                    this.allInitiators[details.frameId] = {
                        initiator: details.initiator,
                        parentFrameId: details.parentFrameId
                    };
                    this.process(Util.getHostName(this.getRootInitiator(details)), url);
                };
                chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeRequestListener, {urls: ["<all_urls>"]});
            });

    }

    getRootInitiator(details) {
        let currentParentId = details.parentFrameId;
        let currentInitiator = details.initiator;
        while (currentParentId != -1) {
            details = this.allInitiators[currentParentId];
            if (details) {
                currentParentId = details.parentFrameId;
                currentInitiator = details.initiator;
            } else {
                console.warn("details is undefined at", currentParentId, this.allInitiators);
                currentParentId = -1;
            }
        }
        return currentInitiator;
    }

    createInitiatorIfNeeded(initiators, initiator, product) {
        if (!this.initiators[initiator]) {
            this.initiators[initiator] = {};
        }
        if (!this.initiators[initiator][product.category]) {
            this.initiators[initiator][product.category] = {};
        }
        if (!this.initiators[initiator][product.category][product.name]) {
            this.initiators[initiator][product.category][product.name] = {status: 'unknown', url: []};
        }
    }

    isUrlNotYetAdded(initiators, initiator, product, url) {
        return (this.initiators[initiator][product.category][product.name].url.indexOf(url) < 0);
    }

    process(initiator, url) {
        this.products.forEach((product) => {
            if (product.isMatch(url)) {
                this.createInitiatorIfNeeded(this.initiators, initiator, product);
                this.initiators[initiator][product.category][product.name].status = true;
                if (this.isUrlNotYetAdded(this.initiators, initiator, product, url)) {
                    if (this.initiators[initiator][product.category][product.name].url.length < 10) {
                        this.initiators[initiator][product.category][product.name].url.push(url);
                        chrome.storage.local.set({comps: this.initiators}, function () {
                            console.log('Updated components:', product.name, url);
                        });
                    }

                    if (product.name == "dash" || product.name == "hls") {
                        fetch(url)
                            .then((response) => {
                                return response.text();
                            })
                            .then((text) => {
                                const packagers = Product.getProductsByCategory(this.products, "packager");
                                packagers.forEach((packager) => {
                                    const packagerMatch = packager.isMatch(text);
                                    if (packagerMatch) {
                                        if (!this.initiators[initiator].packager) {
                                            this.initiators[initiator].packager = {};
                                        }
                                        this.initiators[initiator].packager[[packager.name]] = {"status": true};
                                        chrome.storage.local.set({comps: this.initiators}, function () {
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
}