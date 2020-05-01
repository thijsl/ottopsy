import {ProductMatch} from "./ProductMatch";
import {Product} from "./Product";

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

    findPackager(products, webRequestUrl, cb) {
        fetch(webRequestUrl)
            .then((response) => {
                return response.text();
            })
            .then((text) => {
                const packagers = Product.getProductsByCategory(products, "packager");
                packagers.forEach((packager) => {
                    const packagerMatch = packager.isResponseBodyMatch(text);
                    if (packagerMatch) {
                        this.addProductMatch(packager, "N/A");
                        cb(packager);
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