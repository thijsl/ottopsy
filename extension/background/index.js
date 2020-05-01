/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/webpack-index/background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/App.js":
/*!********************!*\
  !*** ./src/App.js ***!
  \********************/
/*! exports provided: App */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "App", function() { return App; });
/* harmony import */ var _Product__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Product */ "./src/Product.js");
/* harmony import */ var _Util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Util */ "./src/Util.js");
/* harmony import */ var _ChromeExtension__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ChromeExtension */ "./src/ChromeExtension.js");
/* harmony import */ var _Website__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Website */ "./src/Website.js");







class App {

     constructor() {
        _ChromeExtension__WEBPACK_IMPORTED_MODULE_2__["ChromeExtension"].init();
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
                this.products = _Product__WEBPACK_IMPORTED_MODULE_0__["Product"].initProducts(json.products, json.categories);
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
            const website = _Util__WEBPACK_IMPORTED_MODULE_1__["Util"].getHostName(_Website__WEBPACK_IMPORTED_MODULE_3__["Website"].getRootWebsite(this.websites, details));
            this.process(website, webRequestUrl);
        };
        chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeRequestListener, {urls: ["<all_urls>"]});
    }

    getWebsite(websiteDomain) {
         if (!this.websites[websiteDomain]) {
             this.websites[websiteDomain] = new _Website__WEBPACK_IMPORTED_MODULE_3__["Website"](websiteDomain);
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

                    let responseBodyProducts = product.getResponseBodyProducts(this.products);
                    if (responseBodyProducts) {
                        website.checkResponse(responseBodyProducts, webRequestUrl, (packager) => {
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

/***/ }),

/***/ "./src/ChromeExtension.js":
/*!********************************!*\
  !*** ./src/ChromeExtension.js ***!
  \********************************/
/*! exports provided: ChromeExtension */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChromeExtension", function() { return ChromeExtension; });
class ChromeExtension {

    static init() {
        chrome.runtime.onInstalled.addListener(function () {
            chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
                chrome.declarativeContent.onPageChanged.addRules([{
                    conditions: [new chrome.declarativeContent.PageStateMatcher({
                        //pageUrl: {hostEquals: '*.*.*'},
                    })],
                    actions: [new chrome.declarativeContent.ShowPageAction()]
                }]);
            });
        });
    }

}

/***/ }),

/***/ "./src/Product.js":
/*!************************!*\
  !*** ./src/Product.js ***!
  \************************/
/*! exports provided: Product */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Product", function() { return Product; });
class Product {
    constructor(product, categories) {
        this.id = product.id;
        this.name = product.name;
        this.patterns = product.patterns;
        this.categoryId = product.categoryId;
        this.category = Product.getCategoryById(this.categoryId, categories);
        this.disabled = product.disabled;
        this.checkResponseWithOtherProductIds = product.checkResponseWithOtherProductIds;
    }
    isMatch(url) {
        let match = false;
        const networkPatterns = this.patterns.network;
        for (let i = 0; networkPatterns && (i < networkPatterns.length) && !match; i++) {
            match = (url.indexOf(networkPatterns[i].key) > -1);
        }
        return match;
    }
    isResponseBodyMatch(url) {
        let match = false;
        const patterns = this.patterns.responseBody;
        for (let i = 0; patterns && (i < patterns.length) && !match; i++) {
            match = (url.indexOf(patterns[i].key) > -1);
        }
        return match;
    }
    getResponseBodyProducts(products) {
        let responseBodyProducts = null;
        if (this.checkResponseWithOtherProductIds && (this.checkResponseWithOtherProductIds.length > 1)) {
            responseBodyProducts = [];
            for (let i = 0; i < products.length; i++) {
                if (this.checkResponseWithOtherProductIds.indexOf(products[i].id) > -1) {
                    responseBodyProducts.push(products[i]);
                }
            }
        }
        return responseBodyProducts;
    }
    static getCategoryById(categoryId, categories) {
        let category = "not-found";
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id == categoryId) {
                return categories[i].name;
            }
        }
        return category;
    }
    static initProducts(productsJson, categoriesJson) {
        const products = [];
        for (let i = 0; i < productsJson.length; i++) {
            const productJson = productsJson[i];
            let product = new Product(productJson, categoriesJson);
            if (!product.disabled) {
                products.push(product);
            }
        }
        return products;
    }
}

