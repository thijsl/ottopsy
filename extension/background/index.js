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
            const website = _Util__WEBPACK_IMPORTED_MODULE_1__["Util"].getHostName(this.getRootWebsite(details));
            this.process(website, webRequestUrl);
        };
        chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeRequestListener, {urls: ["<all_urls>"]});
    }

    getRootWebsite(details) {
        let currentParentId = details.parentFrameId;
        let currentInitiator = details.initiator;
        while (currentParentId != -1) {
            details = this.allWebsites[currentParentId];
            if (details) {
                currentParentId = details.parentFrameId;
                currentInitiator = details.initiator;
            } else {
                console.warn("details is undefined at", currentParentId, this.allWebsites);
                currentParentId = -1;
            }
        }
        return currentInitiator;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ2hyb21lRXh0ZW5zaW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9Qcm9kdWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9Qcm9kdWN0TWF0Y2guanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dlYnNpdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWE7O0FBRXFCO0FBQ047QUFDc0I7QUFDaEI7O0FBRTNCOztBQUVQO0FBQ0EsUUFBUSxnRUFBZTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsZ0RBQU87QUFDdkM7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsMENBQUk7QUFDaEM7QUFDQTtBQUNBLG9GQUFvRixxQkFBcUI7QUFDekc7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdEQUFnRCxnREFBTztBQUN2RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLHFCQUFxQjtBQUNuRTtBQUNBLHFCQUFxQjs7QUFFckI7QUFDQTtBQUNBLHNEQUFzRCxxQkFBcUI7QUFDM0U7QUFDQSw2QkFBNkI7QUFDN0IseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEM7Ozs7Ozs7Ozs7OztBQ3BGQTtBQUFBO0FBQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxvQkFBb0I7QUFDeEQscUJBQXFCO0FBQ3JCO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTO0FBQ1Q7O0FBRUEsQzs7Ozs7Ozs7Ozs7O0FDZkE7QUFBQTtBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0NBQXNDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixpQkFBaUI7QUFDeEM7QUFDQTtBQUNBLDJCQUEyQiwyQkFBMkI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxzQ0FBc0M7QUFDbkY7QUFDQSxDOzs7Ozs7Ozs7Ozs7QUNoQ0E7QUFBQTtBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDOzs7Ozs7Ozs7Ozs7QUNsQkE7QUFBQTtBQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7OztBQ05BO0FBQUE7QUFBQTtBQUFBO0FBQTRDO0FBQ1Y7O0FBRTNCOztBQUVQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvREFBb0QsMERBQVk7QUFDaEU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0Esa0NBQWtDLGdEQUFPO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7O0FBRUEsQzs7Ozs7Ozs7Ozs7O0FDdkNBO0FBQUE7QUFBMEI7QUFDMUIsZ0JBQWdCLHdDQUFHLEciLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtQcm9kdWN0fSBmcm9tIFwiLi9Qcm9kdWN0XCI7XG5pbXBvcnQge1V0aWx9IGZyb20gXCIuL1V0aWxcIjtcbmltcG9ydCB7Q2hyb21lRXh0ZW5zaW9ufSBmcm9tIFwiLi9DaHJvbWVFeHRlbnNpb25cIjtcbmltcG9ydCB7V2Vic2l0ZX0gZnJvbSBcIi4vV2Vic2l0ZVwiO1xuXG5leHBvcnQgY2xhc3MgQXBwIHtcblxuICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgQ2hyb21lRXh0ZW5zaW9uLmluaXQoKTtcbiAgICAgICAgdGhpcy5wcm9kdWN0cyA9IFtdO1xuICAgICAgICB0aGlzLndlYnNpdGVzID0ge307XG4gICAgICAgIHRoaXMuYWxsV2Vic2l0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5wcm9kdWN0c0RhdGFiYXNlVXJsID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwiZGF0YS9wYXR0ZXJucy5qc29uXCIpO1xuICAgICAgICB0aGlzLmluaXRQcm9kdWN0c0FuZFdlYnNpdGVzKCk7XG4gICAgfVxuXG4gICAgaW5pdFByb2R1Y3RzQW5kV2Vic2l0ZXMoKSB7XG4gICAgICAgICBmZXRjaCh0aGlzLnByb2R1Y3RzRGF0YWJhc2VVcmwpXG4gICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSkgLy9hc3N1bWluZyBmaWxlIGNvbnRhaW5zIGpzb25cbiAgICAgICAgICAgIC50aGVuKChqc29uKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9kdWN0cyA9IFByb2R1Y3QuaW5pdFByb2R1Y3RzKGpzb24pO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFdlYnNpdGVSZXF1ZXN0TGlzdGVuZXJzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0V2Vic2l0ZVJlcXVlc3RMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBvbkJlZm9yZVJlcXVlc3RMaXN0ZW5lciA9IChkZXRhaWxzKSA9PiB7XG4gICAgICAgICAgICBsZXQgd2ViUmVxdWVzdFVybCA9IGRldGFpbHMudXJsO1xuICAgICAgICAgICAgdGhpcy5hbGxXZWJzaXRlc1tkZXRhaWxzLmZyYW1lSWRdID0ge1xuICAgICAgICAgICAgICAgIGluaXRpYXRvcjogZGV0YWlscy5pbml0aWF0b3IsXG4gICAgICAgICAgICAgICAgcGFyZW50RnJhbWVJZDogZGV0YWlscy5wYXJlbnRGcmFtZUlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3Qgd2Vic2l0ZSA9IFV0aWwuZ2V0SG9zdE5hbWUodGhpcy5nZXRSb290V2Vic2l0ZShkZXRhaWxzKSk7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3Mod2Vic2l0ZSwgd2ViUmVxdWVzdFVybCk7XG4gICAgICAgIH07XG4gICAgICAgIGNocm9tZS53ZWJSZXF1ZXN0Lm9uQmVmb3JlU2VuZEhlYWRlcnMuYWRkTGlzdGVuZXIob25CZWZvcmVSZXF1ZXN0TGlzdGVuZXIsIHt1cmxzOiBbXCI8YWxsX3VybHM+XCJdfSk7XG4gICAgfVxuXG4gICAgZ2V0Um9vdFdlYnNpdGUoZGV0YWlscykge1xuICAgICAgICBsZXQgY3VycmVudFBhcmVudElkID0gZGV0YWlscy5wYXJlbnRGcmFtZUlkO1xuICAgICAgICBsZXQgY3VycmVudEluaXRpYXRvciA9IGRldGFpbHMuaW5pdGlhdG9yO1xuICAgICAgICB3aGlsZSAoY3VycmVudFBhcmVudElkICE9IC0xKSB7XG4gICAgICAgICAgICBkZXRhaWxzID0gdGhpcy5hbGxXZWJzaXRlc1tjdXJyZW50UGFyZW50SWRdO1xuICAgICAgICAgICAgaWYgKGRldGFpbHMpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFyZW50SWQgPSBkZXRhaWxzLnBhcmVudEZyYW1lSWQ7XG4gICAgICAgICAgICAgICAgY3VycmVudEluaXRpYXRvciA9IGRldGFpbHMuaW5pdGlhdG9yO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJkZXRhaWxzIGlzIHVuZGVmaW5lZCBhdFwiLCBjdXJyZW50UGFyZW50SWQsIHRoaXMuYWxsV2Vic2l0ZXMpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXJlbnRJZCA9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjdXJyZW50SW5pdGlhdG9yO1xuICAgIH1cblxuICAgIGdldFdlYnNpdGUod2Vic2l0ZURvbWFpbikge1xuICAgICAgICAgaWYgKCF0aGlzLndlYnNpdGVzW3dlYnNpdGVEb21haW5dKSB7XG4gICAgICAgICAgICAgdGhpcy53ZWJzaXRlc1t3ZWJzaXRlRG9tYWluXSA9IG5ldyBXZWJzaXRlKHdlYnNpdGVEb21haW4pO1xuICAgICAgICAgfVxuICAgICAgICAgcmV0dXJuIHRoaXMud2Vic2l0ZXNbd2Vic2l0ZURvbWFpbl07XG4gICAgfVxuXG4gICAgcHJvY2Vzcyh3ZWJzaXRlRG9tYWluLCB3ZWJSZXF1ZXN0VXJsKSB7XG4gICAgICAgIHRoaXMucHJvZHVjdHMuZm9yRWFjaCgocHJvZHVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKHByb2R1Y3QuaXNNYXRjaCh3ZWJSZXF1ZXN0VXJsKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdlYnNpdGUgPSB0aGlzLmdldFdlYnNpdGUod2Vic2l0ZURvbWFpbik7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJvZHVjdE1hdGNoQWRkZWQgPSB3ZWJzaXRlLmFkZFByb2R1Y3RNYXRjaChwcm9kdWN0LCB3ZWJSZXF1ZXN0VXJsKTtcbiAgICAgICAgICAgICAgICBpZiAocHJvZHVjdE1hdGNoQWRkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtjb21wczogdGhpcy53ZWJzaXRlc30sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVcGRhdGVkIGNvbXBvbmVudHM6JywgcHJvZHVjdC5uYW1lLCB3ZWJSZXF1ZXN0VXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2R1Y3QuaXNBYnJQcm90b2NvbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJzaXRlLmZpbmRQYWNrYWdlcih0aGlzLnByb2R1Y3RzLCB3ZWJSZXF1ZXN0VXJsLCAocGFja2FnZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe2NvbXBzOiB0aGlzLndlYnNpdGVzfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVXBkYXRlZCBjb21wb25lbnRzOicsIHByb2R1Y3QubmFtZSwgXCJ3aXRoXCIsIHBhY2thZ2VyLm5hbWUsIFwiZm9yXCIsIHdlYlJlcXVlc3RVcmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG59IiwiZXhwb3J0IGNsYXNzIENocm9tZUV4dGVuc2lvbiB7XG5cbiAgICBzdGF0aWMgaW5pdCgpIHtcbiAgICAgICAgY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5vblBhZ2VDaGFuZ2VkLnJlbW92ZVJ1bGVzKHVuZGVmaW5lZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQub25QYWdlQ2hhbmdlZC5hZGRSdWxlcyhbe1xuICAgICAgICAgICAgICAgICAgICBjb25kaXRpb25zOiBbbmV3IGNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQuUGFnZVN0YXRlTWF0Y2hlcih7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3BhZ2VVcmw6IHtob3N0RXF1YWxzOiAnKi4qLionfSxcbiAgICAgICAgICAgICAgICAgICAgfSldLFxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBbbmV3IGNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQuU2hvd1BhZ2VBY3Rpb24oKV1cbiAgICAgICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59IiwiZXhwb3J0IGNsYXNzIFByb2R1Y3Qge1xuICAgIGNvbnN0cnVjdG9yKHByb2R1Y3QsIGNhdGVnb3J5KSB7XG4gICAgICAgIHRoaXMubmFtZSA9IHByb2R1Y3QubmFtZTtcbiAgICAgICAgdGhpcy5wYXR0ZXJucyA9IHByb2R1Y3QucGF0dGVybnM7XG4gICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcbiAgICB9XG4gICAgaXNNYXRjaCh1cmwpIHtcbiAgICAgICAgbGV0IG1hdGNoID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IHRoaXMucGF0dGVybnMubGVuZ3RoKSAmJiAhbWF0Y2g7IGkrKykge1xuICAgICAgICAgICAgbWF0Y2ggPSAodXJsLmluZGV4T2YodGhpcy5wYXR0ZXJuc1tpXS5rZXkpID4gLTEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9XG4gICAgaXNBYnJQcm90b2NvbCgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLmNhdGVnb3J5ID09IFwiYWJyUHJvdG9jb2xcIik7XG4gICAgfVxuICAgIHN0YXRpYyBpbml0UHJvZHVjdHMoanNvbikge1xuICAgICAgICBjb25zdCBwcm9kdWN0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGpzb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGpzb25baV07XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnRUeXBlcyA9IGNvbXBvbmVudC50eXBlcztcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29tcG9uZW50VHlwZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRUeXBlID0gY29tcG9uZW50VHlwZXNbal07XG4gICAgICAgICAgICAgICAgbGV0IHByb2R1Y3QgPSBuZXcgUHJvZHVjdChjb21wb25lbnRUeXBlLCBjb21wb25lbnQubmFtZSk7XG4gICAgICAgICAgICAgICAgcHJvZHVjdHMucHVzaChwcm9kdWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvZHVjdHM7XG4gICAgfVxuICAgIHN0YXRpYyBnZXRQcm9kdWN0c0J5Q2F0ZWdvcnkocHJvZHVjdHMsIGNhdGVnb3J5KSB7XG4gICAgICAgIHJldHVybiBwcm9kdWN0cy5maWx0ZXIoKHByb2R1Y3QpID0+IHtyZXR1cm4gKHByb2R1Y3QuY2F0ZWdvcnkgPT0gY2F0ZWdvcnkpfSlcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIFByb2R1Y3RNYXRjaCB7XG4gICAgY29uc3RydWN0b3IocHJvZHVjdCkge1xuICAgICAgICB0aGlzLnByb2R1Y3QgPSBwcm9kdWN0O1xuICAgICAgICB0aGlzLnVybHMgPSBbXTtcbiAgICAgICAgdGhpcy5tYXhOYk9mVXJsc0FsbG93ZWQgPSA1O1xuICAgIH1cbiAgICBhZGRVcmwodXJsKSB7XG4gICAgICAgIGlmICghdGhpcy5pc01heE5iT2ZVcmxzQWxsb3dlZCgpKSB7XG4gICAgICAgICAgICB0aGlzLnVybHMucHVzaCh1cmwpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaXNNYXhOYk9mVXJsc0FsbG93ZWQoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy51cmxzLmxlbmd0aCA+IHRoaXMubWF4TmJPZlVybHNBbGxvd2VkKTtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgVXRpbCB7XG4gICAgc3RhdGljIGdldEhvc3ROYW1lKGhyZWYpIHtcbiAgICAgICAgY29uc3QgbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBsLmhyZWYgPSBocmVmO1xuICAgICAgICByZXR1cm4gbC5ob3N0bmFtZTtcbiAgICB9XG59IiwiaW1wb3J0IHtQcm9kdWN0TWF0Y2h9IGZyb20gXCIuL1Byb2R1Y3RNYXRjaFwiO1xuaW1wb3J0IHtQcm9kdWN0fSBmcm9tIFwiLi9Qcm9kdWN0XCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJzaXRlIHtcblxuICAgIGNvbnN0cnVjdG9yKGRvbWFpbikge1xuICAgICAgICB0aGlzLmRvbWFpbiA9IGRvbWFpbjtcbiAgICAgICAgdGhpcy5wcm9kdWN0TWF0Y2hlcyA9IHt9O1xuICAgIH1cblxuICAgIGdldFByb2R1Y3RNYXRjaChwcm9kdWN0KSB7XG4gICAgICAgIGlmICghdGhpcy5wcm9kdWN0TWF0Y2hlc1twcm9kdWN0Lm5hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLnByb2R1Y3RNYXRjaGVzW3Byb2R1Y3QubmFtZV0gPSBuZXcgUHJvZHVjdE1hdGNoKHByb2R1Y3QpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnByb2R1Y3RNYXRjaGVzW3Byb2R1Y3QubmFtZV07XG4gICAgfVxuXG4gICAgYWRkUHJvZHVjdE1hdGNoKHByb2R1Y3QsIHdlYlJlcXVlc3RVcmwpIHtcbiAgICAgICAgY29uc3QgcHJvZHVjdE1hdGNoID0gdGhpcy5nZXRQcm9kdWN0TWF0Y2gocHJvZHVjdCk7XG4gICAgICAgIHJldHVybiBwcm9kdWN0TWF0Y2guYWRkVXJsKHdlYlJlcXVlc3RVcmwpO1xuICAgIH1cblxuICAgIGZpbmRQYWNrYWdlcihwcm9kdWN0cywgd2ViUmVxdWVzdFVybCwgY2IpIHtcbiAgICAgICAgZmV0Y2god2ViUmVxdWVzdFVybClcbiAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKHRleHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlcnMgPSBQcm9kdWN0LmdldFByb2R1Y3RzQnlDYXRlZ29yeShwcm9kdWN0cywgXCJwYWNrYWdlclwiKTtcbiAgICAgICAgICAgICAgICBwYWNrYWdlcnMuZm9yRWFjaCgocGFja2FnZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFja2FnZXJNYXRjaCA9IHBhY2thZ2VyLmlzTWF0Y2godGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYWNrYWdlck1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFByb2R1Y3RNYXRjaChwYWNrYWdlciwgXCJOL0FcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYihwYWNrYWdlcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxufSIsImltcG9ydCB7QXBwfSBmcm9tIFwiLi9BcHBcIjtcbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTsiXSwic291cmNlUm9vdCI6IiJ9