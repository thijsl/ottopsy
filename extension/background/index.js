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






class App {

     constructor() {
        _ChromeExtension__WEBPACK_IMPORTED_MODULE_2__["ChromeExtension"].init();
        this.initiators = {};
        this.allInitiators = {};
        this.productsDatabaseUrl = chrome.runtime.getURL("data/patterns.json");
        this.initProductsAndInitializers();
    }

    initProductsAndInitializers() {
         fetch(this.productsDatabaseUrl)
            .then((response) => response.json()) //assuming file contains json
            .then((json) => {
                this.products = _Product__WEBPACK_IMPORTED_MODULE_0__["Product"].initProducts(json);
                this.initInitializerListeners();
            });
    }

    initInitializerListeners() {
        let onBeforeRequestListener = (details) => {
            let url = details.url;
            this.allInitiators[details.frameId] = {
                initiator: details.initiator,
                parentFrameId: details.parentFrameId
            };
            this.process(_Util__WEBPACK_IMPORTED_MODULE_1__["Util"].getHostName(this.getRootInitiator(details)), url);
        };
        chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeRequestListener, {urls: ["<all_urls>"]});
    }

    getRootInitiator(details) {
        let currentParentId = details.parentFrameId;
        let currentInitiator = details.initiator;
        while (currentParentId != -1) {
            details = this.allInitiators[currentParentId];
            if (details) {
                currentParentId = details.parentFrameId;
                currentInitiator = details.initiator;
            } else {
                console.warn("details is undefined at", currentParentId, this.allInitiators);
                currentParentId = -1;
            }
        }
        return currentInitiator;
    }

    createInitiatorIfNeeded(initiators, initiator, product) {
        if (!this.initiators[initiator]) {
            this.initiators[initiator] = {};
        }
        if (!this.initiators[initiator][product.category]) {
            this.initiators[initiator][product.category] = {};
        }
        if (!this.initiators[initiator][product.category][product.name]) {
            this.initiators[initiator][product.category][product.name] = {status: 'unknown', url: []};
        }
    }

    isUrlNotYetAdded(initiators, initiator, product, url) {
        return (this.initiators[initiator][product.category][product.name].url.indexOf(url) < 0);
    }

    process(initiator, url) {
        this.products.forEach((product) => {
            if (product.isMatch(url)) {
                this.createInitiatorIfNeeded(this.initiators, initiator, product);
                this.initiators[initiator][product.category][product.name].status = true;
                if (this.isUrlNotYetAdded(this.initiators, initiator, product, url)) {
                    if (this.initiators[initiator][product.category][product.name].url.length < 10) {
                        this.initiators[initiator][product.category][product.name].url.push(url);
                        chrome.storage.local.set({comps: this.initiators}, function () {
                            console.log('Updated components:', product.name, url);
                        });
                    }

                    if (product.name == "dash" || product.name == "hls") {
                        fetch(url)
                            .then((response) => {
                                return response.text();
                            })
                            .then((text) => {
                                const packagers = _Product__WEBPACK_IMPORTED_MODULE_0__["Product"].getProductsByCategory(this.products, "packager");
                                packagers.forEach((packager) => {
                                    const packagerMatch = packager.isMatch(text);
                                    if (packagerMatch) {
                                        if (!this.initiators[initiator].packager) {
                                            this.initiators[initiator].packager = {};
                                        }
                                        this.initiators[initiator].packager[[packager.name]] = {"status": true};
                                        chrome.storage.local.set({comps: this.initiators}, function () {
                                            console.log('Updated components:', product.name, "with", packager.name, "for", url);
                                        });
                                    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ2hyb21lRXh0ZW5zaW9uLmpzIiwid2VicGFjazovLy8uL3NyYy9Qcm9kdWN0LmpzIiwid2VicGFjazovLy8uL3NyYy9VdGlsLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBYTs7QUFFcUI7QUFDTjtBQUNzQjs7QUFFM0M7O0FBRVA7QUFDQSxRQUFRLGdFQUFlO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsZ0RBQU87QUFDdkM7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsMENBQUk7QUFDN0I7QUFDQSxvRkFBb0YscUJBQXFCO0FBQ3pHOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwRUFBMEU7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCx1QkFBdUI7QUFDekU7QUFDQSx5QkFBeUI7QUFDekI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQSxrREFBa0QsZ0RBQU87QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0dBQWdHO0FBQ2hHLGtFQUFrRSx1QkFBdUI7QUFDekY7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQSxpQ0FBaUM7QUFDakMsNkJBQTZCO0FBQzdCOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDN0dBO0FBQUE7QUFBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLG9CQUFvQjtBQUN4RCxxQkFBcUI7QUFDckI7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDs7QUFFQSxDOzs7Ozs7Ozs7Ozs7QUNmQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQ0FBc0M7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGlCQUFpQjtBQUN4QztBQUNBO0FBQ0EsMkJBQTJCLDJCQUEyQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLHNDQUFzQztBQUNuRjtBQUNBLEM7Ozs7Ozs7Ozs7OztBQzdCQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDTkE7QUFBQTtBQUEwQjtBQUMxQixnQkFBZ0Isd0NBQUcsRyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge1Byb2R1Y3R9IGZyb20gXCIuL1Byb2R1Y3RcIjtcbmltcG9ydCB7VXRpbH0gZnJvbSBcIi4vVXRpbFwiO1xuaW1wb3J0IHtDaHJvbWVFeHRlbnNpb259IGZyb20gXCIuL0Nocm9tZUV4dGVuc2lvblwiO1xuXG5leHBvcnQgY2xhc3MgQXBwIHtcblxuICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgQ2hyb21lRXh0ZW5zaW9uLmluaXQoKTtcbiAgICAgICAgdGhpcy5pbml0aWF0b3JzID0ge307XG4gICAgICAgIHRoaXMuYWxsSW5pdGlhdG9ycyA9IHt9O1xuICAgICAgICB0aGlzLnByb2R1Y3RzRGF0YWJhc2VVcmwgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoXCJkYXRhL3BhdHRlcm5zLmpzb25cIik7XG4gICAgICAgIHRoaXMuaW5pdFByb2R1Y3RzQW5kSW5pdGlhbGl6ZXJzKCk7XG4gICAgfVxuXG4gICAgaW5pdFByb2R1Y3RzQW5kSW5pdGlhbGl6ZXJzKCkge1xuICAgICAgICAgZmV0Y2godGhpcy5wcm9kdWN0c0RhdGFiYXNlVXJsKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpIC8vYXNzdW1pbmcgZmlsZSBjb250YWlucyBqc29uXG4gICAgICAgICAgICAudGhlbigoanNvbikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvZHVjdHMgPSBQcm9kdWN0LmluaXRQcm9kdWN0cyhqc29uKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRJbml0aWFsaXplckxpc3RlbmVycygpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdEluaXRpYWxpemVyTGlzdGVuZXJzKCkge1xuICAgICAgICBsZXQgb25CZWZvcmVSZXF1ZXN0TGlzdGVuZXIgPSAoZGV0YWlscykgPT4ge1xuICAgICAgICAgICAgbGV0IHVybCA9IGRldGFpbHMudXJsO1xuICAgICAgICAgICAgdGhpcy5hbGxJbml0aWF0b3JzW2RldGFpbHMuZnJhbWVJZF0gPSB7XG4gICAgICAgICAgICAgICAgaW5pdGlhdG9yOiBkZXRhaWxzLmluaXRpYXRvcixcbiAgICAgICAgICAgICAgICBwYXJlbnRGcmFtZUlkOiBkZXRhaWxzLnBhcmVudEZyYW1lSWRcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3MoVXRpbC5nZXRIb3N0TmFtZSh0aGlzLmdldFJvb3RJbml0aWF0b3IoZGV0YWlscykpLCB1cmwpO1xuICAgICAgICB9O1xuICAgICAgICBjaHJvbWUud2ViUmVxdWVzdC5vbkJlZm9yZVNlbmRIZWFkZXJzLmFkZExpc3RlbmVyKG9uQmVmb3JlUmVxdWVzdExpc3RlbmVyLCB7dXJsczogW1wiPGFsbF91cmxzPlwiXX0pO1xuICAgIH1cblxuICAgIGdldFJvb3RJbml0aWF0b3IoZGV0YWlscykge1xuICAgICAgICBsZXQgY3VycmVudFBhcmVudElkID0gZGV0YWlscy5wYXJlbnRGcmFtZUlkO1xuICAgICAgICBsZXQgY3VycmVudEluaXRpYXRvciA9IGRldGFpbHMuaW5pdGlhdG9yO1xuICAgICAgICB3aGlsZSAoY3VycmVudFBhcmVudElkICE9IC0xKSB7XG4gICAgICAgICAgICBkZXRhaWxzID0gdGhpcy5hbGxJbml0aWF0b3JzW2N1cnJlbnRQYXJlbnRJZF07XG4gICAgICAgICAgICBpZiAoZGV0YWlscykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXJlbnRJZCA9IGRldGFpbHMucGFyZW50RnJhbWVJZDtcbiAgICAgICAgICAgICAgICBjdXJyZW50SW5pdGlhdG9yID0gZGV0YWlscy5pbml0aWF0b3I7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcImRldGFpbHMgaXMgdW5kZWZpbmVkIGF0XCIsIGN1cnJlbnRQYXJlbnRJZCwgdGhpcy5hbGxJbml0aWF0b3JzKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFyZW50SWQgPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3VycmVudEluaXRpYXRvcjtcbiAgICB9XG5cbiAgICBjcmVhdGVJbml0aWF0b3JJZk5lZWRlZChpbml0aWF0b3JzLCBpbml0aWF0b3IsIHByb2R1Y3QpIHtcbiAgICAgICAgaWYgKCF0aGlzLmluaXRpYXRvcnNbaW5pdGlhdG9yXSkge1xuICAgICAgICAgICAgdGhpcy5pbml0aWF0b3JzW2luaXRpYXRvcl0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaW5pdGlhdG9yc1tpbml0aWF0b3JdW3Byb2R1Y3QuY2F0ZWdvcnldKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRpYXRvcnNbaW5pdGlhdG9yXVtwcm9kdWN0LmNhdGVnb3J5XSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pbml0aWF0b3JzW2luaXRpYXRvcl1bcHJvZHVjdC5jYXRlZ29yeV1bcHJvZHVjdC5uYW1lXSkge1xuICAgICAgICAgICAgdGhpcy5pbml0aWF0b3JzW2luaXRpYXRvcl1bcHJvZHVjdC5jYXRlZ29yeV1bcHJvZHVjdC5uYW1lXSA9IHtzdGF0dXM6ICd1bmtub3duJywgdXJsOiBbXX07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc1VybE5vdFlldEFkZGVkKGluaXRpYXRvcnMsIGluaXRpYXRvciwgcHJvZHVjdCwgdXJsKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5pbml0aWF0b3JzW2luaXRpYXRvcl1bcHJvZHVjdC5jYXRlZ29yeV1bcHJvZHVjdC5uYW1lXS51cmwuaW5kZXhPZih1cmwpIDwgMCk7XG4gICAgfVxuXG4gICAgcHJvY2Vzcyhpbml0aWF0b3IsIHVybCkge1xuICAgICAgICB0aGlzLnByb2R1Y3RzLmZvckVhY2goKHByb2R1Y3QpID0+IHtcbiAgICAgICAgICAgIGlmIChwcm9kdWN0LmlzTWF0Y2godXJsKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlSW5pdGlhdG9ySWZOZWVkZWQodGhpcy5pbml0aWF0b3JzLCBpbml0aWF0b3IsIHByb2R1Y3QpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhdG9yc1tpbml0aWF0b3JdW3Byb2R1Y3QuY2F0ZWdvcnldW3Byb2R1Y3QubmFtZV0uc3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1VybE5vdFlldEFkZGVkKHRoaXMuaW5pdGlhdG9ycywgaW5pdGlhdG9yLCBwcm9kdWN0LCB1cmwpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmluaXRpYXRvcnNbaW5pdGlhdG9yXVtwcm9kdWN0LmNhdGVnb3J5XVtwcm9kdWN0Lm5hbWVdLnVybC5sZW5ndGggPCAxMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWF0b3JzW2luaXRpYXRvcl1bcHJvZHVjdC5jYXRlZ29yeV1bcHJvZHVjdC5uYW1lXS51cmwucHVzaCh1cmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtjb21wczogdGhpcy5pbml0aWF0b3JzfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVcGRhdGVkIGNvbXBvbmVudHM6JywgcHJvZHVjdC5uYW1lLCB1cmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvZHVjdC5uYW1lID09IFwiZGFzaFwiIHx8IHByb2R1Y3QubmFtZSA9PSBcImhsc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmZXRjaCh1cmwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlcnMgPSBQcm9kdWN0LmdldFByb2R1Y3RzQnlDYXRlZ29yeSh0aGlzLnByb2R1Y3RzLCBcInBhY2thZ2VyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWNrYWdlcnMuZm9yRWFjaCgocGFja2FnZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VyTWF0Y2ggPSBwYWNrYWdlci5pc01hdGNoKHRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhY2thZ2VyTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaW5pdGlhdG9yc1tpbml0aWF0b3JdLnBhY2thZ2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhdG9yc1tpbml0aWF0b3JdLnBhY2thZ2VyID0ge307XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhdG9yc1tpbml0aWF0b3JdLnBhY2thZ2VyW1twYWNrYWdlci5uYW1lXV0gPSB7XCJzdGF0dXNcIjogdHJ1ZX07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtjb21wczogdGhpcy5pbml0aWF0b3JzfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVXBkYXRlZCBjb21wb25lbnRzOicsIHByb2R1Y3QubmFtZSwgXCJ3aXRoXCIsIHBhY2thZ2VyLm5hbWUsIFwiZm9yXCIsIHVybCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcbn0iLCJleHBvcnQgY2xhc3MgQ2hyb21lRXh0ZW5zaW9uIHtcblxuICAgIHN0YXRpYyBpbml0KCkge1xuICAgICAgICBjaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50Lm9uUGFnZUNoYW5nZWQucmVtb3ZlUnVsZXModW5kZWZpbmVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5vblBhZ2VDaGFuZ2VkLmFkZFJ1bGVzKFt7XG4gICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbnM6IFtuZXcgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5QYWdlU3RhdGVNYXRjaGVyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcGFnZVVybDoge2hvc3RFcXVhbHM6ICcqLiouKid9LFxuICAgICAgICAgICAgICAgICAgICB9KV0sXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnM6IFtuZXcgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5TaG93UGFnZUFjdGlvbigpXVxuICAgICAgICAgICAgICAgIH1dKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0iLCJleHBvcnQgY2xhc3MgUHJvZHVjdCB7XG4gICAgY29uc3RydWN0b3IocHJvZHVjdCwgY2F0ZWdvcnkpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gcHJvZHVjdC5uYW1lO1xuICAgICAgICB0aGlzLnBhdHRlcm5zID0gcHJvZHVjdC5wYXR0ZXJucztcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuICAgIH1cbiAgICBpc01hdGNoKHVybCkge1xuICAgICAgICBsZXQgbWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgdGhpcy5wYXR0ZXJucy5sZW5ndGgpICYmICFtYXRjaDsgaSsrKSB7XG4gICAgICAgICAgICBtYXRjaCA9ICh1cmwuaW5kZXhPZih0aGlzLnBhdHRlcm5zW2ldLmtleSkgPiAtMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH1cbiAgICBzdGF0aWMgaW5pdFByb2R1Y3RzKGpzb24pIHtcbiAgICAgICAgY29uc3QgcHJvZHVjdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBqc29uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQgPSBqc29uW2ldO1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50VHlwZXMgPSBjb21wb25lbnQudHlwZXM7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbXBvbmVudFR5cGVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tcG9uZW50VHlwZSA9IGNvbXBvbmVudFR5cGVzW2pdO1xuICAgICAgICAgICAgICAgIGxldCBwcm9kdWN0ID0gbmV3IFByb2R1Y3QoY29tcG9uZW50VHlwZSwgY29tcG9uZW50Lm5hbWUpO1xuICAgICAgICAgICAgICAgIHByb2R1Y3RzLnB1c2gocHJvZHVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0UHJvZHVjdHNCeUNhdGVnb3J5KHByb2R1Y3RzLCBjYXRlZ29yeSkge1xuICAgICAgICByZXR1cm4gcHJvZHVjdHMuZmlsdGVyKChwcm9kdWN0KSA9PiB7cmV0dXJuIChwcm9kdWN0LmNhdGVnb3J5ID09IGNhdGVnb3J5KX0pXG4gICAgfVxufSIsImV4cG9ydCBjbGFzcyBVdGlsIHtcbiAgICBzdGF0aWMgZ2V0SG9zdE5hbWUoaHJlZikge1xuICAgICAgICBjb25zdCBsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgIGwuaHJlZiA9IGhyZWY7XG4gICAgICAgIHJldHVybiBsLmhvc3RuYW1lO1xuICAgIH1cbn0iLCJpbXBvcnQge0FwcH0gZnJvbSBcIi4vQXBwXCI7XG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7Il0sInNvdXJjZVJvb3QiOiIifQ==