/***/ }),

/***/ "./src/ProductMatch.js":
/*!*****************************!*\
  !*** ./src/ProductMatch.js ***!
  \*****************************/
/*! exports provided: ProductMatch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProductMatch", function() { return ProductMatch; });
class ProductMatch {
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

/***/ }),

/***/ "./src/Util.js":
/*!*********************!*\
  !*** ./src/Util.js ***!
  \*********************/
/*! exports provided: Util */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Util", function() { return Util; });
class Util {
    static getHostName(href) {
        const l = document.createElement("a");
        l.href = href;
        return l.hostname;
    }
}

/***/ }),

/***/ "./src/Website.js":
/*!************************!*\
  !*** ./src/Website.js ***!
  \************************/
/*! exports provided: Website */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Website", function() { return Website; });
/* harmony import */ var _ProductMatch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProductMatch */ "./src/ProductMatch.js");


class Website {

    constructor(domain) {
        this.domain = domain;
        this.productMatches = {};
    }

    getProductMatch(product) {
        if (!this.productMatches[product.name]) {
            this.productMatches[product.name] = new _ProductMatch__WEBPACK_IMPORTED_MODULE_0__["ProductMatch"](product);
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

/***/ }),

/***/ "./src/webpack-index/background.js":
/*!*****************************************!*\
  !*** ./src/webpack-index/background.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../App */ "./src/App.js");

