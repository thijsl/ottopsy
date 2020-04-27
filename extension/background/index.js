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


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var App = /*#__PURE__*/function () {
  function App() {
    _classCallCheck(this, App);
  }

  _createClass(App, null, [{
    key: "init",
    value: function init() {
      chrome.runtime.onInstalled.addListener(function () {
        chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
          chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({//pageUrl: {hostEquals: '*.*.*'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
          }]);
        });
      });
      var initiators = {};
      var allInitiators = {};

      function getRootInitiator(details) {
        var currentParentId = details.parentFrameId;
        var currentInitiator = details.initiator;

        while (currentParentId != -1) {
          details = allInitiators[currentParentId];

          if (details) {
            currentParentId = details.parentFrameId;
            currentInitiator = details.initiator;
          } else {
            console.warn("details is undefined at", currentParentId, allInitiators);
            currentParentId = -1;
          }
        }

        return currentInitiator;
      }

      var onBeforeRequestListener = function onBeforeRequestListener(details) {
        var url = details.url;
        allInitiators[details.frameId] = {
          initiator: details.initiator,
          parentFrameId: details.parentFrameId
        };
        process(_Util__WEBPACK_IMPORTED_MODULE_1__["Util"].getHostName(getRootInitiator(details)), url);
      };

      function createInitiatorIfNeeded(initiators, initiator, product) {
        if (!initiators[initiator]) {
          initiators[initiator] = {};
        }

        if (!initiators[initiator][product.category]) {
          initiators[initiator][product.category] = {};
        }

        if (!initiators[initiator][product.category][product.name]) {
          initiators[initiator][product.category][product.name] = {
            status: 'unknown',
            url: []
          };
        }
      }

      function isUrlNotYetAdded(initiators, initiator, product, url) {
        return initiators[initiator][product.category][product.name].url.indexOf(url) < 0;
      }

      var process = function process(initiator, url) {
        products.forEach(function (product) {
          if (product.isMatch(url)) {
            createInitiatorIfNeeded(initiators, initiator, product);
            initiators[initiator][product.category][product.name].status = true;

            if (isUrlNotYetAdded(initiators, initiator, product, url)) {
              if (initiators[initiator][product.category][product.name].url.length < 10) {
                initiators[initiator][product.category][product.name].url.push(url);
                chrome.storage.local.set({
                  comps: initiators
                }, function () {
                  console.log('Updated components:', product.name, url);
                });
              }

              if (product.name == "dash" || product.name == "hls") {
                fetch(url).then(function (response) {
                  return response.text();
                }).then(function (text) {
                  var packagers = _Product__WEBPACK_IMPORTED_MODULE_0__["Product"].getProductsByCategory(products, "packager");
                  packagers.forEach(function (packager) {
                    var packagerMatch = packager.isMatch(text);

                    if (packagerMatch) {
                      if (!initiators[initiator].packager) {
                        initiators[initiator].packager = {};
                      }

                      initiators[initiator].packager[[packager.name]] = {
                        "status": true
                      };
                      chrome.storage.local.set({
                        comps: initiators
                      }, function () {
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

      var url = chrome.runtime.getURL('data/patterns.json');
      var products = [];
      fetch(url).then(function (response) {
        return response.json();
      }) //assuming file contains json
      .then(function (json) {
        _Product__WEBPACK_IMPORTED_MODULE_0__["Product"].initProducts(products, json);
        chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeRequestListener, {
          urls: ["<all_urls>"]
        });
      });
    }
  }]);

  return App;
}();

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
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Product = /*#__PURE__*/function () {
  function Product(product, category) {
    _classCallCheck(this, Product);

    this.name = product.name;
    this.patterns = product.patterns;
    this.category = category;
  }

  _createClass(Product, [{
    key: "isMatch",
    value: function isMatch(url) {
      var match = false;

      for (var i = 0; i < this.patterns.length && !match; i++) {
        match = url.indexOf(this.patterns[i].key) > -1;
      }

      return match;
    }
  }], [{
    key: "initProducts",
    value: function initProducts(products, json) {
      for (var i = 0; i < json.length; i++) {
        var component = json[i];
        var componentTypes = component.types;

        for (var j = 0; j < componentTypes.length; j++) {
          var componentType = componentTypes[j];
          var product = new Product(componentType, component.name);
          products.push(product);
        }
      }

      return products;
    }
  }, {
    key: "getProductsByCategory",
    value: function getProductsByCategory(products, category) {
      return products.filter(function (product) {
        return product.category == category;
      });
    }
  }]);

  return Product;
}();

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
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Util = /*#__PURE__*/function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, null, [{
    key: "getHostName",
    value: function getHostName(href) {
      var l = document.createElement("a");
      l.href = href;
      return l.hostname;
    }
  }]);

  return Util;
}();

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

_App__WEBPACK_IMPORTED_MODULE_0__["App"].init();

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUHJvZHVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvVXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiQXBwIiwiY2hyb21lIiwicnVudGltZSIsIm9uSW5zdGFsbGVkIiwiYWRkTGlzdGVuZXIiLCJkZWNsYXJhdGl2ZUNvbnRlbnQiLCJvblBhZ2VDaGFuZ2VkIiwicmVtb3ZlUnVsZXMiLCJ1bmRlZmluZWQiLCJhZGRSdWxlcyIsImNvbmRpdGlvbnMiLCJQYWdlU3RhdGVNYXRjaGVyIiwiYWN0aW9ucyIsIlNob3dQYWdlQWN0aW9uIiwiaW5pdGlhdG9ycyIsImFsbEluaXRpYXRvcnMiLCJnZXRSb290SW5pdGlhdG9yIiwiZGV0YWlscyIsImN1cnJlbnRQYXJlbnRJZCIsInBhcmVudEZyYW1lSWQiLCJjdXJyZW50SW5pdGlhdG9yIiwiaW5pdGlhdG9yIiwiY29uc29sZSIsIndhcm4iLCJvbkJlZm9yZVJlcXVlc3RMaXN0ZW5lciIsInVybCIsImZyYW1lSWQiLCJwcm9jZXNzIiwiVXRpbCIsImdldEhvc3ROYW1lIiwiY3JlYXRlSW5pdGlhdG9ySWZOZWVkZWQiLCJwcm9kdWN0IiwiY2F0ZWdvcnkiLCJuYW1lIiwic3RhdHVzIiwiaXNVcmxOb3RZZXRBZGRlZCIsImluZGV4T2YiLCJwcm9kdWN0cyIsImZvckVhY2giLCJpc01hdGNoIiwibGVuZ3RoIiwicHVzaCIsInN0b3JhZ2UiLCJsb2NhbCIsInNldCIsImNvbXBzIiwibG9nIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJ0ZXh0IiwicGFja2FnZXJzIiwiUHJvZHVjdCIsImdldFByb2R1Y3RzQnlDYXRlZ29yeSIsInBhY2thZ2VyIiwicGFja2FnZXJNYXRjaCIsImdldFVSTCIsImpzb24iLCJpbml0UHJvZHVjdHMiLCJ3ZWJSZXF1ZXN0Iiwib25CZWZvcmVTZW5kSGVhZGVycyIsInVybHMiLCJwYXR0ZXJucyIsIm1hdGNoIiwiaSIsImtleSIsImNvbXBvbmVudCIsImNvbXBvbmVudFR5cGVzIiwidHlwZXMiLCJqIiwiY29tcG9uZW50VHlwZSIsImZpbHRlciIsImhyZWYiLCJsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaG9zdG5hbWUiLCJpbml0Il0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQWE7Ozs7Ozs7O0FBRWI7QUFDQTtBQUVPLElBQU1BLEdBQWI7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBLDJCQUNrQjtBQUNWQyxZQUFNLENBQUNDLE9BQVAsQ0FBZUMsV0FBZixDQUEyQkMsV0FBM0IsQ0FBdUMsWUFBWTtBQUMvQ0gsY0FBTSxDQUFDSSxrQkFBUCxDQUEwQkMsYUFBMUIsQ0FBd0NDLFdBQXhDLENBQW9EQyxTQUFw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U0EsSUFBVDtBQUNBLGFBQU9DLENBQUMsQ0FBQ0csUUFBVDtBQUNIO0FBTEw7O0FBQUE7QUFBQSxJOzs7Ozs7Ozs7Ozs7QUNBQTtBQUFBO0FBQUE7QUFDQTVFLHdDQUFHLENBQUM2RSxJQUFKLEciLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtQcm9kdWN0fSBmcm9tIFwiLi9Qcm9kdWN0XCI7XG5pbXBvcnQge1V0aWx9IGZyb20gXCIuL1V0aWxcIjtcblxuZXhwb3J0IGNsYXNzIEFwcCB7XG4gICAgc3RhdGljIGluaXQoKSB7XG4gICAgICAgIGNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNocm9tZS5kZWNsYXJhdGl2ZUNvbnRlbnQub25QYWdlQ2hhbmdlZC5yZW1vdmVSdWxlcyh1bmRlZmluZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50Lm9uUGFnZUNoYW5nZWQuYWRkUnVsZXMoW3tcbiAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uczogW25ldyBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50LlBhZ2VTdGF0ZU1hdGNoZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9wYWdlVXJsOiB7aG9zdEVxdWFsczogJyouKi4qJ30sXG4gICAgICAgICAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uczogW25ldyBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50LlNob3dQYWdlQWN0aW9uKCldXG4gICAgICAgICAgICAgICAgfV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBpbml0aWF0b3JzID0ge307XG5cbiAgICAgICAgdmFyIGFsbEluaXRpYXRvcnMgPSB7XG5cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBnZXRSb290SW5pdGlhdG9yKGRldGFpbHMpIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50UGFyZW50SWQgPSBkZXRhaWxzLnBhcmVudEZyYW1lSWQ7XG4gICAgICAgICAgICBsZXQgY3VycmVudEluaXRpYXRvciA9IGRldGFpbHMuaW5pdGlhdG9yO1xuICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnRQYXJlbnRJZCAhPSAtMSkge1xuICAgICAgICAgICAgICAgIGRldGFpbHMgPSBhbGxJbml0aWF0b3JzW2N1cnJlbnRQYXJlbnRJZF07XG4gICAgICAgICAgICAgICAgaWYgKGRldGFpbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBhcmVudElkID0gZGV0YWlscy5wYXJlbnRGcmFtZUlkO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50SW5pdGlhdG9yID0gZGV0YWlscy5pbml0aWF0b3I7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiZGV0YWlscyBpcyB1bmRlZmluZWQgYXRcIiwgY3VycmVudFBhcmVudElkLCBhbGxJbml0aWF0b3JzKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFBhcmVudElkID0gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRJbml0aWF0b3I7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgb25CZWZvcmVSZXF1ZXN0TGlzdGVuZXIgPSBmdW5jdGlvbiAoZGV0YWlscykge1xuICAgICAgICAgICAgbGV0IHVybCA9IGRldGFpbHMudXJsO1xuICAgICAgICAgICAgYWxsSW5pdGlhdG9yc1tkZXRhaWxzLmZyYW1lSWRdID0ge1xuICAgICAgICAgICAgICAgIGluaXRpYXRvcjogZGV0YWlscy5pbml0aWF0b3IsXG4gICAgICAgICAgICAgICAgcGFyZW50RnJhbWVJZDogZGV0YWlscy5wYXJlbnRGcmFtZUlkXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcHJvY2VzcyhVdGlsLmdldEhvc3ROYW1lKGdldFJvb3RJbml0aWF0b3IoZGV0YWlscykpLCB1cmwpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUluaXRpYXRvcklmTmVlZGVkKGluaXRpYXRvcnMsIGluaXRpYXRvciwgcHJvZHVjdCkge1xuICAgICAgICAgICAgaWYgKCFpbml0aWF0b3JzW2luaXRpYXRvcl0pIHtcbiAgICAgICAgICAgICAgICBpbml0aWF0b3JzW2luaXRpYXRvcl0gPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaW5pdGlhdG9yc1tpbml0aWF0b3JdW3Byb2R1Y3QuY2F0ZWdvcnldKSB7XG4gICAgICAgICAgICAgICAgaW5pdGlhdG9yc1tpbml0aWF0b3JdW3Byb2R1Y3QuY2F0ZWdvcnldID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWluaXRpYXRvcnNbaW5pdGlhdG9yXVtwcm9kdWN0LmNhdGVnb3J5XVtwcm9kdWN0Lm5hbWVdKSB7XG4gICAgICAgICAgICAgICAgaW5pdGlhdG9yc1tpbml0aWF0b3JdW3Byb2R1Y3QuY2F0ZWdvcnldW3Byb2R1Y3QubmFtZV0gPSB7c3RhdHVzOiAndW5rbm93bicsIHVybDogW119O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gaXNVcmxOb3RZZXRBZGRlZChpbml0aWF0b3JzLCBpbml0aWF0b3IsIHByb2R1Y3QsIHVybCkge1xuICAgICAgICAgICAgcmV0dXJuIChpbml0aWF0b3JzW2luaXRpYXRvcl1bcHJvZHVjdC5jYXRlZ29yeV1bcHJvZHVjdC5uYW1lXS51cmwuaW5kZXhPZih1cmwpIDwgMCk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcHJvY2VzcyA9IGZ1bmN0aW9uIChpbml0aWF0b3IsIHVybCkge1xuICAgICAgICAgICAgcHJvZHVjdHMuZm9yRWFjaCgocHJvZHVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwcm9kdWN0LmlzTWF0Y2godXJsKSkge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVJbml0aWF0b3JJZk5lZWRlZChpbml0aWF0b3JzLCBpbml0aWF0b3IsIHByb2R1Y3QpO1xuICAgICAgICAgICAgICAgICAgICBpbml0aWF0b3JzW2luaXRpYXRvcl1bcHJvZHVjdC5jYXRlZ29yeV1bcHJvZHVjdC5uYW1lXS5zdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNVcmxOb3RZZXRBZGRlZChpbml0aWF0b3JzLCBpbml0aWF0b3IsIHByb2R1Y3QsIHVybCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbml0aWF0b3JzW2luaXRpYXRvcl1bcHJvZHVjdC5jYXRlZ29yeV1bcHJvZHVjdC5uYW1lXS51cmwubGVuZ3RoIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWF0b3JzW2luaXRpYXRvcl1bcHJvZHVjdC5jYXRlZ29yeV1bcHJvZHVjdC5uYW1lXS51cmwucHVzaCh1cmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7Y29tcHM6IGluaXRpYXRvcnN9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVcGRhdGVkIGNvbXBvbmVudHM6JywgcHJvZHVjdC5uYW1lLCB1cmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvZHVjdC5uYW1lID09IFwiZGFzaFwiIHx8IHByb2R1Y3QubmFtZSA9PSBcImhsc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2godXJsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh0ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlcnMgPSBQcm9kdWN0LmdldFByb2R1Y3RzQnlDYXRlZ29yeShwcm9kdWN0cywgXCJwYWNrYWdlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhY2thZ2Vycy5mb3JFYWNoKChwYWNrYWdlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhY2thZ2VyTWF0Y2ggPSBwYWNrYWdlci5pc01hdGNoKHRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYWNrYWdlck1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5pdGlhdG9yc1tpbml0aWF0b3JdLnBhY2thZ2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWF0b3JzW2luaXRpYXRvcl0ucGFja2FnZXIgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbml0aWF0b3JzW2luaXRpYXRvcl0ucGFja2FnZXJbW3BhY2thZ2VyLm5hbWVdXSA9IHtcInN0YXR1c1wiOiB0cnVlfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHtjb21wczogaW5pdGlhdG9yc30sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdVcGRhdGVkIGNvbXBvbmVudHM6JywgcHJvZHVjdC5uYW1lLCBcIndpdGhcIiwgcGFja2FnZXIubmFtZSwgXCJmb3JcIiwgdXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHVybCA9IGNocm9tZS5ydW50aW1lLmdldFVSTCgnZGF0YS9wYXR0ZXJucy5qc29uJyk7XG4gICAgICAgIGNvbnN0IHByb2R1Y3RzID0gW107XG5cbiAgICAgICAgZmV0Y2godXJsKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpIC8vYXNzdW1pbmcgZmlsZSBjb250YWlucyBqc29uXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgICAgIFByb2R1Y3QuaW5pdFByb2R1Y3RzKHByb2R1Y3RzLCBqc29uKTtcbiAgICAgICAgICAgICAgICBjaHJvbWUud2ViUmVxdWVzdC5vbkJlZm9yZVNlbmRIZWFkZXJzLmFkZExpc3RlbmVyKG9uQmVmb3JlUmVxdWVzdExpc3RlbmVyLCB7dXJsczogW1wiPGFsbF91cmxzPlwiXX0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIFByb2R1Y3Qge1xuICAgIGNvbnN0cnVjdG9yKHByb2R1Y3QsIGNhdGVnb3J5KSB7XG4gICAgICAgIHRoaXMubmFtZSA9IHByb2R1Y3QubmFtZTtcbiAgICAgICAgdGhpcy5wYXR0ZXJucyA9IHByb2R1Y3QucGF0dGVybnM7XG4gICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcbiAgICB9XG4gICAgaXNNYXRjaCh1cmwpIHtcbiAgICAgICAgbGV0IG1hdGNoID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IHRoaXMucGF0dGVybnMubGVuZ3RoKSAmJiAhbWF0Y2g7IGkrKykge1xuICAgICAgICAgICAgbWF0Y2ggPSAodXJsLmluZGV4T2YodGhpcy5wYXR0ZXJuc1tpXS5rZXkpID4gLTEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9XG4gICAgc3RhdGljIGluaXRQcm9kdWN0cyhwcm9kdWN0cywganNvbikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGpzb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGpzb25baV07XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnRUeXBlcyA9IGNvbXBvbmVudC50eXBlcztcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29tcG9uZW50VHlwZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRUeXBlID0gY29tcG9uZW50VHlwZXNbal07XG4gICAgICAgICAgICAgICAgbGV0IHByb2R1Y3QgPSBuZXcgUHJvZHVjdChjb21wb25lbnRUeXBlLCBjb21wb25lbnQubmFtZSk7XG4gICAgICAgICAgICAgICAgcHJvZHVjdHMucHVzaChwcm9kdWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvZHVjdHM7XG4gICAgfVxuICAgIHN0YXRpYyBnZXRQcm9kdWN0c0J5Q2F0ZWdvcnkocHJvZHVjdHMsIGNhdGVnb3J5KSB7XG4gICAgICAgIHJldHVybiBwcm9kdWN0cy5maWx0ZXIoKHByb2R1Y3QpID0+IHtyZXR1cm4gKHByb2R1Y3QuY2F0ZWdvcnkgPT0gY2F0ZWdvcnkpfSlcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIFV0aWwge1xuICAgIHN0YXRpYyBnZXRIb3N0TmFtZShocmVmKSB7XG4gICAgICAgIGNvbnN0IGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgbC5ocmVmID0gaHJlZjtcbiAgICAgICAgcmV0dXJuIGwuaG9zdG5hbWU7XG4gICAgfVxufSIsImltcG9ydCB7QXBwfSBmcm9tIFwiLi9BcHBcIjtcbkFwcC5pbml0KCk7Il0sInNvdXJjZVJvb3QiOiIifQ==