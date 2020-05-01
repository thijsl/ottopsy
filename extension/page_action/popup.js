'use strict';

loadDataInPopup();

let products;
let productMatches;
let sortByProduct = true;

function getProductsRenderingElement() {
    return document.querySelector('ui-treeview');
}
function updateProductsRender(products) {
    getProductsRenderingElement().display(products);
}
function getDefaultProducts() {
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

function loadDataInPopup() {
    const sortElement = document.querySelector('.sort');
    updateProductsRender(getDefaultProducts());
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: ''});
    });
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        const tab = tabs[0];
        if (tab && tab.url) {
            chrome.storage.local.get('comps', function (data) {
                document.querySelector('#website').textContent = getHostName(tab.url);
                if (data && data['comps']) {
                    const result = data['comps'][getHostName(tab.url)];
                    if (result) {
                        productMatches = result.productMatches;
                        chrome.storage.local.get('sortByProduct', function (data2) {
                            sortByProduct = data2.sortByProduct;
                            if (!sortByProduct) {
                                products = categoryRepresentation(productMatches);
                                sortElement.innerHTML = '<i class="fas fa-filter"></i> Sort by Product</span>';
                            } else {
                                products = productRepresentation(productMatches);
                                sortElement.innerHTML = '<i class="fas fa-filter"></i> Sort by Category</span>';
                            }
                            copyTextToClipboard(JSON.stringify(products));
                            updateProductsRender(products);
                        });

                    }
                }
            })
        }
    });
}

function productRepresentation(productMatches) {
    const products = {};
    for (let [key, value] of Object.entries(productMatches)) {
        products[key] = {
            category: value.product.category,
            urls: value.urls
        };
    }
    return products;
}

function getHostName(href) {
    const l = document.createElement("a");
    l.href = href;
    return l.hostname;
}

function copyTextToClipboard(text) {
    const copyFrom = document.createElement("textarea");
    copyFrom.textContent = text;
    document.body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    copyFrom.blur();
    document.body.removeChild(copyFrom);
}

function categoryRepresentation(productMatches) {
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

attachSortListener();
function attachSortListener() {
    const sortElement = document.querySelector('.sort');
    if (sortElement) {
        sortElement.addEventListener('click', function (e) {
            sortByProduct = !sortByProduct;
            chrome.storage.local.set({sortByProduct: sortByProduct});
            let products;
            if (!sortByProduct) {
                products = categoryRepresentation(productMatches);
                sortElement.innerHTML = '<i class="fas fa-filter"></i> Sort by Product</span>';
            } else {
                products = productRepresentation(productMatches);
                sortElement.innerHTML = '<i class="fas fa-filter"></i> Sort by Category</span>';
            }
            document.querySelector('ui-treeview').display(products);
        });
    }
}