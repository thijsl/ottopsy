'use strict';

export class Popup {

    constructor() {
        this.products = [];
        this.productMatches = [];
        this.sortByProduct = true;
        this.loadDataInPopup();
        this.attachSortListener();
    }

    getProductsRenderingElement() {
        return document.querySelector('ui-treeview');
    }
    updateProductsRender(products) {
        this.getProductsRenderingElement().display(products);
    }
    getDefaultProducts() {
        return {
            "Product matches": {
                "Amount": "0",
                "Reason": ["No patterns in products.json were recognized for this website."],
                "Tips": [
                    "Add more products and/or patterns to products.json.",
                    "Perhaps this website is not relevant to this extension?"
                ]
            }
        };
    }

    loadDataInPopup() {
        const sortElement = document.querySelector('.sort');
        this.updateProductsRender(this.getDefaultProducts());
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {code: ''});
        });
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, (tabs) => {
            const tab = tabs[0];
            if (tab && tab.url) {
                chrome.storage.local.get('comps', (data) => {
                    const hostName = this.getHostName(tab.url);
                    document.querySelector('#website').textContent = hostName;
                    if (data && data['comps']) {
                        const result = data['comps'][hostName];
                        if (result) {
                            this.productMatches = result.productMatches;
                            chrome.storage.local.get('sortByProduct', (data2) => {
                                this.sortByProduct = data2.sortByProduct;
                                if (!this.sortByProduct) {
                                    this.products = this.categoryRepresentation(this.productMatches);
                                    sortElement.innerHTML = '<i class="fas fa-filter"></i> Sort by Product</span>';
                                } else {
                                    this.products = this.productRepresentation(this.productMatches);
                                    sortElement.innerHTML = '<i class="fas fa-filter"></i> Sort by Category</span>';
                                }
                                this.copyTextToClipboard(JSON.stringify(this.products));
                                this.updateProductsRender(this.products);
                            });

                        }
                    }
                })
            }
        });
    }

    productRepresentation(productMatches) {
        const products = {};
        for (let [key, value] of Object.entries(productMatches)) {
            products[key] = {
                category: value.product.category,
                urls: value.urls
            };
        }
        return products;
    }

    getHostName(href) {
        const l = document.createElement("a");
        l.href = href;
        return l.hostname;
    }

    copyTextToClipboard(text) {
        const copyFrom = document.createElement("textarea");
        copyFrom.textContent = text;
        document.body.appendChild(copyFrom);
        copyFrom.select();
        document.execCommand('copy');
        copyFrom.blur();
        document.body.removeChild(copyFrom);
    }

    categoryRepresentation(productMatches) {
        const products = {};
        for (let [key, value] of Object.entries(productMatches)) {
            const category = value.product && value.product.category;
            if (category) {
                if (!products[category]) {
                    products[category] = {}
                }
                products[category][key] = value.urls;
            }
        }
        return products;
    }


    attachSortListener() {
        const sortElement = document.querySelector('.sort');
        if (sortElement) {
            sortElement.addEventListener('click', (e) => {
                this.sortByProduct = !this.sortByProduct;
                chrome.storage.local.set({sortByProduct: this.sortByProduct});
                let products;
                if (!this.sortByProduct) {
                    products = this.categoryRepresentation(this.productMatches);
                    sortElement.innerHTML = '<i class="fas fa-filter"></i> Sort by Product</span>';
                } else {
                    products = this.productRepresentation(this.productMatches);
                    sortElement.innerHTML = '<i class="fas fa-filter"></i> Sort by Category</span>';
                }
                document.querySelector('ui-treeview').display(products);
            });
        }
    }

}