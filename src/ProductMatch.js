export class ProductMatch {
    constructor(product) {
        this.product = product;
        this.urls = [];
        this.maxNbOfUrlsAllowed = 5;
    }
    addUrl(url) {
        if (!this.isMaxNbOfUrlsAllowed()) {
            this.urls.push(url);
            return true;
        } else {
            return false;
        }
    }
    isMaxNbOfUrlsAllowed() {
        return (this.urls.length > this.maxNbOfUrlsAllowed);
    }

}