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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
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

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App */ "./src/App.js");

const app = new _App__WEBPACK_IMPORTED_MODULE_0__["App"]();

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ2hyb21lRXh0ZW5zaW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9Qcm9kdWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9Qcm9kdWN0TWF0Y2guanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dlYnNpdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWE7O0FBRXFCO0FBQ047QUFDc0I7QUFDaEI7O0FBRTNCOztBQUVQO0FBQ0EsUUFBUSxnRUFBZTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsZ0RBQU87QUFDdkM7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QiwwQ0FBSSxhQUFhLGdEQUFPO0FBQ3BEO0FBQ0E7QUFDQSxvRkFBb0YscUJBQXFCO0FBQ3pHOztBQUVBO0FBQ0E7QUFDQSxnREFBZ0QsZ0RBQU87QUFDdkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxxQkFBcUI7QUFDbkU7QUFDQSxxQkFBcUI7O0FBRXJCO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxxQkFBcUI7QUFDM0U7QUFDQSw2QkFBNkI7QUFDN0IseUJBQXlCOztBQUV6QjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDOzs7Ozs7Ozs7Ozs7QUN2RUE7QUFBQTtBQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msb0JBQW9CO0FBQ3hELHFCQUFxQjtBQUNyQjtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUztBQUNUOztBQUVBLEM7Ozs7Ozs7Ozs7OztBQ2ZBO0FBQUE7QUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QiwyREFBMkQ7QUFDbEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsNkNBQTZDO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIscUJBQXFCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix5QkFBeUI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7OztBQzFEQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEM7Ozs7Ozs7Ozs7OztBQ2xCQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDTkE7QUFBQTtBQUFBO0FBQTRDOztBQUVyQzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0RBQW9ELDBEQUFZO0FBQ2hFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEM7Ozs7Ozs7Ozs7OztBQ3BEQTtBQUFBO0FBQTBCO0FBQzFCLGdCQUFnQix3Q0FBRyxHIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7UHJvZHVjdH0gZnJvbSBcIi4vUHJvZHVjdFwiO1xuaW1wb3J0IHtVdGlsfSBmcm9tIFwiLi9VdGlsXCI7XG5pbXBvcnQge0Nocm9tZUV4dGVuc2lvbn0gZnJvbSBcIi4vQ2hyb21lRXh0ZW5zaW9uXCI7XG5pbXBvcnQge1dlYnNpdGV9IGZyb20gXCIuL1dlYnNpdGVcIjtcblxuZXhwb3J0IGNsYXNzIEFwcCB7XG5cbiAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIENocm9tZUV4dGVuc2lvbi5pbml0KCk7XG4gICAgICAgIHRoaXMucHJvZHVjdHMgPSBbXTtcbiAgICAgICAgdGhpcy53ZWJzaXRlcyA9IHt9O1xuICAgICAgICB0aGlzLmFsbFdlYnNpdGVzID0ge307XG4gICAgICAgIHRoaXMucHJvZHVjdHNEYXRhYmFzZVVybCA9IGNocm9tZS5ydW50aW1lLmdldFVSTChcImRhdGEvcHJvZHVjdHMuanNvblwiKTtcbiAgICAgICAgdGhpcy5pbml0UHJvZHVjdHNBbmRXZWJzaXRlcygpO1xuICAgIH1cblxuICAgIGluaXRQcm9kdWN0c0FuZFdlYnNpdGVzKCkge1xuICAgICAgICAgZmV0Y2godGhpcy5wcm9kdWN0c0RhdGFiYXNlVXJsKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpIC8vYXNzdW1pbmcgZmlsZSBjb250YWlucyBqc29uXG4gICAgICAgICAgICAudGhlbigoanNvbikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvZHVjdHMgPSBQcm9kdWN0LmluaXRQcm9kdWN0cyhqc29uLnByb2R1Y3RzLCBqc29uLmNhdGVnb3JpZXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2F0ZWdvcmllcyA9IGpzb24uY2F0ZWdvcmllcztcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRXZWJzaXRlUmVxdWVzdExpc3RlbmVycygpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFdlYnNpdGVSZXF1ZXN0TGlzdGVuZXJzKCkge1xuICAgICAgICBsZXQgb25CZWZvcmVSZXF1ZXN0TGlzdGVuZXIgPSAoZGV0YWlscykgPT4ge1xuICAgICAgICAgICAgbGV0IHdlYlJlcXVlc3RVcmwgPSBkZXRhaWxzLnVybDtcbiAgICAgICAgICAgIHRoaXMuYWxsV2Vic2l0ZXNbZGV0YWlscy5mcmFtZUlkXSA9IHtcbiAgICAgICAgICAgICAgICBpbml0aWF0b3I6IGRldGFpbHMuaW5pdGlhdG9yLFxuICAgICAgICAgICAgICAgIHBhcmVudEZyYW1lSWQ6IGRldGFpbHMucGFyZW50RnJhbWVJZFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNvbnN0IHdlYnNpdGUgPSBVdGlsLmdldEhvc3ROYW1lKFdlYnNpdGUuZ2V0Um9vdFdlYnNpdGUodGhpcy53ZWJzaXRlcywgZGV0YWlscykpO1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzKHdlYnNpdGUsIHdlYlJlcXVlc3RVcmwpO1xuICAgICAgICB9O1xuICAgICAgICBjaHJvbWUud2ViUmVxdWVzdC5vbkJlZm9yZVNlbmRIZWFkZXJzLmFkZExpc3RlbmVyKG9uQmVmb3JlUmVxdWVzdExpc3RlbmVyLCB7dXJsczogW1wiPGFsbF91cmxzPlwiXX0pO1xuICAgIH1cblxuICAgIGdldFdlYnNpdGUod2Vic2l0ZURvbWFpbikge1xuICAgICAgICAgaWYgKCF0aGlzLndlYnNpdGVzW3dlYnNpdGVEb21haW5dKSB7XG4gICAgICAgICAgICAgdGhpcy53ZWJzaXRlc1t3ZWJzaXRlRG9tYWluXSA9IG5ldyBXZWJzaXRlKHdlYnNpdGVEb21haW4pO1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuIHRoaXMud2Vic2l0ZXNbd2Vic2l0ZURvbWFpbl07XG4gICAgfVxuXG4gICAgcHJvY2Vzcyh3ZWJzaXRlRG9tYWluLCB3ZWJSZXF1ZXN0VXJsKSB7XG4gICAgICAgIHRoaXMucHJvZHVjdHMuZm9yRWFjaCgocHJvZHVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHByb2R1Y3QuaXNNYXRjaCh3ZWJSZXF1ZXN0VXJsKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdlYnNpdGUgPSB0aGlzLmdldFdlYnNpdGUod2Vic2l0ZURvbWFpbik7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvZHVjdE1hdGNoQWRkZWQgPSB3ZWJzaXRlLmFkZFByb2R1Y3RNYXRjaChwcm9kdWN0LCB3ZWJSZXF1ZXN0VXJsKTtcbiAgICAgICAgICAgICAgICBpZiAocHJvZHVjdE1hdGNoQWRkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtjb21wczogdGhpcy53ZWJzaXRlc30sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVcGRhdGVkIGNvbXBvbmVudHM6JywgcHJvZHVjdC5uYW1lLCB3ZWJSZXF1ZXN0VXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlQm9keVByb2R1Y3RzID0gcHJvZHVjdC5nZXRSZXNwb25zZUJvZHlQcm9kdWN0cyh0aGlzLnByb2R1Y3RzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlQm9keVByb2R1Y3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJzaXRlLmNoZWNrUmVzcG9uc2UocmVzcG9uc2VCb2R5UHJvZHVjdHMsIHdlYlJlcXVlc3RVcmwsIChwYWNrYWdlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7Y29tcHM6IHRoaXMud2Vic2l0ZXN9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVcGRhdGVkIGNvbXBvbmVudHM6JywgcHJvZHVjdC5uYW1lLCBcIndpdGhcIiwgcGFja2FnZXIubmFtZSwgXCJmb3JcIiwgd2ViUmVxdWVzdFVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xufSIsImV4cG9ydCBjbGFzcyBDaHJvbWVFeHRlbnNpb24ge1xuXG4gICAgc3RhdGljIGluaXQoKSB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQub25QYWdlQ2hhbmdlZC5yZW1vdmVSdWxlcyh1bmRlZmluZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50Lm9uUGFnZUNoYW5nZWQuYWRkUnVsZXMoW3tcbiAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uczogW25ldyBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50LlBhZ2VTdGF0ZU1hdGNoZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9wYWdlVXJsOiB7aG9zdEVxdWFsczogJyouKi4qJ30sXG4gICAgICAgICAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uczogW25ldyBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50LlNob3dQYWdlQWN0aW9uKCldXG4gICAgICAgICAgICAgICAgfV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBQcm9kdWN0IHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9kdWN0LCBjYXRlZ29yaWVzKSB7XG4gICAgICAgIHRoaXMuaWQgPSBwcm9kdWN0LmlkO1xuICAgICAgICB0aGlzLm5hbWUgPSBwcm9kdWN0Lm5hbWU7XG4gICAgICAgIHRoaXMucGF0dGVybnMgPSBwcm9kdWN0LnBhdHRlcm5zO1xuICAgICAgICB0aGlzLmNhdGVnb3J5SWQgPSBwcm9kdWN0LmNhdGVnb3J5SWQ7XG4gICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBQcm9kdWN0LmdldENhdGVnb3J5QnlJZCh0aGlzLmNhdGVnb3J5SWQsIGNhdGVnb3JpZXMpO1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gcHJvZHVjdC5kaXNhYmxlZDtcbiAgICAgICAgdGhpcy5jaGVja1Jlc3BvbnNlV2l0aE90aGVyUHJvZHVjdElkcyA9IHByb2R1Y3QuY2hlY2tSZXNwb25zZVdpdGhPdGhlclByb2R1Y3RJZHM7XG4gICAgfVxuICAgIGlzTWF0Y2godXJsKSB7XG4gICAgICAgIGxldCBtYXRjaCA9IGZhbHNlO1xuICAgICAgICBjb25zdCBuZXR3b3JrUGF0dGVybnMgPSB0aGlzLnBhdHRlcm5zLm5ldHdvcms7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBuZXR3b3JrUGF0dGVybnMgJiYgKGkgPCBuZXR3b3JrUGF0dGVybnMubGVuZ3RoKSAmJiAhbWF0Y2g7IGkrKykge1xuICAgICAgICAgICAgbWF0Y2ggPSAodXJsLmluZGV4T2YobmV0d29ya1BhdHRlcm5zW2ldLmtleSkgPiAtMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH1cbiAgICBpc1Jlc3BvbnNlQm9keU1hdGNoKHVybCkge1xuICAgICAgICBsZXQgbWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgY29uc3QgcGF0dGVybnMgPSB0aGlzLnBhdHRlcm5zLnJlc3BvbnNlQm9keTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IHBhdHRlcm5zICYmIChpIDwgcGF0dGVybnMubGVuZ3RoKSAmJiAhbWF0Y2g7IGkrKykge1xuICAgICAgICAgICAgbWF0Y2ggPSAodXJsLmluZGV4T2YocGF0dGVybnNbaV0ua2V5KSA+IC0xKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfVxuICAgIGdldFJlc3BvbnNlQm9keVByb2R1Y3RzKHByb2R1Y3RzKSB7XG4gICAgICAgIGxldCByZXNwb25zZUJvZHlQcm9kdWN0cyA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmNoZWNrUmVzcG9uc2VXaXRoT3RoZXJQcm9kdWN0SWRzICYmICh0aGlzLmNoZWNrUmVzcG9uc2VXaXRoT3RoZXJQcm9kdWN0SWRzLmxlbmd0aCA+IDEpKSB7XG4gICAgICAgICAgICByZXNwb25zZUJvZHlQcm9kdWN0cyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9kdWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrUmVzcG9uc2VXaXRoT3RoZXJQcm9kdWN0SWRzLmluZGV4T2YocHJvZHVjdHNbaV0uaWQpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VCb2R5UHJvZHVjdHMucHVzaChwcm9kdWN0c1tpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZUJvZHlQcm9kdWN0cztcbiAgICB9XG4gICAgc3RhdGljIGdldENhdGVnb3J5QnlJZChjYXRlZ29yeUlkLCBjYXRlZ29yaWVzKSB7XG4gICAgICAgIGxldCBjYXRlZ29yeSA9IFwibm90LWZvdW5kXCI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2F0ZWdvcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGNhdGVnb3JpZXNbaV0uaWQgPT0gY2F0ZWdvcnlJZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYXRlZ29yaWVzW2ldLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhdGVnb3J5O1xuICAgIH1cbiAgICBzdGF0aWMgaW5pdFByb2R1Y3RzKHByb2R1Y3RzSnNvbiwgY2F0ZWdvcmllc0pzb24pIHtcbiAgICAgICAgY29uc3QgcHJvZHVjdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9kdWN0c0pzb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHByb2R1Y3RKc29uID0gcHJvZHVjdHNKc29uW2ldO1xuICAgICAgICAgICAgbGV0IHByb2R1Y3QgPSBuZXcgUHJvZHVjdChwcm9kdWN0SnNvbiwgY2F0ZWdvcmllc0pzb24pO1xuICAgICAgICAgICAgaWYgKCFwcm9kdWN0LmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgcHJvZHVjdHMucHVzaChwcm9kdWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvZHVjdHM7XG4gICAgfVxufSIsImV4cG9ydCBjbGFzcyBQcm9kdWN0TWF0Y2gge1xuICAgIGNvbnN0cnVjdG9yKHByb2R1Y3QpIHtcbiAgICAgICAgdGhpcy5wcm9kdWN0ID0gcHJvZHVjdDtcbiAgICAgICAgdGhpcy51cmxzID0gW107XG4gICAgICAgIHRoaXMubWF4TmJPZlVybHNBbGxvd2VkID0gNTtcbiAgICB9XG4gICAgYWRkVXJsKHVybCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNNYXhOYk9mVXJsc0FsbG93ZWQoKSkge1xuICAgICAgICAgICAgdGhpcy51cmxzLnB1c2godXJsKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlzTWF4TmJPZlVybHNBbGxvd2VkKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMudXJscy5sZW5ndGggPiB0aGlzLm1heE5iT2ZVcmxzQWxsb3dlZCk7XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIFV0aWwge1xuICAgIHN0YXRpYyBnZXRIb3N0TmFtZShocmVmKSB7XG4gICAgICAgIGNvbnN0IGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgbC5ocmVmID0gaHJlZjtcbiAgICAgICAgcmV0dXJuIGwuaG9zdG5hbWU7XG4gICAgfVxufSIsImltcG9ydCB7UHJvZHVjdE1hdGNofSBmcm9tIFwiLi9Qcm9kdWN0TWF0Y2hcIjtcblxuZXhwb3J0IGNsYXNzIFdlYnNpdGUge1xuXG4gICAgY29uc3RydWN0b3IoZG9tYWluKSB7XG4gICAgICAgIHRoaXMuZG9tYWluID0gZG9tYWluO1xuICAgICAgICB0aGlzLnByb2R1Y3RNYXRjaGVzID0ge307XG4gICAgfVxuXG4gICAgZ2V0UHJvZHVjdE1hdGNoKHByb2R1Y3QpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByb2R1Y3RNYXRjaGVzW3Byb2R1Y3QubmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMucHJvZHVjdE1hdGNoZXNbcHJvZHVjdC5uYW1lXSA9IG5ldyBQcm9kdWN0TWF0Y2gocHJvZHVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHJvZHVjdE1hdGNoZXNbcHJvZHVjdC5uYW1lXTtcbiAgICB9XG5cbiAgICBhZGRQcm9kdWN0TWF0Y2gocHJvZHVjdCwgd2ViUmVxdWVzdFVybCkge1xuICAgICAgICBjb25zdCBwcm9kdWN0TWF0Y2ggPSB0aGlzLmdldFByb2R1Y3RNYXRjaChwcm9kdWN0KTtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RNYXRjaC5hZGRVcmwod2ViUmVxdWVzdFVybCk7XG4gICAgfVxuXG4gICAgY2hlY2tSZXNwb25zZShwcm9kdWN0cywgd2ViUmVxdWVzdFVybCwgY2IpIHtcbiAgICAgICAgZmV0Y2god2ViUmVxdWVzdFVybClcbiAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKHRleHQpID0+IHtcbiAgICAgICAgICAgICAgICBwcm9kdWN0cy5mb3JFYWNoKChwcm9kdWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VyTWF0Y2ggPSBwcm9kdWN0LmlzUmVzcG9uc2VCb2R5TWF0Y2godGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYWNrYWdlck1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFByb2R1Y3RNYXRjaChwcm9kdWN0LCB3ZWJSZXF1ZXN0VXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKHByb2R1Y3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Um9vdFdlYnNpdGUod2Vic2l0ZXMsIGRldGFpbHMpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRQYXJlbnRJZCA9IGRldGFpbHMucGFyZW50RnJhbWVJZDtcbiAgICAgICAgbGV0IGN1cnJlbnRJbml0aWF0b3IgPSBkZXRhaWxzLmluaXRpYXRvcjtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRQYXJlbnRJZCAhPSAtMSkge1xuICAgICAgICAgICAgZGV0YWlscyA9IHdlYnNpdGVzW2N1cnJlbnRQYXJlbnRJZF07XG4gICAgICAgICAgICBpZiAoZGV0YWlscykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXJlbnRJZCA9IGRldGFpbHMucGFyZW50RnJhbWVJZDtcbiAgICAgICAgICAgICAgICBjdXJyZW50SW5pdGlhdG9yID0gZGV0YWlscy5pbml0aWF0b3I7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXJlbnRJZCA9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjdXJyZW50SW5pdGlhdG9yO1xuICAgIH1cblxufSIsImltcG9ydCB7QXBwfSBmcm9tIFwiLi9BcHBcIjtcbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTsiXSwic291cmNlUm9vdCI6IiJ9