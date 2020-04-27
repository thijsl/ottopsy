'use strict';

import {Product} from "./Product";
import {Util} from "./Util";
import {ChromeExtension} from "./ChromeExtension";

export class App {

     constructor() {
        ChromeExtension.init();
        this.initiators = {};
        this.allInitiators = {};
        this.productsDatabaseUrl = chrome.runtime.getURL("data/patterns.json");
        this.initProductsAndInitializers();
    }

    initProductsAndInitializers() {
         fetch(this.productsDatabaseUrl)
            .then((response) => response.json()) //assuming file contains json
            .then((json) => {
                this.products = Product.initProducts(json);
                this.initInitializerListeners();
            });
    }

    initInitializerListeners() {
        let onBeforeRequestListener = (details) => {
            let url = details.url;
            this.allInitiators[details.frameId] = {
                initiator: details.initiator,
                parentFrameId: details.parentFrameId
            };
            this.process(Util.getHostName(this.getRootInitiator(details)), url);
        };
        chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeRequestListener, {urls: ["<all_urls>"]});
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