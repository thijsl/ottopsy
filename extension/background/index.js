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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ2hyb21lRXh0ZW5zaW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9Qcm9kdWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9Qcm9kdWN0TWF0Y2guanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dlYnNpdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWE7O0FBRXFCO0FBQ047QUFDc0I7QUFDaEI7O0FBRTNCOztBQUVQO0FBQ0EsUUFBUSxnRUFBZTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsZ0RBQU87QUFDdkM7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsMENBQUksYUFBYSxnREFBTztBQUNwRDtBQUNBO0FBQ0Esb0ZBQW9GLHFCQUFxQjtBQUN6Rzs7QUFFQTtBQUNBO0FBQ0EsZ0RBQWdELGdEQUFPO0FBQ3ZEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEMscUJBQXFCO0FBQ25FO0FBQ0EscUJBQXFCOztBQUVyQjtBQUNBO0FBQ0Esc0RBQXNELHFCQUFxQjtBQUMzRTtBQUNBLDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDcEVBO0FBQUE7QUFBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLG9CQUFvQjtBQUN4RCxxQkFBcUI7QUFDckI7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDs7QUFFQSxDOzs7Ozs7Ozs7Ozs7QUNmQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQ0FBc0M7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGlCQUFpQjtBQUN4QztBQUNBO0FBQ0EsMkJBQTJCLDJCQUEyQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLHNDQUFzQztBQUNuRjtBQUNBLEM7Ozs7Ozs7Ozs7OztBQ2hDQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEM7Ozs7Ozs7Ozs7OztBQ2xCQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDTkE7QUFBQTtBQUFBO0FBQUE7QUFBNEM7QUFDVjs7QUFFM0I7O0FBRVA7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9EQUFvRCwwREFBWTtBQUNoRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxrQ0FBa0MsZ0RBQU87QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQzs7Ozs7Ozs7Ozs7O0FDdERBO0FBQUE7QUFBMEI7QUFDMUIsZ0JBQWdCLHdDQUFHLEciLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtQcm9kdWN0fSBmcm9tIFwiLi9Qcm9kdWN0XCI7XG5pbXBvcnQge1V0aWx9IGZyb20gXCIuL1V0aWxcIjtcbmltcG9ydCB7Q2hyb21lRXh0ZW5zaW9ufSBmcm9tIFwiLi9DaHJvbWVFeHRlbnNpb25cIjtcbmltcG9ydCB7V2Vic2l0ZX0gZnJvbSBcIi4vV2Vic2l0ZVwiO1xuXG5leHBvcnQgY2xhc3MgQXBwIHtcblxuICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgQ2hyb21lRXh0ZW5zaW9uLmluaXQoKTtcbiAgICAgICAgdGhpcy5wcm9kdWN0cyA9IFtdO1xuICAgICAgICB0aGlzLndlYnNpdGVzID0ge307XG4gICAgICAgIHRoaXMuYWxsV2Vic2l0ZXMgPSB7fTtcbiAgICAgICAgdGhpcy5wcm9kdWN0c0RhdGFiYXNlVXJsID0gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKFwiZGF0YS9wcm9kdWN0cy5qc29uXCIpO1xuICAgICAgICB0aGlzLmluaXRQcm9kdWN0c0FuZFdlYnNpdGVzKCk7XG4gICAgfVxuXG4gICAgaW5pdFByb2R1Y3RzQW5kV2Vic2l0ZXMoKSB7XG4gICAgICAgICBmZXRjaCh0aGlzLnByb2R1Y3RzRGF0YWJhc2VVcmwpXG4gICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSkgLy9hc3N1bWluZyBmaWxlIGNvbnRhaW5zIGpzb25cbiAgICAgICAgICAgIC50aGVuKChqc29uKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9kdWN0cyA9IFByb2R1Y3QuaW5pdFByb2R1Y3RzKGpzb24pO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdFdlYnNpdGVSZXF1ZXN0TGlzdGVuZXJzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0V2Vic2l0ZVJlcXVlc3RMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBvbkJlZm9yZVJlcXVlc3RMaXN0ZW5lciA9IChkZXRhaWxzKSA9PiB7XG4gICAgICAgICAgICBsZXQgd2ViUmVxdWVzdFVybCA9IGRldGFpbHMudXJsO1xuICAgICAgICAgICAgdGhpcy5hbGxXZWJzaXRlc1tkZXRhaWxzLmZyYW1lSWRdID0ge1xuICAgICAgICAgICAgICAgIGluaXRpYXRvcjogZGV0YWlscy5pbml0aWF0b3IsXG4gICAgICAgICAgICAgICAgcGFyZW50RnJhbWVJZDogZGV0YWlscy5wYXJlbnRGcmFtZUlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3Qgd2Vic2l0ZSA9IFV0aWwuZ2V0SG9zdE5hbWUoV2Vic2l0ZS5nZXRSb290V2Vic2l0ZSh0aGlzLndlYnNpdGVzLCBkZXRhaWxzKSk7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3Mod2Vic2l0ZSwgd2ViUmVxdWVzdFVybCk7XG4gICAgICAgIH07XG4gICAgICAgIGNocm9tZS53ZWJSZXF1ZXN0Lm9uQmVmb3JlU2VuZEhlYWRlcnMuYWRkTGlzdGVuZXIob25CZWZvcmVSZXF1ZXN0TGlzdGVuZXIsIHt1cmxzOiBbXCI8YWxsX3VybHM+XCJdfSk7XG4gICAgfVxuXG4gICAgZ2V0V2Vic2l0ZSh3ZWJzaXRlRG9tYWluKSB7XG4gICAgICAgICBpZiAoIXRoaXMud2Vic2l0ZXNbd2Vic2l0ZURvbWFpbl0pIHtcbiAgICAgICAgICAgICB0aGlzLndlYnNpdGVzW3dlYnNpdGVEb21haW5dID0gbmV3IFdlYnNpdGUod2Vic2l0ZURvbWFpbik7XG4gICAgICAgICB9XG4gICAgICAgICByZXR1cm4gdGhpcy53ZWJzaXRlc1t3ZWJzaXRlRG9tYWluXTtcbiAgICB9XG5cbiAgICBwcm9jZXNzKHdlYnNpdGVEb21haW4sIHdlYlJlcXVlc3RVcmwpIHtcbiAgICAgICAgdGhpcy5wcm9kdWN0cy5mb3JFYWNoKChwcm9kdWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAocHJvZHVjdC5pc01hdGNoKHdlYlJlcXVlc3RVcmwpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2Vic2l0ZSA9IHRoaXMuZ2V0V2Vic2l0ZSh3ZWJzaXRlRG9tYWluKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9kdWN0TWF0Y2hBZGRlZCA9IHdlYnNpdGUuYWRkUHJvZHVjdE1hdGNoKHByb2R1Y3QsIHdlYlJlcXVlc3RVcmwpO1xuICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0TWF0Y2hBZGRlZCkge1xuICAgICAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe2NvbXBzOiB0aGlzLndlYnNpdGVzfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1VwZGF0ZWQgY29tcG9uZW50czonLCBwcm9kdWN0Lm5hbWUsIHdlYlJlcXVlc3RVcmwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvZHVjdC5pc0FiclByb3RvY29sKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYnNpdGUuZmluZFBhY2thZ2VyKHRoaXMucHJvZHVjdHMsIHdlYlJlcXVlc3RVcmwsIChwYWNrYWdlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7Y29tcHM6IHRoaXMud2Vic2l0ZXN9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVcGRhdGVkIGNvbXBvbmVudHM6JywgcHJvZHVjdC5uYW1lLCBcIndpdGhcIiwgcGFja2FnZXIubmFtZSwgXCJmb3JcIiwgd2ViUmVxdWVzdFVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbn0iLCJleHBvcnQgY2xhc3MgQ2hyb21lRXh0ZW5zaW9uIHtcblxuICAgIHN0YXRpYyBpbml0KCkge1xuICAgICAgICBjaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50Lm9uUGFnZUNoYW5nZWQucmVtb3ZlUnVsZXModW5kZWZpbmVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5vblBhZ2VDaGFuZ2VkLmFkZFJ1bGVzKFt7XG4gICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbnM6IFtuZXcgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5QYWdlU3RhdGVNYXRjaGVyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcGFnZVVybDoge2hvc3RFcXVhbHM6ICcqLiouKid9LFxuICAgICAgICAgICAgICAgICAgICB9KV0sXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnM6IFtuZXcgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5TaG93UGFnZUFjdGlvbigpXVxuICAgICAgICAgICAgICAgIH1dKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgUHJvZHVjdCB7XG4gICAgY29uc3RydWN0b3IocHJvZHVjdCwgY2F0ZWdvcnkpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gcHJvZHVjdC5uYW1lO1xuICAgICAgICB0aGlzLnBhdHRlcm5zID0gcHJvZHVjdC5wYXR0ZXJucztcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuICAgIH1cbiAgICBpc01hdGNoKHVybCkge1xuICAgICAgICBsZXQgbWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgdGhpcy5wYXR0ZXJucy5sZW5ndGgpICYmICFtYXRjaDsgaSsrKSB7XG4gICAgICAgICAgICBtYXRjaCA9ICh1cmwuaW5kZXhPZih0aGlzLnBhdHRlcm5zW2ldLmtleSkgPiAtMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH1cbiAgICBpc0FiclByb3RvY29sKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuY2F0ZWdvcnkgPT0gXCJhYnJQcm90b2NvbFwiKTtcbiAgICB9XG4gICAgc3RhdGljIGluaXRQcm9kdWN0cyhqc29uKSB7XG4gICAgICAgIGNvbnN0IHByb2R1Y3RzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwganNvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50ID0ganNvbltpXTtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudFR5cGVzID0gY29tcG9uZW50LnR5cGVzO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb21wb25lbnRUeXBlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudFR5cGUgPSBjb21wb25lbnRUeXBlc1tqXTtcbiAgICAgICAgICAgICAgICBsZXQgcHJvZHVjdCA9IG5ldyBQcm9kdWN0KGNvbXBvbmVudFR5cGUsIGNvbXBvbmVudC5uYW1lKTtcbiAgICAgICAgICAgICAgICBwcm9kdWN0cy5wdXNoKHByb2R1Y3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9kdWN0cztcbiAgICB9XG4gICAgc3RhdGljIGdldFByb2R1Y3RzQnlDYXRlZ29yeShwcm9kdWN0cywgY2F0ZWdvcnkpIHtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzLmZpbHRlcigocHJvZHVjdCkgPT4ge3JldHVybiAocHJvZHVjdC5jYXRlZ29yeSA9PSBjYXRlZ29yeSl9KVxuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgUHJvZHVjdE1hdGNoIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9kdWN0KSB7XG4gICAgICAgIHRoaXMucHJvZHVjdCA9IHByb2R1Y3Q7XG4gICAgICAgIHRoaXMudXJscyA9IFtdO1xuICAgICAgICB0aGlzLm1heE5iT2ZVcmxzQWxsb3dlZCA9IDU7XG4gICAgfVxuICAgIGFkZFVybCh1cmwpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzTWF4TmJPZlVybHNBbGxvd2VkKCkpIHtcbiAgICAgICAgICAgIHRoaXMudXJscy5wdXNoKHVybCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpc01heE5iT2ZVcmxzQWxsb3dlZCgpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnVybHMubGVuZ3RoID4gdGhpcy5tYXhOYk9mVXJsc0FsbG93ZWQpO1xuICAgIH1cblxufSIsImV4cG9ydCBjbGFzcyBVdGlsIHtcbiAgICBzdGF0aWMgZ2V0SG9zdE5hbWUoaHJlZikge1xuICAgICAgICBjb25zdCBsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgIGwuaHJlZiA9IGhyZWY7XG4gICAgICAgIHJldHVybiBsLmhvc3RuYW1lO1xuICAgIH1cbn0iLCJpbXBvcnQge1Byb2R1Y3RNYXRjaH0gZnJvbSBcIi4vUHJvZHVjdE1hdGNoXCI7XG5pbXBvcnQge1Byb2R1Y3R9IGZyb20gXCIuL1Byb2R1Y3RcIjtcblxuZXhwb3J0IGNsYXNzIFdlYnNpdGUge1xuXG4gICAgY29uc3RydWN0b3IoZG9tYWluKSB7XG4gICAgICAgIHRoaXMuZG9tYWluID0gZG9tYWluO1xuICAgICAgICB0aGlzLnByb2R1Y3RNYXRjaGVzID0ge307XG4gICAgfVxuXG4gICAgZ2V0UHJvZHVjdE1hdGNoKHByb2R1Y3QpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByb2R1Y3RNYXRjaGVzW3Byb2R1Y3QubmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMucHJvZHVjdE1hdGNoZXNbcHJvZHVjdC5uYW1lXSA9IG5ldyBQcm9kdWN0TWF0Y2gocHJvZHVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucHJvZHVjdE1hdGNoZXNbcHJvZHVjdC5uYW1lXTtcbiAgICB9XG5cbiAgICBhZGRQcm9kdWN0TWF0Y2gocHJvZHVjdCwgd2ViUmVxdWVzdFVybCkge1xuICAgICAgICBjb25zdCBwcm9kdWN0TWF0Y2ggPSB0aGlzLmdldFByb2R1Y3RNYXRjaChwcm9kdWN0KTtcbiAgICAgICAgcmV0dXJuIHByb2R1Y3RNYXRjaC5hZGRVcmwod2ViUmVxdWVzdFVybCk7XG4gICAgfVxuXG4gICAgZmluZFBhY2thZ2VyKHByb2R1Y3RzLCB3ZWJSZXF1ZXN0VXJsLCBjYikge1xuICAgICAgICBmZXRjaCh3ZWJSZXF1ZXN0VXJsKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VycyA9IFByb2R1Y3QuZ2V0UHJvZHVjdHNCeUNhdGVnb3J5KHByb2R1Y3RzLCBcInBhY2thZ2VyXCIpO1xuICAgICAgICAgICAgICAgIHBhY2thZ2Vycy5mb3JFYWNoKChwYWNrYWdlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlck1hdGNoID0gcGFja2FnZXIuaXNNYXRjaCh0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhY2thZ2VyTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkUHJvZHVjdE1hdGNoKHBhY2thZ2VyLCBcIk4vQVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiKHBhY2thZ2VyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldFJvb3RXZWJzaXRlKHdlYnNpdGVzLCBkZXRhaWxzKSB7XG4gICAgICAgIGxldCBjdXJyZW50UGFyZW50SWQgPSBkZXRhaWxzLnBhcmVudEZyYW1lSWQ7XG4gICAgICAgIGxldCBjdXJyZW50SW5pdGlhdG9yID0gZGV0YWlscy5pbml0aWF0b3I7XG4gICAgICAgIHdoaWxlIChjdXJyZW50UGFyZW50SWQgIT0gLTEpIHtcbiAgICAgICAgICAgIGRldGFpbHMgPSB3ZWJzaXRlc1tjdXJyZW50UGFyZW50SWRdO1xuICAgICAgICAgICAgaWYgKGRldGFpbHMpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFyZW50SWQgPSBkZXRhaWxzLnBhcmVudEZyYW1lSWQ7XG4gICAgICAgICAgICAgICAgY3VycmVudEluaXRpYXRvciA9IGRldGFpbHMuaW5pdGlhdG9yO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFyZW50SWQgPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3VycmVudEluaXRpYXRvcjtcbiAgICB9XG5cbn0iLCJpbXBvcnQge0FwcH0gZnJvbSBcIi4vQXBwXCI7XG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7Il0sInNvdXJjZVJvb3QiOiIifQ==