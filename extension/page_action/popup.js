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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/webpack-index/popup.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Popup.js":
/*!**********************!*\
  !*** ./src/Popup.js ***!
  \**********************/
/*! exports provided: Popup */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Popup", function() { return Popup; });


class Popup {

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

/***/ }),

/***/ "./src/webpack-index/popup.js":
/*!************************************!*\
  !*** ./src/webpack-index/popup.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Popup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Popup */ "./src/Popup.js");

const popup = new _Popup__WEBPACK_IMPORTED_MODULE_0__["Popup"]();

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BvcHVwLmpzIiwid2VicGFjazovLy8uL3NyYy93ZWJwYWNrLWluZGV4L3BvcHVwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFhOztBQUVOOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsa0NBQWtDO0FBQzdEO0FBQ0E7QUFDQSxpQkFBaUIsU0FBUztBQUMxQixTQUFTO0FBQ1QsMkJBQTJCLDBDQUEwQztBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7O0FBRTdCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsa0NBQWtDO0FBQzVFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUEsQzs7Ozs7Ozs7Ozs7O0FDbElBO0FBQUE7QUFBK0I7QUFDL0Isa0JBQWtCLDRDQUFLLEciLCJmaWxlIjoicG9wdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy93ZWJwYWNrLWluZGV4L3BvcHVwLmpzXCIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgY2xhc3MgUG9wdXAge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucHJvZHVjdHMgPSBbXTtcbiAgICAgICAgdGhpcy5wcm9kdWN0TWF0Y2hlcyA9IFtdO1xuICAgICAgICB0aGlzLnNvcnRCeVByb2R1Y3QgPSB0cnVlO1xuICAgICAgICB0aGlzLmxvYWREYXRhSW5Qb3B1cCgpO1xuICAgICAgICB0aGlzLmF0dGFjaFNvcnRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIGdldFByb2R1Y3RzUmVuZGVyaW5nRWxlbWVudCgpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3VpLXRyZWV2aWV3Jyk7XG4gICAgfVxuICAgIHVwZGF0ZVByb2R1Y3RzUmVuZGVyKHByb2R1Y3RzKSB7XG4gICAgICAgIHRoaXMuZ2V0UHJvZHVjdHNSZW5kZXJpbmdFbGVtZW50KCkuZGlzcGxheShwcm9kdWN0cyk7XG4gICAgfVxuICAgIGdldERlZmF1bHRQcm9kdWN0cygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIFwiUHJvZHVjdCBtYXRjaGVzXCI6IHtcbiAgICAgICAgICAgICAgICBcIkFtb3VudFwiOiBcIjBcIixcbiAgICAgICAgICAgICAgICBcIlJlYXNvblwiOiBbXCJObyBwYXR0ZXJucyBpbiBwcm9kdWN0cy5qc29uIHdlcmUgcmVjb2duaXplZCBmb3IgdGhpcyB3ZWJzaXRlLlwiXSxcbiAgICAgICAgICAgICAgICBcIlRpcHNcIjogW1xuICAgICAgICAgICAgICAgICAgICBcIkFkZCBtb3JlIHByb2R1Y3RzIGFuZC9vciBwYXR0ZXJucyB0byBwcm9kdWN0cy5qc29uLlwiLFxuICAgICAgICAgICAgICAgICAgICBcIlBlcmhhcHMgdGhpcyB3ZWJzaXRlIGlzIG5vdCByZWxldmFudCB0byB0aGlzIGV4dGVuc2lvbj9cIlxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBsb2FkRGF0YUluUG9wdXAoKSB7XG4gICAgICAgIGNvbnN0IHNvcnRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNvcnQnKTtcbiAgICAgICAgdGhpcy51cGRhdGVQcm9kdWN0c1JlbmRlcih0aGlzLmdldERlZmF1bHRQcm9kdWN0cygpKTtcbiAgICAgICAgY2hyb21lLnRhYnMucXVlcnkoe2FjdGl2ZTogdHJ1ZSwgY3VycmVudFdpbmRvdzogdHJ1ZX0sIGZ1bmN0aW9uKHRhYnMpIHtcbiAgICAgICAgICAgIGNocm9tZS50YWJzLmV4ZWN1dGVTY3JpcHQoXG4gICAgICAgICAgICAgICAgdGFic1swXS5pZCxcbiAgICAgICAgICAgICAgICB7Y29kZTogJyd9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNocm9tZS50YWJzLnF1ZXJ5KHsnYWN0aXZlJzogdHJ1ZSwgJ2xhc3RGb2N1c2VkV2luZG93JzogdHJ1ZX0sICh0YWJzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0YWIgPSB0YWJzWzBdO1xuICAgICAgICAgICAgaWYgKHRhYiAmJiB0YWIudXJsKSB7XG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KCdjb21wcycsIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhvc3ROYW1lID0gdGhpcy5nZXRIb3N0TmFtZSh0YWIudXJsKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3dlYnNpdGUnKS50ZXh0Q29udGVudCA9IGhvc3ROYW1lO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSAmJiBkYXRhWydjb21wcyddKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBkYXRhWydjb21wcyddW2hvc3ROYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2R1Y3RNYXRjaGVzID0gcmVzdWx0LnByb2R1Y3RNYXRjaGVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldCgnc29ydEJ5UHJvZHVjdCcsIChkYXRhMikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNvcnRCeVByb2R1Y3QgPSBkYXRhMi5zb3J0QnlQcm9kdWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc29ydEJ5UHJvZHVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9kdWN0cyA9IHRoaXMuY2F0ZWdvcnlSZXByZXNlbnRhdGlvbih0aGlzLnByb2R1Y3RNYXRjaGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRFbGVtZW50LmlubmVySFRNTCA9ICc8aSBjbGFzcz1cImZhcyBmYS1maWx0ZXJcIj48L2k+IFNvcnQgYnkgUHJvZHVjdDwvc3Bhbj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9kdWN0cyA9IHRoaXMucHJvZHVjdFJlcHJlc2VudGF0aW9uKHRoaXMucHJvZHVjdE1hdGNoZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc29ydEVsZW1lbnQuaW5uZXJIVE1MID0gJzxpIGNsYXNzPVwiZmFzIGZhLWZpbHRlclwiPjwvaT4gU29ydCBieSBDYXRlZ29yeTwvc3Bhbj4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29weVRleHRUb0NsaXBib2FyZChKU09OLnN0cmluZ2lmeSh0aGlzLnByb2R1Y3RzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvZHVjdHNSZW5kZXIodGhpcy5wcm9kdWN0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByb2R1Y3RSZXByZXNlbnRhdGlvbihwcm9kdWN0TWF0Y2hlcykge1xuICAgICAgICBjb25zdCBwcm9kdWN0cyA9IHt9O1xuICAgICAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocHJvZHVjdE1hdGNoZXMpKSB7XG4gICAgICAgICAgICBwcm9kdWN0c1trZXldID0ge1xuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiB2YWx1ZS5wcm9kdWN0LmNhdGVnb3J5LFxuICAgICAgICAgICAgICAgIHVybHM6IHZhbHVlLnVybHNcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzO1xuICAgIH1cblxuICAgIGdldEhvc3ROYW1lKGhyZWYpIHtcbiAgICAgICAgY29uc3QgbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBsLmhyZWYgPSBocmVmO1xuICAgICAgICByZXR1cm4gbC5ob3N0bmFtZTtcbiAgICB9XG5cbiAgICBjb3B5VGV4dFRvQ2xpcGJvYXJkKHRleHQpIHtcbiAgICAgICAgY29uc3QgY29weUZyb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XG4gICAgICAgIGNvcHlGcm9tLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb3B5RnJvbSk7XG4gICAgICAgIGNvcHlGcm9tLnNlbGVjdCgpO1xuICAgICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICAgICAgICBjb3B5RnJvbS5ibHVyKCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoY29weUZyb20pO1xuICAgIH1cblxuICAgIGNhdGVnb3J5UmVwcmVzZW50YXRpb24ocHJvZHVjdE1hdGNoZXMpIHtcbiAgICAgICAgY29uc3QgcHJvZHVjdHMgPSB7fTtcbiAgICAgICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHByb2R1Y3RNYXRjaGVzKSkge1xuICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnkgPSB2YWx1ZS5wcm9kdWN0ICYmIHZhbHVlLnByb2R1Y3QuY2F0ZWdvcnk7XG4gICAgICAgICAgICBpZiAoY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXByb2R1Y3RzW2NhdGVnb3J5XSkge1xuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0c1tjYXRlZ29yeV0gPSB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcm9kdWN0c1tjYXRlZ29yeV1ba2V5XSA9IHZhbHVlLnVybHM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb2R1Y3RzO1xuICAgIH1cblxuXG4gICAgYXR0YWNoU29ydExpc3RlbmVyKCkge1xuICAgICAgICBjb25zdCBzb3J0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zb3J0Jyk7XG4gICAgICAgIGlmIChzb3J0RWxlbWVudCkge1xuICAgICAgICAgICAgc29ydEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc29ydEJ5UHJvZHVjdCA9ICF0aGlzLnNvcnRCeVByb2R1Y3Q7XG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtzb3J0QnlQcm9kdWN0OiB0aGlzLnNvcnRCeVByb2R1Y3R9KTtcbiAgICAgICAgICAgICAgICBsZXQgcHJvZHVjdHM7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnNvcnRCeVByb2R1Y3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvZHVjdHMgPSB0aGlzLmNhdGVnb3J5UmVwcmVzZW50YXRpb24odGhpcy5wcm9kdWN0TWF0Y2hlcyk7XG4gICAgICAgICAgICAgICAgICAgIHNvcnRFbGVtZW50LmlubmVySFRNTCA9ICc8aSBjbGFzcz1cImZhcyBmYS1maWx0ZXJcIj48L2k+IFNvcnQgYnkgUHJvZHVjdDwvc3Bhbj4nO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2R1Y3RzID0gdGhpcy5wcm9kdWN0UmVwcmVzZW50YXRpb24odGhpcy5wcm9kdWN0TWF0Y2hlcyk7XG4gICAgICAgICAgICAgICAgICAgIHNvcnRFbGVtZW50LmlubmVySFRNTCA9ICc8aSBjbGFzcz1cImZhcyBmYS1maWx0ZXJcIj48L2k+IFNvcnQgYnkgQ2F0ZWdvcnk8L3NwYW4+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndWktdHJlZXZpZXcnKS5kaXNwbGF5KHByb2R1Y3RzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG59IiwiaW1wb3J0IHtQb3B1cH0gZnJvbSBcIi4uL1BvcHVwXCI7XG5jb25zdCBwb3B1cCA9IG5ldyBQb3B1cCgpOyJdLCJzb3VyY2VSb290IjoiIn0=