const app = new _App__WEBPACK_IMPORTED_MODULE_0__["App"]();

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ2hyb21lRXh0ZW5zaW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9Qcm9kdWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9Qcm9kdWN0TWF0Y2guanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dlYnNpdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3dlYnBhY2staW5kZXgvYmFja2dyb3VuZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFhOztBQUVxQjtBQUNOO0FBQ3NCO0FBQ2hCOztBQUUzQjs7QUFFUDtBQUNBLFFBQVEsZ0VBQWU7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLGdEQUFPO0FBQ3ZDO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsMENBQUksYUFBYSxnREFBTztBQUNwRDtBQUNBO0FBQ0Esb0ZBQW9GLHFCQUFxQjtBQUN6Rzs7QUFFQTtBQUNBO0FBQ0EsZ0RBQWdELGdEQUFPO0FBQ3ZEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMscUJBQXFCO0FBQ25FO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0E7QUFDQSxzREFBc0QscUJBQXFCO0FBQzNFO0FBQ0EsNkJBQTZCO0FBQzdCLHlCQUF5Qjs7QUFFekI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDdkVBO0FBQUE7QUFBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLG9CQUFvQjtBQUN4RCxxQkFBcUI7QUFDckI7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDs7QUFFQSxDOzs7Ozs7Ozs7Ozs7QUNmQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsMkRBQTJEO0FBQ2xGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLDZDQUE2QztBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHFCQUFxQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsdUJBQXVCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIseUJBQXlCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7QUMxREE7QUFBQTtBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDOzs7Ozs7Ozs7Ozs7QUNsQkE7QUFBQTtBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7OztBQ05BO0FBQUE7QUFBQTtBQUE0Qzs7QUFFckM7O0FBRVA7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9EQUFvRCwwREFBWTtBQUNoRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDOzs7Ozs7Ozs7Ozs7QUNwREE7QUFBQTtBQUEyQjtBQUMzQixnQkFBZ0Isd0NBQUcsRyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3dlYnBhY2staW5kZXgvYmFja2dyb3VuZC5qc1wiKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtQcm9kdWN0fSBmcm9tIFwiLi9Qcm9kdWN0XCI7XG5pbXBvcnQge1V0aWx9IGZyb20gXCIuL1V0aWxcIjtcbmltcG9ydCB7Q2hyb21lRXh0ZW5zaW9ufSBmcm9tIFwiLi9DaHJvbWVFeHRlbnNpb25cIjtcbmltcG9ydCB7V2Vic2l0ZX0gZnJvbSBcIi4vV2Vic2l0ZVwiO1xuXG5leHBvcnQgY2xhc3MgQXBwIHtcblxuICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgQ2hyb21lRXh0ZW5zaW9uLmluaXQoKTtcbiAgICAgICAgdGhpcy5wcm9kdWN0cyA9IFtdO1xuICAgICAgICB0aGlzLndlYnNpdGVzID0ge307XG4gICAgICAgIHRoaXMuYWxsV2Vic2l0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5wcm9kdWN0c0RhdGFiYXNlVXJsID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwiZGF0YS9wcm9kdWN0cy5qc29uXCIpO1xuICAgICAgICB0aGlzLmluaXRQcm9kdWN0c0FuZFdlYnNpdGVzKCk7XG4gICAgfVxuXG4gICAgaW5pdFByb2R1Y3RzQW5kV2Vic2l0ZXMoKSB7XG4gICAgICAgICBmZXRjaCh0aGlzLnByb2R1Y3RzRGF0YWJhc2VVcmwpXG4gICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSkgLy9hc3N1bWluZyBmaWxlIGNvbnRhaW5zIGpzb25cbiAgICAgICAgICAgIC50aGVuKChqc29uKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9kdWN0cyA9IFByb2R1Y3QuaW5pdFByb2R1Y3RzKGpzb24ucHJvZHVjdHMsIGpzb24uY2F0ZWdvcmllcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXRlZ29yaWVzID0ganNvbi5jYXRlZ29yaWVzO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFdlYnNpdGVSZXF1ZXN0TGlzdGVuZXJzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0V2Vic2l0ZVJlcXVlc3RMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBvbkJlZm9yZVJlcXVlc3RMaXN0ZW5lciA9IChkZXRhaWxzKSA9PiB7XG4gICAgICAgICAgICBsZXQgd2ViUmVxdWVzdFVybCA9IGRldGFpbHMudXJsO1xuICAgICAgICAgICAgdGhpcy5hbGxXZWJzaXRlc1tkZXRhaWxzLmZyYW1lSWRdID0ge1xuICAgICAgICAgICAgICAgIGluaXRpYXRvcjogZGV0YWlscy5pbml0aWF0b3IsXG4gICAgICAgICAgICAgICAgcGFyZW50RnJhbWVJZDogZGV0YWlscy5wYXJlbnRGcmFtZUlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3Qgd2Vic2l0ZSA9IFV0aWwuZ2V0SG9zdE5hbWUoV2Vic2l0ZS5nZXRSb290V2Vic2l0ZSh0aGlzLndlYnNpdGVzLCBkZXRhaWxzKSk7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3Mod2Vic2l0ZSwgd2ViUmVxdWVzdFVybCk7XG4gICAgICAgIH07XG4gICAgICAgIGNocm9tZS53ZWJSZXF1ZXN0Lm9uQmVmb3JlU2VuZEhlYWRlcnMuYWRkTGlzdGVuZXIob25CZWZvcmVSZXF1ZXN0TGlzdGVuZXIsIHt1cmxzOiBbXCI8YWxsX3VybHM+XCJdfSk7XG4gICAgfVxuXG4gICAgZ2V0V2Vic2l0ZSh3ZWJzaXRlRG9tYWluKSB7XG4gICAgICAgICBpZiAoIXRoaXMud2Vic2l0ZXNbd2Vic2l0ZURvbWFpbl0pIHtcbiAgICAgICAgICAgICB0aGlzLndlYnNpdGVzW3dlYnNpdGVEb21haW5dID0gbmV3IFdlYnNpdGUod2Vic2l0ZURvbWFpbik7XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gdGhpcy53ZWJzaXRlc1t3ZWJzaXRlRG9tYWluXTtcbiAgICB9XG5cbiAgICBwcm9jZXNzKHdlYnNpdGVEb21haW4sIHdlYlJlcXVlc3RVcmwpIHtcbiAgICAgICAgdGhpcy5wcm9kdWN0cy5mb3JFYWNoKChwcm9kdWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAocHJvZHVjdC5pc01hdGNoKHdlYlJlcXVlc3RVcmwpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2Vic2l0ZSA9IHRoaXMuZ2V0V2Vic2l0ZSh3ZWJzaXRlRG9tYWluKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWN0TWF0Y2hBZGRlZCA9IHdlYnNpdGUuYWRkUHJvZHVjdE1hdGNoKHByb2R1Y3QsIHdlYlJlcXVlc3RVcmwpO1xuICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0TWF0Y2hBZGRlZCkge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe2NvbXBzOiB0aGlzLndlYnNpdGVzfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1VwZGF0ZWQgY29tcG9uZW50czonLCBwcm9kdWN0Lm5hbWUsIHdlYlJlcXVlc3RVcmwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VCb2R5UHJvZHVjdHMgPSBwcm9kdWN0LmdldFJlc3BvbnNlQm9keVByb2R1Y3RzKHRoaXMucHJvZHVjdHMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VCb2R5UHJvZHVjdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYnNpdGUuY2hlY2tSZXNwb25zZShyZXNwb25zZUJvZHlQcm9kdWN0cywgd2ViUmVxdWVzdFVybCwgKHBhY2thZ2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtjb21wczogdGhpcy53ZWJzaXRlc30sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1VwZGF0ZWQgY29tcG9uZW50czonLCBwcm9kdWN0Lm5hbWUsIFwid2l0aFwiLCBwYWNrYWdlci5uYW1lLCBcImZvclwiLCB3ZWJSZXF1ZXN0VXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG59IiwiZXhwb3J0IGNsYXNzIENocm9tZUV4dGVuc2lvbiB7XG5cbiAgICBzdGF0aWMgaW5pdCgpIHtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5vblBhZ2VDaGFuZ2VkLnJlbW92ZVJ1bGVzKHVuZGVmaW5lZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQub25QYWdlQ2hhbmdlZC5hZGRSdWxlcyhbe1xuICAgICAgICAgICAgICAgICAgICBjb25kaXRpb25zOiBbbmV3IGNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQuUGFnZVN0YXRlTWF0Y2hlcih7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3BhZ2VVcmw6IHtob3N0RXF1YWxzOiAnKi4qLionfSxcbiAgICAgICAgICAgICAgICAgICAgfSldLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBbbmV3IGNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQuU2hvd1BhZ2VBY3Rpb24oKV1cbiAgICAgICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIFByb2R1Y3Qge1xuICAgIGNvbnN0cnVjdG9yKHByb2R1Y3QsIGNhdGVnb3JpZXMpIHtcbiAgICAgICAgdGhpcy5pZCA9IHByb2R1Y3QuaWQ7XG4gICAgICAgIHRoaXMubmFtZSA9IHByb2R1Y3QubmFtZTtcbiAgICAgICAgdGhpcy5wYXR0ZXJucyA9IHByb2R1Y3QucGF0dGVybnM7XG4gICAgICAgIHRoaXMuY2F0ZWdvcnlJZCA9IHByb2R1Y3QuY2F0ZWdvcnlJZDtcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IFByb2R1Y3QuZ2V0Q2F0ZWdvcnlCeUlkKHRoaXMuY2F0ZWdvcnlJZCwgY2F0ZWdvcmllcyk7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBwcm9kdWN0LmRpc2FibGVkO1xuICAgICAgICB0aGlzLmNoZWNrUmVzcG9uc2VXaXRoT3RoZXJQcm9kdWN0SWRzID0gcHJvZHVjdC5jaGVja1Jlc3BvbnNlV2l0aE90aGVyUHJvZHVjdElkcztcbiAgICB9XG4gICAgaXNNYXRjaCh1cmwpIHtcbiAgICAgICAgbGV0IG1hdGNoID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IG5ldHdvcmtQYXR0ZXJucyA9IHRoaXMucGF0dGVybnMubmV0d29yaztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IG5ldHdvcmtQYXR0ZXJucyAmJiAoaSA8IG5ldHdvcmtQYXR0ZXJucy5sZW5ndGgpICYmICFtYXRjaDsgaSsrKSB7XG4gICAgICAgICAgICBtYXRjaCA9ICh1cmwuaW5kZXhPZihuZXR3b3JrUGF0dGVybnNbaV0ua2V5KSA+IC0xKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfVxuICAgIGlzUmVzcG9uc2VCb2R5TWF0Y2godXJsKSB7XG4gICAgICAgIGxldCBtYXRjaCA9IGZhbHNlO1xuICAgICAgICBjb25zdCBwYXR0ZXJucyA9IHRoaXMucGF0dGVybnMucmVzcG9uc2VCb2R5O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgcGF0dGVybnMgJiYgKGkgPCBwYXR0ZXJucy5sZW5ndGgpICYmICFtYXRjaDsgaSsrKSB7XG4gICAgICAgICAgICBtYXRjaCA9ICh1cmwuaW5kZXhPZihwYXR0ZXJuc1tpXS5rZXkpID4gLTEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9XG4gICAgZ2V0UmVzcG9uc2VCb2R5UHJvZHVjdHMocHJvZHVjdHMpIHtcbiAgICAgICAgbGV0IHJlc3BvbnNlQm9keVByb2R1Y3RzID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tSZXNwb25zZVdpdGhPdGhlclByb2R1Y3RJZHMgJiYgKHRoaXMuY2hlY2tSZXNwb25zZVdpdGhPdGhlclByb2R1Y3RJZHMubGVuZ3RoID4gMSkpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlQm9keVByb2R1Y3RzID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2R1Y3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tSZXNwb25zZVdpdGhPdGhlclByb2R1Y3RJZHMuaW5kZXhPZihwcm9kdWN0c1tpXS5pZCkgPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZUJvZHlQcm9kdWN0cy5wdXNoKHByb2R1Y3RzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlQm9keVByb2R1Y3RzO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0Q2F0ZWdvcnlCeUlkKGNhdGVnb3J5SWQsIGNhdGVnb3JpZXMpIHtcbiAgICAgICAgbGV0IGNhdGVnb3J5ID0gXCJub3QtZm91bmRcIjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXRlZ29yaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY2F0ZWdvcmllc1tpXS5pZCA9PSBjYXRlZ29yeUlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhdGVnb3JpZXNbaV0ubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2F0ZWdvcnk7XG4gICAgfVxuICAgIHN0YXRpYyBpbml0UHJvZHVjdHMocHJvZHVjdHNKc29uLCBjYXRlZ29yaWVzSnNvbikge1xuICAgICAgICBjb25zdCBwcm9kdWN0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb2R1Y3RzSnNvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcHJvZHVjdEpzb24gPSBwcm9kdWN0c0pzb25baV07XG4gICAgICAgICAgICBsZXQgcHJvZHVjdCA9IG5ldyBQcm9kdWN0KHByb2R1Y3RKc29uLCBjYXRlZ29yaWVzSnNvbik7XG4gICAgICAgICAgICBpZiAoIXByb2R1Y3QuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHByb2R1Y3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9kdWN0cztcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIFByb2R1Y3RNYXRjaCB7XG4gICAgY29uc3RydWN0b3IocHJvZHVjdCkge1xuICAgICAgICB0aGlzLnByb2R1Y3QgPSBwcm9kdWN0O1xuICAgICAgICB0aGlzLnVybHMgPSBbXTtcbiAgICAgICAgdGhpcy5tYXhOYk9mVXJsc0FsbG93ZWQgPSA1O1xuICAgIH1cbiAgICBhZGRVcmwodXJsKSB7XG4gICAgICAgIGlmICghdGhpcy5pc01heE5iT2ZVcmxzQWxsb3dlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnVybHMucHVzaCh1cmwpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaXNNYXhOYk9mVXJsc0FsbG93ZWQoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy51cmxzLmxlbmd0aCA+IHRoaXMubWF4TmJPZlVybHNBbGxvd2VkKTtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgVXRpbCB7XG4gICAgc3RhdGljIGdldEhvc3ROYW1lKGhyZWYpIHtcbiAgICAgICAgY29uc3QgbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBsLmhyZWYgPSBocmVmO1xuICAgICAgICByZXR1cm4gbC5ob3N0bmFtZTtcbiAgICB9XG59IiwiaW1wb3J0IHtQcm9kdWN0TWF0Y2h9IGZyb20gXCIuL1Byb2R1Y3RNYXRjaFwiO1xuXG5leHBvcnQgY2xhc3MgV2Vic2l0ZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihkb21haW4pIHtcbiAgICAgICAgdGhpcy5kb21haW4gPSBkb21haW47XG4gICAgICAgIHRoaXMucHJvZHVjdE1hdGNoZXMgPSB7fTtcbiAgICB9XG5cbiAgICBnZXRQcm9kdWN0TWF0Y2gocHJvZHVjdCkge1xuICAgICAgICBpZiAoIXRoaXMucHJvZHVjdE1hdGNoZXNbcHJvZHVjdC5uYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5wcm9kdWN0TWF0Y2hlc1twcm9kdWN0Lm5hbWVdID0gbmV3IFByb2R1Y3RNYXRjaChwcm9kdWN0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wcm9kdWN0TWF0Y2hlc1twcm9kdWN0Lm5hbWVdO1xuICAgIH1cblxuICAgIGFkZFByb2R1Y3RNYXRjaChwcm9kdWN0LCB3ZWJSZXF1ZXN0VXJsKSB7XG4gICAgICAgIGNvbnN0IHByb2R1Y3RNYXRjaCA9IHRoaXMuZ2V0UHJvZHVjdE1hdGNoKHByb2R1Y3QpO1xuICAgICAgICByZXR1cm4gcHJvZHVjdE1hdGNoLmFkZFVybCh3ZWJSZXF1ZXN0VXJsKTtcbiAgICB9XG5cbiAgICBjaGVja1Jlc3BvbnNlKHByb2R1Y3RzLCB3ZWJSZXF1ZXN0VXJsLCBjYikge1xuICAgICAgICBmZXRjaCh3ZWJSZXF1ZXN0VXJsKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgIHByb2R1Y3RzLmZvckVhY2goKHByb2R1Y3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFja2FnZXJNYXRjaCA9IHByb2R1Y3QuaXNSZXNwb25zZUJvZHlNYXRjaCh0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhY2thZ2VyTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkUHJvZHVjdE1hdGNoKHByb2R1Y3QsIHdlYlJlcXVlc3RVcmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2IocHJvZHVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRSb290V2Vic2l0ZSh3ZWJzaXRlcywgZGV0YWlscykge1xuICAgICAgICBsZXQgY3VycmVudFBhcmVudElkID0gZGV0YWlscy5wYXJlbnRGcmFtZUlkO1xuICAgICAgICBsZXQgY3VycmVudEluaXRpYXRvciA9IGRldGFpbHMuaW5pdGlhdG9yO1xuICAgICAgICB3aGlsZSAoY3VycmVudFBhcmVudElkICE9IC0xKSB7XG4gICAgICAgICAgICBkZXRhaWxzID0gd2Vic2l0ZXNbY3VycmVudFBhcmVudElkXTtcbiAgICAgICAgICAgIGlmIChkZXRhaWxzKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFBhcmVudElkID0gZGV0YWlscy5wYXJlbnRGcmFtZUlkO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRJbml0aWF0b3IgPSBkZXRhaWxzLmluaXRpYXRvcjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFBhcmVudElkID0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1cnJlbnRJbml0aWF0b3I7XG4gICAgfVxuXG59IiwiaW1wb3J0IHtBcHB9IGZyb20gXCIuLi9BcHBcIjtcbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTsiXSwic291cmNlUm9vdCI6IiJ9