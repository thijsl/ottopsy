'use strict';

loadDataInPopup();

let products;
let productMatches;
let sortByProduct = true;

function loadDataInPopup() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id,
            {code: ''});
    });
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        const tab = tabs[0];
        if (tab && tab.url) {
            chrome.storage.local.get('comps', function (data) {
                const element = document.querySelector('ui-treeview');
                const result = data['comps'][getHostName(tab.url)];
                if (result) {
                    productMatches = result.productMatches;
                    products = productRepresentation(productMatches);
                    document.querySelector('#website').textContent = result.domain;
                    copyTextToClipboard(JSON.stringify(products));
                    element.display(products);
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