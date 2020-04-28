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
                    const packagerMatch = packager.isMatch(text);
                    if (packagerMatch) {
                        this.addProductMatch(packager, "N/A");
                        cb(packager);
                    }
                });
            });
    }

}