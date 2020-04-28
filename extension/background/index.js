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
        this.productsDatabaseUrl = chrome.runtime.getURL("data/patterns.json");
        this.initProductsAndWebsites();
    }

    initProductsAndWebsites() {
         fetch(this.productsDatabaseUrl)
            .then((response) => response.json()) //assuming file contains json
            .then((json) => {
                this.products = _Product__WEBPACK_IMPORTED_MODULE_0__["Product"].initProducts(json);
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

    // getRootWebsite(details) {
    //     let currentParentId = details.parentFrameId;
    //     let currentInitiator = details.initiator;
    //     while (currentParentId != -1) {
    //         details = this.allWebsites[currentParentId];
    //         if (details) {
    //             currentParentId = details.parentFrameId;
    //             currentInitiator = details.initiator;
    //         } else {
    //             console.warn("details is undefined at", currentParentId, this.allWebsites);
    //             currentParentId = -1;
    //         }
    //     }
    //     return currentInitiator;
    // }

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
    constructor(product, category) {
        this.name = product.name;
        this.patterns = product.patterns;
        this.category = category;
    }
    isMatch(url) {
        let match = false;
        for (let i = 0; (i < this.patterns.length) && !match; i++) {
            match = (url.indexOf(this.patterns[i].key) > -1);
        }
        return match;
    }
    isAbrProtocol() {
        return (this.category == "abrProtocol");
    }
    static initProducts(json) {
        const products = [];
        for (let i = 0; i < json.length; i++) {
            const component = json[i];
            const componentTypes = component.types;
            for (let j = 0; j < componentTypes.length; j++) {
                const componentType = componentTypes[j];
                let product = new Product(componentType, component.name);
                products.push(product);
            }
        }
        return products;
    }
    static getProductsByCategory(products, category) {
        return products.filter((product) => {return (product.category == category)})
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
/* harmony import */ var _Product__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Product */ "./src/Product.js");



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

    findPackager(products, webRequestUrl, cb) {
        fetch(webRequestUrl)
            .then((response) => {
                return response.text();
            })
            .then((text) => {
                const packagers = _Product__WEBPACK_IMPORTED_MODULE_1__["Product"].getProductsByCategory(products, "packager");
                packagers.forEach((packager) => {
                    const packagerMatch = packager.isMatch(text);
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
                // console.warn("details is undefined at", currentParentId, websites);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ2hyb21lRXh0ZW5zaW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9Qcm9kdWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9Qcm9kdWN0TWF0Y2guanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dlYnNpdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWE7O0FBRXFCO0FBQ047QUFDc0I7QUFDaEI7O0FBRTNCOztBQUVQO0FBQ0EsUUFBUSxnRUFBZTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsZ0RBQU87QUFDdkM7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsMENBQUksYUFBYSxnREFBTztBQUNwRDtBQUNBO0FBQ0Esb0ZBQW9GLHFCQUFxQjtBQUN6Rzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0RBQWdELGdEQUFPO0FBQ3ZEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMscUJBQXFCO0FBQ25FO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0Esc0RBQXNELHFCQUFxQjtBQUMzRTtBQUNBLDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDcEZBO0FBQUE7QUFBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLG9CQUFvQjtBQUN4RCxxQkFBcUI7QUFDckI7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDs7QUFFQSxDOzs7Ozs7Ozs7Ozs7QUNmQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQ0FBc0M7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGlCQUFpQjtBQUN4QztBQUNBO0FBQ0EsMkJBQTJCLDJCQUEyQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLHNDQUFzQztBQUNuRjtBQUNBLEM7Ozs7Ozs7Ozs7OztBQ2hDQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEM7Ozs7Ozs7Ozs7OztBQ2xCQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDTkE7QUFBQTtBQUFBO0FBQUE7QUFBNEM7QUFDVjs7QUFFM0I7O0FBRVA7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9EQUFvRCwwREFBWTtBQUNoRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxrQ0FBa0MsZ0RBQU87QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDOzs7Ozs7Ozs7Ozs7QUN2REE7QUFBQTtBQUEwQjtBQUMxQixnQkFBZ0Isd0NBQUcsRyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1Byb2R1Y3R9IGZyb20gXCIuL1Byb2R1Y3RcIjtcbmltcG9ydCB7VXRpbH0gZnJvbSBcIi4vVXRpbFwiO1xuaW1wb3J0IHtDaHJvbWVFeHRlbnNpb259IGZyb20gXCIuL0Nocm9tZUV4dGVuc2lvblwiO1xuaW1wb3J0IHtXZWJzaXRlfSBmcm9tIFwiLi9XZWJzaXRlXCI7XG5cbmV4cG9ydCBjbGFzcyBBcHAge1xuXG4gICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBDaHJvbWVFeHRlbnNpb24uaW5pdCgpO1xuICAgICAgICB0aGlzLnByb2R1Y3RzID0gW107XG4gICAgICAgIHRoaXMud2Vic2l0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5hbGxXZWJzaXRlcyA9IHt9O1xuICAgICAgICB0aGlzLnByb2R1Y3RzRGF0YWJhc2VVcmwgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoXCJkYXRhL3BhdHRlcm5zLmpzb25cIik7XG4gICAgICAgIHRoaXMuaW5pdFByb2R1Y3RzQW5kV2Vic2l0ZXMoKTtcbiAgICB9XG5cbiAgICBpbml0UHJvZHVjdHNBbmRXZWJzaXRlcygpIHtcbiAgICAgICAgIGZldGNoKHRoaXMucHJvZHVjdHNEYXRhYmFzZVVybClcbiAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKSAvL2Fzc3VtaW5nIGZpbGUgY29udGFpbnMganNvblxuICAgICAgICAgICAgLnRoZW4oKGpzb24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2R1Y3RzID0gUHJvZHVjdC5pbml0UHJvZHVjdHMoanNvbik7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0V2Vic2l0ZVJlcXVlc3RMaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGluaXRXZWJzaXRlUmVxdWVzdExpc3RlbmVycygpIHtcbiAgICAgICAgbGV0IG9uQmVmb3JlUmVxdWVzdExpc3RlbmVyID0gKGRldGFpbHMpID0+IHtcbiAgICAgICAgICAgIGxldCB3ZWJSZXF1ZXN0VXJsID0gZGV0YWlscy51cmw7XG4gICAgICAgICAgICB0aGlzLmFsbFdlYnNpdGVzW2RldGFpbHMuZnJhbWVJZF0gPSB7XG4gICAgICAgICAgICAgICAgaW5pdGlhdG9yOiBkZXRhaWxzLmluaXRpYXRvcixcbiAgICAgICAgICAgICAgICBwYXJlbnRGcmFtZUlkOiBkZXRhaWxzLnBhcmVudEZyYW1lSWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCB3ZWJzaXRlID0gVXRpbC5nZXRIb3N0TmFtZShXZWJzaXRlLmdldFJvb3RXZWJzaXRlKHRoaXMud2Vic2l0ZXMsIGRldGFpbHMpKTtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzcyh3ZWJzaXRlLCB3ZWJSZXF1ZXN0VXJsKTtcbiAgICAgICAgfTtcbiAgICAgICAgY2hyb21lLndlYlJlcXVlc3Qub25CZWZvcmVTZW5kSGVhZGVycy5hZGRMaXN0ZW5lcihvbkJlZm9yZVJlcXVlc3RMaXN0ZW5lciwge3VybHM6IFtcIjxhbGxfdXJscz5cIl19KTtcbiAgICB9XG5cbiAgICAvLyBnZXRSb290V2Vic2l0ZShkZXRhaWxzKSB7XG4gICAgLy8gICAgIGxldCBjdXJyZW50UGFyZW50SWQgPSBkZXRhaWxzLnBhcmVudEZyYW1lSWQ7XG4gICAgLy8gICAgIGxldCBjdXJyZW50SW5pdGlhdG9yID0gZGV0YWlscy5pbml0aWF0b3I7XG4gICAgLy8gICAgIHdoaWxlIChjdXJyZW50UGFyZW50SWQgIT0gLTEpIHtcbiAgICAvLyAgICAgICAgIGRldGFpbHMgPSB0aGlzLmFsbFdlYnNpdGVzW2N1cnJlbnRQYXJlbnRJZF07XG4gICAgLy8gICAgICAgICBpZiAoZGV0YWlscykge1xuICAgIC8vICAgICAgICAgICAgIGN1cnJlbnRQYXJlbnRJZCA9IGRldGFpbHMucGFyZW50RnJhbWVJZDtcbiAgICAvLyAgICAgICAgICAgICBjdXJyZW50SW5pdGlhdG9yID0gZGV0YWlscy5pbml0aWF0b3I7XG4gICAgLy8gICAgICAgICB9IGVsc2Uge1xuICAgIC8vICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImRldGFpbHMgaXMgdW5kZWZpbmVkIGF0XCIsIGN1cnJlbnRQYXJlbnRJZCwgdGhpcy5hbGxXZWJzaXRlcyk7XG4gICAgLy8gICAgICAgICAgICAgY3VycmVudFBhcmVudElkID0gLTE7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyAgICAgcmV0dXJuIGN1cnJlbnRJbml0aWF0b3I7XG4gICAgLy8gfVxuXG4gICAgZ2V0V2Vic2l0ZSh3ZWJzaXRlRG9tYWluKSB7XG4gICAgICAgICBpZiAoIXRoaXMud2Vic2l0ZXNbd2Vic2l0ZURvbWFpbl0pIHtcbiAgICAgICAgICAgICB0aGlzLndlYnNpdGVzW3dlYnNpdGVEb21haW5dID0gbmV3IFdlYnNpdGUod2Vic2l0ZURvbWFpbik7XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gdGhpcy53ZWJzaXRlc1t3ZWJzaXRlRG9tYWluXTtcbiAgICB9XG5cbiAgICBwcm9jZXNzKHdlYnNpdGVEb21haW4sIHdlYlJlcXVlc3RVcmwpIHtcbiAgICAgICAgdGhpcy5wcm9kdWN0cy5mb3JFYWNoKChwcm9kdWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAocHJvZHVjdC5pc01hdGNoKHdlYlJlcXVlc3RVcmwpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2Vic2l0ZSA9IHRoaXMuZ2V0V2Vic2l0ZSh3ZWJzaXRlRG9tYWluKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWN0TWF0Y2hBZGRlZCA9IHdlYnNpdGUuYWRkUHJvZHVjdE1hdGNoKHByb2R1Y3QsIHdlYlJlcXVlc3RVcmwpO1xuICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0TWF0Y2hBZGRlZCkge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe2NvbXBzOiB0aGlzLndlYnNpdGVzfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1VwZGF0ZWQgY29tcG9uZW50czonLCBwcm9kdWN0Lm5hbWUsIHdlYlJlcXVlc3RVcmwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvZHVjdC5pc0FiclByb3RvY29sKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYnNpdGUuZmluZFBhY2thZ2VyKHRoaXMucHJvZHVjdHMsIHdlYlJlcXVlc3RVcmwsIChwYWNrYWdlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7Y29tcHM6IHRoaXMud2Vic2l0ZXN9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVcGRhdGVkIGNvbXBvbmVudHM6JywgcHJvZHVjdC5uYW1lLCBcIndpdGhcIiwgcGFja2FnZXIubmFtZSwgXCJmb3JcIiwgd2ViUmVxdWVzdFVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbn0iLCJleHBvcnQgY2xhc3MgQ2hyb21lRXh0ZW5zaW9uIHtcblxuICAgIHN0YXRpYyBpbml0KCkge1xuICAgICAgICBjaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50Lm9uUGFnZUNoYW5nZWQucmVtb3ZlUnVsZXModW5kZWZpbmVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5vblBhZ2VDaGFuZ2VkLmFkZFJ1bGVzKFt7XG4gICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbnM6IFtuZXcgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5QYWdlU3RhdGVNYXRjaGVyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcGFnZVVybDoge2hvc3RFcXVhbHM6ICcqLiouKid9LFxuICAgICAgICAgICAgICAgICAgICB9KV0sXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnM6IFtuZXcgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5TaG93UGFnZUFjdGlvbigpXVxuICAgICAgICAgICAgICAgIH1dKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgUHJvZHVjdCB7XG4gICAgY29uc3RydWN0b3IocHJvZHVjdCwgY2F0ZWdvcnkpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gcHJvZHVjdC5uYW1lO1xuICAgICAgICB0aGlzLnBhdHRlcm5zID0gcHJvZHVjdC5wYXR0ZXJucztcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuICAgIH1cbiAgICBpc01hdGNoKHVybCkge1xuICAgICAgICBsZXQgbWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgdGhpcy5wYXR0ZXJucy5sZW5ndGgpICYmICFtYXRjaDsgaSsrKSB7XG4gICAgICAgICAgICBtYXRjaCA9ICh1cmwuaW5kZXhPZih0aGlzLnBhdHRlcm5zW2ldLmtleSkgPiAtMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH1cbiAgICBpc0FiclByb3RvY29sKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuY2F0ZWdvcnkgPT0gXCJhYnJQcm90b2NvbFwiKTtcbiAgICB9XG4gICAgc3RhdGljIGluaXRQcm9kdWN0cyhqc29uKSB7XG4gICAgICAgIGNvbnN0IHByb2R1Y3RzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwganNvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0ganNvbltpXTtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudFR5cGVzID0gY29tcG9uZW50LnR5cGVzO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb21wb25lbnRUeXBlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudFR5cGUgPSBjb21wb25lbnRUeXBlc1tqXTtcbiAgICAgICAgICAgICAgICBsZXQgcHJvZHVjdCA9IG5ldyBQcm9kdWN0KGNvbXBvbmVudFR5cGUsIGNvbXBvbmVudC5uYW1lKTtcbiAgICAgICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHByb2R1Y3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9kdWN0cztcbiAgICB9XG4gICAgc3RhdGljIGdldFByb2R1Y3RzQnlDYXRlZ29yeShwcm9kdWN0cywgY2F0ZWdvcnkpIHtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcigocHJvZHVjdCkgPT4ge3JldHVybiAocHJvZHVjdC5jYXRlZ29yeSA9PSBjYXRlZ29yeSl9KVxuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgUHJvZHVjdE1hdGNoIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9kdWN0KSB7XG4gICAgICAgIHRoaXMucHJvZHVjdCA9IHByb2R1Y3Q7XG4gICAgICAgIHRoaXMudXJscyA9IFtdO1xuICAgICAgICB0aGlzLm1heE5iT2ZVcmxzQWxsb3dlZCA9IDU7XG4gICAgfVxuICAgIGFkZFVybCh1cmwpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzTWF4TmJPZlVybHNBbGxvd2VkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudXJscy5wdXNoKHVybCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpc01heE5iT2ZVcmxzQWxsb3dlZCgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnVybHMubGVuZ3RoID4gdGhpcy5tYXhOYk9mVXJsc0FsbG93ZWQpO1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBVdGlsIHtcbiAgICBzdGF0aWMgZ2V0SG9zdE5hbWUoaHJlZikge1xuICAgICAgICBjb25zdCBsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgIGwuaHJlZiA9IGhyZWY7XG4gICAgICAgIHJldHVybiBsLmhvc3RuYW1lO1xuICAgIH1cbn0iLCJpbXBvcnQge1Byb2R1Y3RNYXRjaH0gZnJvbSBcIi4vUHJvZHVjdE1hdGNoXCI7XG5pbXBvcnQge1Byb2R1Y3R9IGZyb20gXCIuL1Byb2R1Y3RcIjtcblxuZXhwb3J0IGNsYXNzIFdlYnNpdGUge1xuXG4gICAgY29uc3RydWN0b3IoZG9tYWluKSB7XG4gICAgICAgIHRoaXMuZG9tYWluID0gZG9tYWluO1xuICAgICAgICB0aGlzLnByb2R1Y3RNYXRjaGVzID0ge307XG4gICAgfVxuXG4gICAgZ2V0UHJvZHVjdE1hdGNoKHByb2R1Y3QpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByb2R1Y3RNYXRjaGVzW3Byb2R1Y3QubmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMucHJvZHVjdE1hdGNoZXNbcHJvZHVjdC5uYW1lXSA9IG5ldyBQcm9kdWN0TWF0Y2gocHJvZHVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHJvZHVjdE1hdGNoZXNbcHJvZHVjdC5uYW1lXTtcbiAgICB9XG5cbiAgICBhZGRQcm9kdWN0TWF0Y2gocHJvZHVjdCwgd2ViUmVxdWVzdFVybCkge1xuICAgICAgICBjb25zdCBwcm9kdWN0TWF0Y2ggPSB0aGlzLmdldFByb2R1Y3RNYXRjaChwcm9kdWN0KTtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RNYXRjaC5hZGRVcmwod2ViUmVxdWVzdFVybCk7XG4gICAgfVxuXG4gICAgZmluZFBhY2thZ2VyKHByb2R1Y3RzLCB3ZWJSZXF1ZXN0VXJsLCBjYikge1xuICAgICAgICBmZXRjaCh3ZWJSZXF1ZXN0VXJsKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VycyA9IFByb2R1Y3QuZ2V0UHJvZHVjdHNCeUNhdGVnb3J5KHByb2R1Y3RzLCBcInBhY2thZ2VyXCIpO1xuICAgICAgICAgICAgICAgIHBhY2thZ2Vycy5mb3JFYWNoKChwYWNrYWdlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlck1hdGNoID0gcGFja2FnZXIuaXNNYXRjaCh0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhY2thZ2VyTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkUHJvZHVjdE1hdGNoKHBhY2thZ2VyLCBcIk4vQVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKHBhY2thZ2VyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFJvb3RXZWJzaXRlKHdlYnNpdGVzLCBkZXRhaWxzKSB7XG4gICAgICAgIGxldCBjdXJyZW50UGFyZW50SWQgPSBkZXRhaWxzLnBhcmVudEZyYW1lSWQ7XG4gICAgICAgIGxldCBjdXJyZW50SW5pdGlhdG9yID0gZGV0YWlscy5pbml0aWF0b3I7XG4gICAgICAgIHdoaWxlIChjdXJyZW50UGFyZW50SWQgIT0gLTEpIHtcbiAgICAgICAgICAgIGRldGFpbHMgPSB3ZWJzaXRlc1tjdXJyZW50UGFyZW50SWRdO1xuICAgICAgICAgICAgaWYgKGRldGFpbHMpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFyZW50SWQgPSBkZXRhaWxzLnBhcmVudEZyYW1lSWQ7XG4gICAgICAgICAgICAgICAgY3VycmVudEluaXRpYXRvciA9IGRldGFpbHMuaW5pdGlhdG9yO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLndhcm4oXCJkZXRhaWxzIGlzIHVuZGVmaW5lZCBhdFwiLCBjdXJyZW50UGFyZW50SWQsIHdlYnNpdGVzKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFyZW50SWQgPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3VycmVudEluaXRpYXRvcjtcbiAgICB9XG5cbn0iLCJpbXBvcnQge0FwcH0gZnJvbSBcIi4vQXBwXCI7XG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7Il0sInNvdXJjZVJvb3QiOiIifQ==