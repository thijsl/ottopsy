import {ProductMatch} from "./ProductMatch";

export class Website {

    constructor(domain) {
        this.domain = domain;
        this.productMatches = {};
    }

    getProductMatch(product) {
        if (!this.productMatches[product.name]) {
            this.productMatches[product.name] = new ProductMatch(product);
        }
        return this.productMatches[product.name];
    }

    addProductMatch(product, webRequestUrl) {
        const productMatch = this.getProductMatch(product);
        return productMatch.addUrl(webRequestUrl);
    }

    checkResponse(products, webRequestUrl, cb) {
        fetch(webRequestUrl)
            .then((response) => {
                return response.text();
            })
            .then((text) => {
                products.forEach((product) => {
                    const packagerMatch = product.isResponseBodyMatch(text);
                    if (packagerMatch) {
                        this.addProductMatch(product, webRequestUrl);
                        cb(product);
                    }
                });
            });
    }

    static getRootWebsite(websites, details) {
        let currentParentId = details.parentFrameId;
        let currentInitiator = details.initiator;
        while (currentParentId != -1) {
            details = websites[currentParentId];
            if (details) {
                currentParentId = details.parentFrameId;
                currentInitiator = details.initiator;
            } else {
                currentParentId = -1;
            }
        }
        return currentInitiator;
    }

}