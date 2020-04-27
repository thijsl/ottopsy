'use strict';

import {Product} from "./Product";
import {Util} from "./Util";
import {ChromeExtension} from "./ChromeExtension";

export class App {

     constructor() {
        ChromeExtension.init();
        this.products = [];
        this.websites = {};
        this.allWebsites = {};
        this.productsDatabaseUrl = chrome.runtime.getURL("data/patterns.json");
        this.initProductsAndWebsites();
    }

    initProductsAndWebsites() {
         fetch(this.productsDatabaseUrl)
            .then((response) => response.json()) //assuming file contains json
            .then((json) => {
                this.products = Product.initProducts(json);
                this.initWebsiteRequestListeners();
            });
    }

    initWebsiteRequestListeners() {
        let onBeforeRequestListener = (details) => {
            let webRequestUrl = details.url;
            this.allWebsites[details.frameId] = {
                initiator: details.initiator,
                parentFrameId: details.parentFrameId
            };
            const website = Util.getHostName(this.getRootWebsite(details));
            this.process(website, webRequestUrl);
        };
        chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeRequestListener, {urls: ["<all_urls>"]});
    }

    getRootWebsite(details) {
        let currentParentId = details.parentFrameId;
        let currentInitiator = details.initiator;
        while (currentParentId != -1) {
            details = this.allWebsites[currentParentId];
            if (details) {
                currentParentId = details.parentFrameId;
                currentInitiator = details.initiator;
            } else {
                console.warn("details is undefined at", currentParentId, this.allWebsites);
                currentParentId = -1;
            }
        }
        return currentInitiator;
    }

    createWebsiteIfNeeded(initiators, initiator, product) {
        if (!this.websites[initiator]) {
            this.websites[initiator] = {};
        }
        if (!this.websites[initiator][product.category]) {
            this.websites[initiator][product.category] = {};
        }
        if (!this.websites[initiator][product.category][product.name]) {
            this.websites[initiator][product.category][product.name] = {status: 'unknown', url: []};
        }
    }

    isUrlNotYetAdded(initiators, initiator, product, url) {
        return (this.websites[initiator][product.category][product.name].url.indexOf(url) < 0);
    }

    process(website, webRequestUrl) {
        this.products.forEach((product) => {
            if (product.isMatch(webRequestUrl)) {
                this.createWebsiteIfNeeded(this.websites, website, product);
                this.websites[website][product.category][product.name].status = true;
                if (this.isUrlNotYetAdded(this.websites, website, product, webRequestUrl)) {
                    if (this.websites[website][product.category][product.name].url.length < 10) {
                        this.websites[website][product.category][product.name].url.push(webRequestUrl);
                        chrome.storage.local.set({comps: this.websites}, function () {
                            console.log('Updated components:', product.name, webRequestUrl);
                        });
                    }

                    if (product.name == "dash" || product.name == "hls") {
                        fetch(webRequestUrl)
                            .then((response) => {
                                return response.text();
                            })
                            .then((text) => {
                                const packagers = Product.getProductsByCategory(this.products, "packager");
                                packagers.forEach((packager) => {
                                    const packagerMatch = packager.isMatch(text);
                                    if (packagerMatch) {
                                        if (!this.websites[website].packager) {
                                            this.websites[website].packager = {};
                                        }
                                        this.websites[website].packager[[packager.name]] = {"status": true};
                                        chrome.storage.local.set({comps: this.websites}, function () {
                                            console.log('Updated components:', product.name, "with", packager.name, "for", webRequestUrl);
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