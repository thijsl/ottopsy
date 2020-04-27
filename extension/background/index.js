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

    this.initiators = {};
    this.allInitiators = {};
    this.products = [];
  }

  _createClass(App, [{
    key: "init",
    value: function init() {
      var _this = this;

      var _self = this;

      chrome.runtime.onInstalled.addListener(function () {
        chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
          chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({//pageUrl: {hostEquals: '*.*.*'},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
          }]);
        });
      });
      var url = chrome.runtime.getURL('data/patterns.json');
      var products = [];
      fetch(url).then(function (response) {
        return response.json();
      }) //assuming file contains json
      .then(function (json) {
        _this.products = _Product__WEBPACK_IMPORTED_MODULE_0__["Product"].initProducts(products, json);

        var onBeforeRequestListener = function onBeforeRequestListener(details) {
          var url = details.url;
          _this.allInitiators[details.frameId] = {
            initiator: details.initiator,
            parentFrameId: details.parentFrameId
          };

          _this.process(_Util__WEBPACK_IMPORTED_MODULE_1__["Util"].getHostName(_this.getRootInitiator(details)), url);
        };

        chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeRequestListener, {
          urls: ["<all_urls>"]
        });
      });
    }
  }, {
    key: "getRootInitiator",
    value: function getRootInitiator(details) {
      var currentParentId = details.parentFrameId;
      var currentInitiator = details.initiator;

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
  }, {
    key: "createInitiatorIfNeeded",
    value: function createInitiatorIfNeeded(initiators, initiator, product) {
      if (!this.initiators[initiator]) {
        this.initiators[initiator] = {};
      }

      if (!this.initiators[initiator][product.category]) {
        this.initiators[initiator][product.category] = {};
      }

      if (!this.initiators[initiator][product.category][product.name]) {
        this.initiators[initiator][product.category][product.name] = {
          status: 'unknown',
          url: []
        };
      }
    }
  }, {
    key: "isUrlNotYetAdded",
    value: function isUrlNotYetAdded(initiators, initiator, product, url) {
      return this.initiators[initiator][product.category][product.name].url.indexOf(url) < 0;
    }
  }, {
    key: "process",
    value: function process(initiator, url) {
      var _this2 = this;

      this.products.forEach(function (product) {
        if (product.isMatch(url)) {
          _this2.createInitiatorIfNeeded(_this2.initiators, initiator, product);

          _this2.initiators[initiator][product.category][product.name].status = true;

          if (_this2.isUrlNotYetAdded(_this2.initiators, initiator, product, url)) {
            if (_this2.initiators[initiator][product.category][product.name].url.length < 10) {
              _this2.initiators[initiator][product.category][product.name].url.push(url);

              chrome.storage.local.set({
                comps: _this2.initiators
              }, function () {
                console.log('Updated components:', product.name, url);
              });
            }

            if (product.name == "dash" || product.name == "hls") {
              fetch(url).then(function (response) {
                return response.text();
              }).then(function (text) {
                var packagers = _Product__WEBPACK_IMPORTED_MODULE_0__["Product"].getProductsByCategory(_this2.products, "packager");
                packagers.forEach(function (packager) {
                  var packagerMatch = packager.isMatch(text);

                  if (packagerMatch) {
                    if (!_this2.initiators[initiator].packager) {
                      _this2.initiators[initiator].packager = {};
                    }

                    _this2.initiators[initiator].packager[[packager.name]] = {
                      "status": true
                    };
                    chrome.storage.local.set({
                      comps: _this2.initiators
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

var app = new _App__WEBPACK_IMPORTED_MODULE_0__["App"]();
app.init();

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUHJvZHVjdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvVXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiQXBwIiwiaW5pdGlhdG9ycyIsImFsbEluaXRpYXRvcnMiLCJwcm9kdWN0cyIsIl9zZWxmIiwiY2hyb21lIiwicnVudGltZSIsIm9uSW5zdGFsbGVkIiwiYWRkTGlzdGVuZXIiLCJkZWNsYXJhdGl2ZUNvbnRlbnQiLCJvblBhZ2VDaGFuZ2VkIiwicmVtb3ZlUnVsZXMiLCJ1bmRlZmluZWQiLCJhZGRSdWxlcyIsImNvbmRpdGlvbnMiLCJQYWdlU3RhdGVNYXRjaGVyIiwiYWN0aW9ucyIsIlNob3dQYWdlQWN0aW9uIiwidXJsIiwiZ2V0VVJMIiwiZmV0Y2giLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwiUHJvZHVjdCIsImluaXRQcm9kdWN0cyIsIm9uQmVmb3JlUmVxdWVzdExpc3RlbmVyIiwiZGV0YWlscyIsImZyYW1lSWQiLCJpbml0aWF0b3IiLCJwYXJlbnRGcmFtZUlkIiwicHJvY2VzcyIsIlV0aWwiLCJnZXRIb3N0TmFtZSIsImdldFJvb3RJbml0aWF0b3IiLCJ3ZWJSZXF1ZXN0Iiwib25CZWZvcmVTZW5kSGVhZGVycyIsInVybHMiLCJjdXJyZW50UGFyZW50SWQiLCJjdXJyZW50SW5pdGlhdG9yIiwiY29uc29sZSIsIndhcm4iLCJwcm9kdWN0IiwiY2F0ZWdvcnkiLCJuYW1lIiwic3RhdHVzIiwiaW5kZXhPZiIsImZvckVhY2giLCJpc01hdGNoIiwiY3JlYXRlSW5pdGlhdG9ySWZOZWVkZWQiLCJpc1VybE5vdFlldEFkZGVkIiwibGVuZ3RoIiwicHVzaCIsInN0b3JhZ2UiLCJsb2NhbCIsInNldCIsImNvbXBzIiwibG9nIiwidGV4dCIsInBhY2thZ2VycyIsImdldFByb2R1Y3RzQnlDYXRlZ29yeSIsInBhY2thZ2VyIiwicGFja2FnZXJNYXRjaCIsInBhdHRlcm5zIiwibWF0Y2giLCJpIiwia2V5IiwiY29tcG9uZW50IiwiY29tcG9uZW50VHlwZXMiLCJ0eXBlcyIsImoiLCJjb21wb25lbnRUeXBlIiwiZmlsdGVyIiwiaHJlZiIsImwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJob3N0bmFtZSIsImFwcCIsImluaXQiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQUE7QUFBYTs7Ozs7Ozs7QUFFYjtBQUNBO0FBRU8sSUFBTUEsR0FBYjtBQUVJLGlCQUFjO0FBQUE7O0FBQ1YsU0FBS0MsVUFBTCxHQUFrQixFQUFsQjtBQUNBLFNBQUtDLGFBQUwsR0FBcUIsRUFBckI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0g7O0FBTkw7QUFBQTtBQUFBLDJCQVFXO0FBQUE7O0FBQ0gsVUFB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eUIyQ3dDLFFBekIzQyxFQXlCcUQ7QUFDN0MsYUFBT3hDLFFBQVEsQ0FBQ3FFLE1BQVQsQ0FBZ0IsVUFBQzlCLE9BQUQsRUFBYTtBQUFDLGVBQVFBLE9BQU8sQ0FBQ0MsUUFBUixJQUFvQkEsUUFBNUI7QUFBc0MsT0FBcEUsQ0FBUDtBQUNIO0FBM0JMOztBQUFBO0FBQUEsSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBTyxJQUFNWCxJQUFiO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSxnQ0FDdUJ5QyxJQUR2QixFQUM2QjtBQUNyQixVQUFNQyxDQUFDLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixHQUF2QixDQUFWO0FBQ0FGLE9BQUMsQ0FBQ0QsSUFBRixHQUFTQSxJQUFUO0FBQ0EsYUFBT0MsQ0FBQyxDQUFDRyxRQUFUO0FBQ0g7QUFMTDs7QUFBQTtBQUFBLEk7Ozs7Ozs7Ozs7OztBQ0FBO0FBQUE7QUFBQTtBQUNBLElBQU1DLEdBQUcsR0FBRyxJQUFJOUUsd0NBQUosRUFBWjtBQUNBOEUsR0FBRyxDQUFDQyxJQUFKLEciLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtQcm9kdWN0fSBmcm9tIFwiLi9Qcm9kdWN0XCI7XG5pbXBvcnQge1V0aWx9IGZyb20gXCIuL1V0aWxcIjtcblxuZXhwb3J0IGNsYXNzIEFwcCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5pbml0aWF0b3JzID0ge307XG4gICAgICAgIHRoaXMuYWxsSW5pdGlhdG9ycyA9IHt9O1xuICAgICAgICB0aGlzLnByb2R1Y3RzID0gW107XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgY29uc3QgX3NlbGYgPSB0aGlzO1xuICAgICAgICBjaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaHJvbWUuZGVjbGFyYXRpdmVDb250ZW50Lm9uUGFnZUNoYW5nZWQucmVtb3ZlUnVsZXModW5kZWZpbmVkLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5vblBhZ2VDaGFuZ2VkLmFkZFJ1bGVzKFt7XG4gICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbnM6IFtuZXcgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5QYWdlU3RhdGVNYXRjaGVyKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vcGFnZVVybDoge2hvc3RFcXVhbHM6ICcqLiouKid9LFxuICAgICAgICAgICAgICAgICAgICB9KV0sXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnM6IFtuZXcgY2hyb21lLmRlY2xhcmF0aXZlQ29udGVudC5TaG93UGFnZUFjdGlvbigpXVxuICAgICAgICAgICAgICAgIH1dKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCB1cmwgPSBjaHJvbWUucnVudGltZS5nZXRVUkwoJ2RhdGEvcGF0dGVybnMuanNvbicpO1xuICAgICAgICBjb25zdCBwcm9kdWN0cyA9IFtdO1xuXG4gICAgICAgIGZldGNoKHVybClcbiAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKSAvL2Fzc3VtaW5nIGZpbGUgY29udGFpbnMganNvblxuICAgICAgICAgICAgLnRoZW4oKGpzb24pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2R1Y3RzID0gUHJvZHVjdC5pbml0UHJvZHVjdHMocHJvZHVjdHMsIGpzb24pO1xuICAgICAgICAgICAgICAgIGxldCBvbkJlZm9yZVJlcXVlc3RMaXN0ZW5lciA9IChkZXRhaWxzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB1cmwgPSBkZXRhaWxzLnVybDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGxJbml0aWF0b3JzW2RldGFpbHMuZnJhbWVJZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0aWF0b3I6IGRldGFpbHMuaW5pdGlhdG9yLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50RnJhbWVJZDogZGV0YWlscy5wYXJlbnRGcmFtZUlkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvY2VzcyhVdGlsLmdldEhvc3ROYW1lKHRoaXMuZ2V0Um9vdEluaXRpYXRvcihkZXRhaWxzKSksIHVybCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjaHJvbWUud2ViUmVxdWVzdC5vbkJlZm9yZVNlbmRIZWFkZXJzLmFkZExpc3RlbmVyKG9uQmVmb3JlUmVxdWVzdExpc3RlbmVyLCB7dXJsczogW1wiPGFsbF91cmxzPlwiXX0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBnZXRSb290SW5pdGlhdG9yKGRldGFpbHMpIHtcbiAgICAgICAgbGV0IGN1cnJlbnRQYXJlbnRJZCA9IGRldGFpbHMucGFyZW50RnJhbWVJZDtcbiAgICAgICAgbGV0IGN1cnJlbnRJbml0aWF0b3IgPSBkZXRhaWxzLmluaXRpYXRvcjtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRQYXJlbnRJZCAhPSAtMSkge1xuICAgICAgICAgICAgZGV0YWlscyA9IHRoaXMuYWxsSW5pdGlhdG9yc1tjdXJyZW50UGFyZW50SWRdO1xuICAgICAgICAgICAgaWYgKGRldGFpbHMpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFyZW50SWQgPSBkZXRhaWxzLnBhcmVudEZyYW1lSWQ7XG4gICAgICAgICAgICAgICAgY3VycmVudEluaXRpYXRvciA9IGRldGFpbHMuaW5pdGlhdG9yO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJkZXRhaWxzIGlzIHVuZGVmaW5lZCBhdFwiLCBjdXJyZW50UGFyZW50SWQsIHRoaXMuYWxsSW5pdGlhdG9ycyk7XG4gICAgICAgICAgICAgICAgY3VycmVudFBhcmVudElkID0gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1cnJlbnRJbml0aWF0b3I7XG4gICAgfVxuXG4gICAgY3JlYXRlSW5pdGlhdG9ySWZOZWVkZWQoaW5pdGlhdG9ycywgaW5pdGlhdG9yLCBwcm9kdWN0KSB7XG4gICAgICAgIGlmICghdGhpcy5pbml0aWF0b3JzW2luaXRpYXRvcl0pIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhdG9yc1tpbml0aWF0b3JdID0ge307XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmluaXRpYXRvcnNbaW5pdGlhdG9yXVtwcm9kdWN0LmNhdGVnb3J5XSkge1xuICAgICAgICAgICAgdGhpcy5pbml0aWF0b3JzW2luaXRpYXRvcl1bcHJvZHVjdC5jYXRlZ29yeV0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaW5pdGlhdG9yc1tpbml0aWF0b3JdW3Byb2R1Y3QuY2F0ZWdvcnldW3Byb2R1Y3QubmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhdG9yc1tpbml0aWF0b3JdW3Byb2R1Y3QuY2F0ZWdvcnldW3Byb2R1Y3QubmFtZV0gPSB7c3RhdHVzOiAndW5rbm93bicsIHVybDogW119O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNVcmxOb3RZZXRBZGRlZChpbml0aWF0b3JzLCBpbml0aWF0b3IsIHByb2R1Y3QsIHVybCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuaW5pdGlhdG9yc1tpbml0aWF0b3JdW3Byb2R1Y3QuY2F0ZWdvcnldW3Byb2R1Y3QubmFtZV0udXJsLmluZGV4T2YodXJsKSA8IDApO1xuICAgIH1cblxuICAgIHByb2Nlc3MoaW5pdGlhdG9yLCB1cmwpIHtcbiAgICAgICAgdGhpcy5wcm9kdWN0cy5mb3JFYWNoKChwcm9kdWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAocHJvZHVjdC5pc01hdGNoKHVybCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZUluaXRpYXRvcklmTmVlZGVkKHRoaXMuaW5pdGlhdG9ycywgaW5pdGlhdG9yLCBwcm9kdWN0KTtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRpYXRvcnNbaW5pdGlhdG9yXVtwcm9kdWN0LmNhdGVnb3J5XVtwcm9kdWN0Lm5hbWVdLnN0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNVcmxOb3RZZXRBZGRlZCh0aGlzLmluaXRpYXRvcnMsIGluaXRpYXRvciwgcHJvZHVjdCwgdXJsKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbml0aWF0b3JzW2luaXRpYXRvcl1bcHJvZHVjdC5jYXRlZ29yeV1bcHJvZHVjdC5uYW1lXS51cmwubGVuZ3RoIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhdG9yc1tpbml0aWF0b3JdW3Byb2R1Y3QuY2F0ZWdvcnldW3Byb2R1Y3QubmFtZV0udXJsLnB1c2godXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7Y29tcHM6IHRoaXMuaW5pdGlhdG9yc30sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVXBkYXRlZCBjb21wb25lbnRzOicsIHByb2R1Y3QubmFtZSwgdXJsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2R1Y3QubmFtZSA9PSBcImRhc2hcIiB8fCBwcm9kdWN0Lm5hbWUgPT0gXCJobHNcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2godXJsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHRleHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFja2FnZXJzID0gUHJvZHVjdC5nZXRQcm9kdWN0c0J5Q2F0ZWdvcnkodGhpcy5wcm9kdWN0cywgXCJwYWNrYWdlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFja2FnZXJzLmZvckVhY2goKHBhY2thZ2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWNrYWdlck1hdGNoID0gcGFja2FnZXIuaXNNYXRjaCh0ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYWNrYWdlck1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmluaXRpYXRvcnNbaW5pdGlhdG9yXS5wYWNrYWdlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYXRvcnNbaW5pdGlhdG9yXS5wYWNrYWdlciA9IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRpYXRvcnNbaW5pdGlhdG9yXS5wYWNrYWdlcltbcGFja2FnZXIubmFtZV1dID0ge1wic3RhdHVzXCI6IHRydWV9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLnNldCh7Y29tcHM6IHRoaXMuaW5pdGlhdG9yc30sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1VwZGF0ZWQgY29tcG9uZW50czonLCBwcm9kdWN0Lm5hbWUsIFwid2l0aFwiLCBwYWNrYWdlci5uYW1lLCBcImZvclwiLCB1cmwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG59IiwiZXhwb3J0IGNsYXNzIFByb2R1Y3Qge1xuICAgIGNvbnN0cnVjdG9yKHByb2R1Y3QsIGNhdGVnb3J5KSB7XG4gICAgICAgIHRoaXMubmFtZSA9IHByb2R1Y3QubmFtZTtcbiAgICAgICAgdGhpcy5wYXR0ZXJucyA9IHByb2R1Y3QucGF0dGVybnM7XG4gICAgICAgIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcbiAgICB9XG4gICAgaXNNYXRjaCh1cmwpIHtcbiAgICAgICAgbGV0IG1hdGNoID0gZmFsc2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyAoaSA8IHRoaXMucGF0dGVybnMubGVuZ3RoKSAmJiAhbWF0Y2g7IGkrKykge1xuICAgICAgICAgICAgbWF0Y2ggPSAodXJsLmluZGV4T2YodGhpcy5wYXR0ZXJuc1tpXS5rZXkpID4gLTEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9XG4gICAgc3RhdGljIGluaXRQcm9kdWN0cyhwcm9kdWN0cywganNvbikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGpzb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGpzb25baV07XG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnRUeXBlcyA9IGNvbXBvbmVudC50eXBlcztcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29tcG9uZW50VHlwZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb25lbnRUeXBlID0gY29tcG9uZW50VHlwZXNbal07XG4gICAgICAgICAgICAgICAgbGV0IHByb2R1Y3QgPSBuZXcgUHJvZHVjdChjb21wb25lbnRUeXBlLCBjb21wb25lbnQubmFtZSk7XG4gICAgICAgICAgICAgICAgcHJvZHVjdHMucHVzaChwcm9kdWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvZHVjdHM7XG4gICAgfVxuICAgIHN0YXRpYyBnZXRQcm9kdWN0c0J5Q2F0ZWdvcnkocHJvZHVjdHMsIGNhdGVnb3J5KSB7XG4gICAgICAgIHJldHVybiBwcm9kdWN0cy5maWx0ZXIoKHByb2R1Y3QpID0+IHtyZXR1cm4gKHByb2R1Y3QuY2F0ZWdvcnkgPT0gY2F0ZWdvcnkpfSlcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIFV0aWwge1xuICAgIHN0YXRpYyBnZXRIb3N0TmFtZShocmVmKSB7XG4gICAgICAgIGNvbnN0IGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgbC5ocmVmID0gaHJlZjtcbiAgICAgICAgcmV0dXJuIGwuaG9zdG5hbWU7XG4gICAgfVxufSIsImltcG9ydCB7QXBwfSBmcm9tIFwiLi9BcHBcIjtcbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmFwcC5pbml0KCk7Il0sInNvdXJjZVJvb3QiOiIifQ==