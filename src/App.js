'use strict';

import {Product} from "./Product";
import {Util} from "./Util";
import {ChromeExtension} from "./ChromeExtension";
import {Website} from "./Website";

export class App {

     constructor() {
        ChromeExtension.init();
        this.products = [];
        this.websites = {};
        this.allWebsites = {};
        this.productsDatabaseUrl = chrome.runtime.getURL("data/products.json");
        this.initProductsAndWebsites();
    }

    initProductsAndWebsites() {
         fetch(this.productsDatabaseUrl)
            .then((response) => response.json()) //assuming file contains json
            .then((json) => {
                this.products = Product.initProducts(json.products, json.categories);
                this.categories = json.categories;
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
            const website = Util.getHostName(Website.getRootWebsite(this.websites, details));
            this.process(website, webRequestUrl);
        };
        chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeRequestListener, {urls: ["<all_urls>"]});
    }

    getWebsite(websiteDomain) {
         if (!this.websites[websiteDomain]) {
             this.websites[websiteDomain] = new Website(websiteDomain);
         }
         return this.websites[websiteDomain];
    }

    process(websiteDomain, webRequestUrl) {
        this.products.forEach((product) => {
            if (product.isMatch(webRequestUrl)) {
                const website = this.getWebsite(websiteDomain);
                const productMatchAdded = website.addProductMatch(product, webRequestUrl);
                if (productMatchAdded) {
                    chrome.storage.local.set({comps: this.websites}, function () {
                        console.log('Updated components:', product.name, webRequestUrl);
                    });

                    if (product.isAbrProtocol()) {
                        website.findPackager(this.products, webRequestUrl, (packager) => {
                            chrome.storage.local.set({comps: this.websites}, function () {
                                console.log('Updated components:', product.name, "with", packager.name, "for", webRequestUrl);
                            });
                        });
                    }
                }
            }
        });
    };
}