// storage.js :: higher level storage functions
// contains localforage.nopromises.min.js

var storage = (function() {

  /*!
      localForage -- Offline Storage, Improved
      Version 1.5.0
      https://localforage.github.io/localForage
      (c) 2013-2017 Mozilla, Apache License 2.0
  */
  !function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,b.localforage=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c||a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";function d(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function e(){try{if("undefined"!=typeof indexedDB)return indexedDB;if("undefined"!=typeof webkitIndexedDB)return webkitIndexedDB;if("undefined"!=typeof mozIndexedDB)return mozIndexedDB;if("undefined"!=typeof OIndexedDB)return OIndexedDB;if("undefined"!=typeof msIndexedDB)return msIndexedDB}catch(a){return}}function f(){try{if(!ja)return!1;var a="undefined"!=typeof openDatabase&&/(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent)&&!/Chrome/.test(navigator.userAgent)&&!/BlackBerry/.test(navigator.platform),b="function"==typeof fetch&&-1!==fetch.toString().indexOf("[native code");return(!a||b)&&"undefined"!=typeof indexedDB&&"undefined"!=typeof IDBKeyRange}catch(a){return!1}}function g(a,b){a=a||[],b=b||{};try{return new Blob(a,b)}catch(f){if("TypeError"!==f.name)throw f;for(var c="undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:WebKitBlobBuilder,d=new c,e=0;e<a.length;e+=1)d.append(a[e]);return d.getBlob(b.type)}}function h(a,b){b&&a.then(function(a){b(null,a)},function(a){b(a)})}function i(a,b,c){"function"==typeof b&&a.then(b),"function"==typeof c&&a.catch(c)}function j(a){return"string"!=typeof a&&(console.warn(a+" used as a key, but it is not a string."),a=String(a)),a}function k(a){for(var b=a.length,c=new ArrayBuffer(b),d=new Uint8Array(c),e=0;e<b;e++)d[e]=a.charCodeAt(e);return c}function l(a){return new ma(function(b){var c=a.transaction(na,qa),d=g([""]);c.objectStore(na).put(d,"key"),c.onabort=function(a){a.preventDefault(),a.stopPropagation(),b(!1)},c.oncomplete=function(){var a=navigator.userAgent.match(/Chrome\/(\d+)/),c=navigator.userAgent.match(/Edge\//);b(c||!a||parseInt(a[1],10)>=43)}}).catch(function(){return!1})}function m(a){return"boolean"==typeof ka?ma.resolve(ka):l(a).then(function(a){return ka=a})}function n(a){var b=la[a.name],c={};c.promise=new ma(function(a){c.resolve=a}),b.deferredOperations.push(c),b.dbReady?b.dbReady=b.dbReady.then(function(){return c.promise}):b.dbReady=c.promise}function o(a){var b=la[a.name],c=b.deferredOperations.pop();c&&c.resolve()}function p(a,b){var c=la[a.name],d=c.deferredOperations.pop();d&&d.reject(b)}function q(a,b){return new ma(function(c,d){if(a.db){if(!b)return c(a.db);n(a),a.db.close()}var e=[a.name];b&&e.push(a.version);var f=ja.open.apply(ja,e);b&&(f.onupgradeneeded=function(b){var c=f.result;try{c.createObjectStore(a.storeName),b.oldVersion<=1&&c.createObjectStore(na)}catch(c){if("ConstraintError"!==c.name)throw c;console.warn('The database "'+a.name+'" has been upgraded from version '+b.oldVersion+" to version "+b.newVersion+', but the storage "'+a.storeName+'" already exists.')}}),f.onerror=function(a){a.preventDefault(),d(f.error)},f.onsuccess=function(){c(f.result),o(a)}})}function r(a){return q(a,!1)}function s(a){return q(a,!0)}function t(a,b){if(!a.db)return!0;var c=!a.db.objectStoreNames.contains(a.storeName),d=a.version<a.db.version,e=a.version>a.db.version;if(d&&(a.version!==b&&console.warn('The database "'+a.name+"\" can't be downgraded from version "+a.db.version+" to version "+a.version+"."),a.version=a.db.version),e||c){if(c){var f=a.db.version+1;f>a.version&&(a.version=f)}return!0}return!1}function u(a){return new ma(function(b,c){var d=new FileReader;d.onerror=c,d.onloadend=function(c){var d=btoa(c.target.result||"");b({__local_forage_encoded_blob:!0,data:d,type:a.type})},d.readAsBinaryString(a)})}function v(a){return g([k(atob(a.data))],{type:a.type})}function w(a){return a&&a.__local_forage_encoded_blob}function x(a){var b=this,c=b._initReady().then(function(){var a=la[b._dbInfo.name];if(a&&a.dbReady)return a.dbReady});return i(c,a,a),c}function y(a){n(a);for(var b=la[a.name],c=b.forages,d=0;d<c.length;d++)c[d]._dbInfo.db&&(c[d]._dbInfo.db.close(),c[d]._dbInfo.db=null);return q(a,!1).then(function(a){for(var b=0;b<c.length;b++)c[b]._dbInfo.db=a}).catch(function(b){throw p(a,b),b})}function z(a,b,c){try{var d=a.db.transaction(a.storeName,b);c(null,d)}catch(d){if(!a.db||"InvalidStateError"===d.name)return y(a).then(function(){var d=a.db.transaction(a.storeName,b);c(null,d)});c(d)}}function A(a){function b(){return ma.resolve()}var c=this,d={db:null};if(a)for(var e in a)d[e]=a[e];la||(la={});var f=la[d.name];f||(f={forages:[],db:null,dbReady:null,deferredOperations:[]},la[d.name]=f),f.forages.push(c),c._initReady||(c._initReady=c.ready,c.ready=x);for(var g=[],h=0;h<f.forages.length;h++){var i=f.forages[h];i!==c&&g.push(i._initReady().catch(b))}var j=f.forages.slice(0);return ma.all(g).then(function(){return d.db=f.db,r(d)}).then(function(a){return d.db=a,t(d,c._defaultConfig.version)?s(d):a}).then(function(a){d.db=f.db=a,c._dbInfo=d;for(var b=0;b<j.length;b++){var e=j[b];e!==c&&(e._dbInfo.db=d.db,e._dbInfo.version=d.version)}})}function B(a,b){var c=this;a=j(a);var d=new ma(function(b,d){c.ready().then(function(){z(c._dbInfo,pa,function(e,f){if(e)return d(e);try{var g=f.objectStore(c._dbInfo.storeName),h=g.get(a);h.onsuccess=function(){var a=h.result;void 0===a&&(a=null),w(a)&&(a=v(a)),b(a)},h.onerror=function(){d(h.error)}}catch(a){d(a)}})}).catch(d)});return h(d,b),d}function C(a,b){var c=this,d=new ma(function(b,d){c.ready().then(function(){z(c._dbInfo,pa,function(e,f){if(e)return d(e);try{var g=f.objectStore(c._dbInfo.storeName),h=g.openCursor(),i=1;h.onsuccess=function(){var c=h.result;if(c){var d=c.value;w(d)&&(d=v(d));var e=a(d,c.key,i++);void 0!==e?b(e):c.continue()}else b()},h.onerror=function(){d(h.error)}}catch(a){d(a)}})}).catch(d)});return h(d,b),d}function D(a,b,c){var d=this;a=j(a);var e=new ma(function(c,e){var f;d.ready().then(function(){return f=d._dbInfo,"[object Blob]"===oa.call(b)?m(f.db).then(function(a){return a?b:u(b)}):b}).then(function(b){z(d._dbInfo,qa,function(f,g){if(f)return e(f);try{var h=g.objectStore(d._dbInfo.storeName),i=h.put(b,a);null===b&&(b=void 0),g.oncomplete=function(){void 0===b&&(b=null),c(b)},g.onabort=g.onerror=function(){var a=i.error?i.error:i.transaction.error;e(a)}}catch(a){e(a)}})}).catch(e)});return h(e,c),e}function E(a,b){var c=this;a=j(a);var d=new ma(function(b,d){c.ready().then(function(){z(c._dbInfo,qa,function(e,f){if(e)return d(e);try{var g=f.objectStore(c._dbInfo.storeName),h=g.delete(a);f.oncomplete=function(){b()},f.onerror=function(){d(h.error)},f.onabort=function(){var a=h.error?h.error:h.transaction.error;d(a)}}catch(a){d(a)}})}).catch(d)});return h(d,b),d}function F(a){var b=this,c=new ma(function(a,c){b.ready().then(function(){z(b._dbInfo,qa,function(d,e){if(d)return c(d);try{var f=e.objectStore(b._dbInfo.storeName),g=f.clear();e.oncomplete=function(){a()},e.onabort=e.onerror=function(){var a=g.error?g.error:g.transaction.error;c(a)}}catch(a){c(a)}})}).catch(c)});return h(c,a),c}function G(a){var b=this,c=new ma(function(a,c){b.ready().then(function(){z(b._dbInfo,pa,function(d,e){if(d)return c(d);try{var f=e.objectStore(b._dbInfo.storeName),g=f.count();g.onsuccess=function(){a(g.result)},g.onerror=function(){c(g.error)}}catch(a){c(a)}})}).catch(c)});return h(c,a),c}function H(a,b){var c=this,d=new ma(function(b,d){if(a<0)return void b(null);c.ready().then(function(){z(c._dbInfo,pa,function(e,f){if(e)return d(e);try{var g=f.objectStore(c._dbInfo.storeName),h=!1,i=g.openCursor();i.onsuccess=function(){var c=i.result;if(!c)return void b(null);0===a?b(c.key):h?b(c.key):(h=!0,c.advance(a))},i.onerror=function(){d(i.error)}}catch(a){d(a)}})}).catch(d)});return h(d,b),d}function I(a){var b=this,c=new ma(function(a,c){b.ready().then(function(){z(b._dbInfo,pa,function(d,e){if(d)return c(d);try{var f=e.objectStore(b._dbInfo.storeName),g=f.openCursor(),h=[];g.onsuccess=function(){var b=g.result;if(!b)return void a(h);h.push(b.key),b.continue()},g.onerror=function(){c(g.error)}}catch(a){c(a)}})}).catch(c)});return h(c,a),c}function J(){return"function"==typeof openDatabase}function K(a){var b,c,d,e,f,g=.75*a.length,h=a.length,i=0;"="===a[a.length-1]&&(g--,"="===a[a.length-2]&&g--);var j=new ArrayBuffer(g),k=new Uint8Array(j);for(b=0;b<h;b+=4)c=sa.indexOf(a[b]),d=sa.indexOf(a[b+1]),e=sa.indexOf(a[b+2]),f=sa.indexOf(a[b+3]),k[i++]=c<<2|d>>4,k[i++]=(15&d)<<4|e>>2,k[i++]=(3&e)<<6|63&f;return j}function L(a){var b,c=new Uint8Array(a),d="";for(b=0;b<c.length;b+=3)d+=sa[c[b]>>2],d+=sa[(3&c[b])<<4|c[b+1]>>4],d+=sa[(15&c[b+1])<<2|c[b+2]>>6],d+=sa[63&c[b+2]];return c.length%3==2?d=d.substring(0,d.length-1)+"=":c.length%3==1&&(d=d.substring(0,d.length-2)+"=="),d}function M(a,b){var c="";if(a&&(c=Ja.call(a)),a&&("[object ArrayBuffer]"===c||a.buffer&&"[object ArrayBuffer]"===Ja.call(a.buffer))){var d,e=va;a instanceof ArrayBuffer?(d=a,e+=xa):(d=a.buffer,"[object Int8Array]"===c?e+=za:"[object Uint8Array]"===c?e+=Aa:"[object Uint8ClampedArray]"===c?e+=Ba:"[object Int16Array]"===c?e+=Ca:"[object Uint16Array]"===c?e+=Ea:"[object Int32Array]"===c?e+=Da:"[object Uint32Array]"===c?e+=Fa:"[object Float32Array]"===c?e+=Ga:"[object Float64Array]"===c?e+=Ha:b(new Error("Failed to get type for BinaryArray"))),b(e+L(d))}else if("[object Blob]"===c){var f=new FileReader;f.onload=function(){var c=ta+a.type+"~"+L(this.result);b(va+ya+c)},f.readAsArrayBuffer(a)}else try{b(JSON.stringify(a))}catch(c){console.error("Couldn't convert value into a JSON string: ",a),b(null,c)}}function N(a){if(a.substring(0,wa)!==va)return JSON.parse(a);var b,c=a.substring(Ia),d=a.substring(wa,Ia);if(d===ya&&ua.test(c)){var e=c.match(ua);b=e[1],c=c.substring(e[0].length)}var f=K(c);switch(d){case xa:return f;case ya:return g([f],{type:b});case za:return new Int8Array(f);case Aa:return new Uint8Array(f);case Ba:return new Uint8ClampedArray(f);case Ca:return new Int16Array(f);case Ea:return new Uint16Array(f);case Da:return new Int32Array(f);case Fa:return new Uint32Array(f);case Ga:return new Float32Array(f);case Ha:return new Float64Array(f);default:throw new Error("Unkown type: "+d)}}function O(a){var b=this,c={db:null};if(a)for(var d in a)c[d]="string"!=typeof a[d]?a[d].toString():a[d];var e=new ma(function(a,d){try{c.db=openDatabase(c.name,String(c.version),c.description,c.size)}catch(a){return d(a)}c.db.transaction(function(e){e.executeSql("CREATE TABLE IF NOT EXISTS "+c.storeName+" (id INTEGER PRIMARY KEY, key unique, value)",[],function(){b._dbInfo=c,a()},function(a,b){d(b)})})});return c.serializer=Ka,e}function P(a,b){var c=this;a=j(a);var d=new ma(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){c.executeSql("SELECT * FROM "+e.storeName+" WHERE key = ? LIMIT 1",[a],function(a,c){var d=c.rows.length?c.rows.item(0).value:null;d&&(d=e.serializer.deserialize(d)),b(d)},function(a,b){d(b)})})}).catch(d)});return h(d,b),d}function Q(a,b){var c=this,d=new ma(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){c.executeSql("SELECT * FROM "+e.storeName,[],function(c,d){for(var f=d.rows,g=f.length,h=0;h<g;h++){var i=f.item(h),j=i.value;if(j&&(j=e.serializer.deserialize(j)),void 0!==(j=a(j,i.key,h+1)))return void b(j)}b()},function(a,b){d(b)})})}).catch(d)});return h(d,b),d}function R(a,b,c,d){var e=this;a=j(a);var f=new ma(function(f,g){e.ready().then(function(){void 0===b&&(b=null);var h=b,i=e._dbInfo;i.serializer.serialize(b,function(b,j){j?g(j):i.db.transaction(function(c){c.executeSql("INSERT OR REPLACE INTO "+i.storeName+" (key, value) VALUES (?, ?)",[a,b],function(){f(h)},function(a,b){g(b)})},function(b){if(b.code===b.QUOTA_ERR){if(d>0)return void f(R.apply(e,[a,h,c,d-1]));g(b)}})})}).catch(g)});return h(f,c),f}function S(a,b,c){return R.apply(this,[a,b,c,1])}function T(a,b){var c=this;a=j(a);var d=new ma(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){c.executeSql("DELETE FROM "+e.storeName+" WHERE key = ?",[a],function(){b()},function(a,b){d(b)})})}).catch(d)});return h(d,b),d}function U(a){var b=this,c=new ma(function(a,c){b.ready().then(function(){var d=b._dbInfo;d.db.transaction(function(b){b.executeSql("DELETE FROM "+d.storeName,[],function(){a()},function(a,b){c(b)})})}).catch(c)});return h(c,a),c}function V(a){var b=this,c=new ma(function(a,c){b.ready().then(function(){var d=b._dbInfo;d.db.transaction(function(b){b.executeSql("SELECT COUNT(key) as c FROM "+d.storeName,[],function(b,c){var d=c.rows.item(0).c;a(d)},function(a,b){c(b)})})}).catch(c)});return h(c,a),c}function W(a,b){var c=this,d=new ma(function(b,d){c.ready().then(function(){var e=c._dbInfo;e.db.transaction(function(c){c.executeSql("SELECT key FROM "+e.storeName+" WHERE id = ? LIMIT 1",[a+1],function(a,c){var d=c.rows.length?c.rows.item(0).key:null;b(d)},function(a,b){d(b)})})}).catch(d)});return h(d,b),d}function X(a){var b=this,c=new ma(function(a,c){b.ready().then(function(){var d=b._dbInfo;d.db.transaction(function(b){b.executeSql("SELECT key FROM "+d.storeName,[],function(b,c){for(var d=[],e=0;e<c.rows.length;e++)d.push(c.rows.item(e).key);a(d)},function(a,b){c(b)})})}).catch(c)});return h(c,a),c}function Y(){try{return"undefined"!=typeof localStorage&&"setItem"in localStorage&&"function"==typeof localStorage.setItem}catch(a){return!1}}function Z(a){var b=this,c={};if(a)for(var d in a)c[d]=a[d];return c.keyPrefix=c.name+"/",c.storeName!==b._defaultConfig.storeName&&(c.keyPrefix+=c.storeName+"/"),b._dbInfo=c,c.serializer=Ka,ma.resolve()}function $(a){var b=this,c=b.ready().then(function(){for(var a=b._dbInfo.keyPrefix,c=localStorage.length-1;c>=0;c--){var d=localStorage.key(c);0===d.indexOf(a)&&localStorage.removeItem(d)}});return h(c,a),c}function _(a,b){var c=this;a=j(a);var d=c.ready().then(function(){var b=c._dbInfo,d=localStorage.getItem(b.keyPrefix+a);return d&&(d=b.serializer.deserialize(d)),d});return h(d,b),d}function aa(a,b){var c=this,d=c.ready().then(function(){for(var b=c._dbInfo,d=b.keyPrefix,e=d.length,f=localStorage.length,g=1,h=0;h<f;h++){var i=localStorage.key(h);if(0===i.indexOf(d)){var j=localStorage.getItem(i);if(j&&(j=b.serializer.deserialize(j)),void 0!==(j=a(j,i.substring(e),g++)))return j}}});return h(d,b),d}function ba(a,b){var c=this,d=c.ready().then(function(){var b,d=c._dbInfo;try{b=localStorage.key(a)}catch(a){b=null}return b&&(b=b.substring(d.keyPrefix.length)),b});return h(d,b),d}function ca(a){var b=this,c=b.ready().then(function(){for(var a=b._dbInfo,c=localStorage.length,d=[],e=0;e<c;e++)0===localStorage.key(e).indexOf(a.keyPrefix)&&d.push(localStorage.key(e).substring(a.keyPrefix.length));return d});return h(c,a),c}function da(a){var b=this,c=b.keys().then(function(a){return a.length});return h(c,a),c}function ea(a,b){var c=this;a=j(a);var d=c.ready().then(function(){var b=c._dbInfo;localStorage.removeItem(b.keyPrefix+a)});return h(d,b),d}function fa(a,b,c){var d=this;a=j(a);var e=d.ready().then(function(){void 0===b&&(b=null);var c=b;return new ma(function(e,f){var g=d._dbInfo;g.serializer.serialize(b,function(b,d){if(d)f(d);else try{localStorage.setItem(g.keyPrefix+a,b),e(c)}catch(a){"QuotaExceededError"!==a.name&&"NS_ERROR_DOM_QUOTA_REACHED"!==a.name||f(a),f(a)}})})});return h(e,c),e}function ga(a,b){a[b]=function(){var c=arguments;return a.ready().then(function(){return a[b].apply(a,c)})}}function ha(){for(var a=1;a<arguments.length;a++){var b=arguments[a];if(b)for(var c in b)b.hasOwnProperty(c)&&(Na(b[c])?arguments[0][c]=b[c].slice():arguments[0][c]=b[c])}return arguments[0]}var ia="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},ja=e();"undefined"==typeof Promise&&a("lie/polyfill");var ka,la,ma=Promise,na="local-forage-detect-blob-support",oa=Object.prototype.toString,pa="readonly",qa="readwrite",ra={_driver:"asyncStorage",_initStorage:A,_support:f(),iterate:C,getItem:B,setItem:D,removeItem:E,clear:F,length:G,key:H,keys:I},sa="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",ta="~~local_forage_type~",ua=/^~~local_forage_type~([^~]+)~/,va="__lfsc__:",wa=va.length,xa="arbf",ya="blob",za="si08",Aa="ui08",Ba="uic8",Ca="si16",Da="si32",Ea="ur16",Fa="ui32",Ga="fl32",Ha="fl64",Ia=wa+xa.length,Ja=Object.prototype.toString,Ka={serialize:M,deserialize:N,stringToBuffer:K,bufferToString:L},La={_driver:"webSQLStorage",_initStorage:O,_support:J(),iterate:Q,getItem:P,setItem:S,removeItem:T,clear:U,length:V,key:W,keys:X},Ma={_driver:"localStorageWrapper",_initStorage:Z,_support:Y(),iterate:aa,getItem:_,setItem:fa,removeItem:ea,clear:$,length:da,key:ba,keys:ca},Na=Array.isArray||function(a){return"[object Array]"===Object.prototype.toString.call(a)},Oa={},Pa={},Qa={INDEXEDDB:ra,WEBSQL:La,LOCALSTORAGE:Ma},Ra={INDEXEDDB:ra._driver,WEBSQL:La._driver,LOCALSTORAGE:Ma._driver},Sa=[Ra.INDEXEDDB,Ra.WEBSQL,Ra.LOCALSTORAGE],Ta=["clear","getItem","iterate","key","keys","length","removeItem","setItem"],Ua={description:"",driver:Sa.slice(),name:"localforage",size:4980736,storeName:"keyvaluepairs",version:1},Va=function(){function a(b){d(this,a);for(var c in Ra)Ra.hasOwnProperty(c)&&(this[c]=Ra[c],Oa[c]||this.defineDriver(Qa[c]));this._defaultConfig=ha({},Ua),this._config=ha({},this._defaultConfig,b),this._driverSet=null,this._initDriver=null,this._ready=!1,this._dbInfo=null,this._wrapLibraryMethodsWithReady(),this.setDriver(this._config.driver).catch(function(){})}return a.prototype.config=function(a){if("object"===(void 0===a?"undefined":ia(a))){if(this._ready)return new Error("Can't call config() after localforage has been used.");for(var b in a){if("storeName"===b&&(a[b]=a[b].replace(/\W/g,"_")),"version"===b&&"number"!=typeof a[b])return new Error("Database version must be a number.");this._config[b]=a[b]}return!("driver"in a&&a.driver)||this.setDriver(this._config.driver)}return"string"==typeof a?this._config[a]:this._config},a.prototype.defineDriver=function(a,b,c){var d=new ma(function(b,c){try{var d=a._driver,e=new Error("Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver");if(!a._driver)return void c(e);for(var f=Ta.concat("_initStorage"),g=0,h=f.length;g<h;g++){var i=f[g];if(!i||!a[i]||"function"!=typeof a[i])return void c(e)}var j=function(c){Oa[d]&&console.info("Redefining LocalForage driver: "+d),Oa[d]=a,Pa[d]=c,b()};"_support"in a?a._support&&"function"==typeof a._support?a._support().then(j,c):j(!!a._support):j(!0)}catch(a){c(a)}});return i(d,b,c),d},a.prototype.driver=function(){return this._driver||null},a.prototype.getDriver=function(a,b,c){var d=Oa[a]?ma.resolve(Oa[a]):ma.reject(new Error("Driver not found."));return i(d,b,c),d},a.prototype.getSerializer=function(a){var b=ma.resolve(Ka);return i(b,a),b},a.prototype.ready=function(a){var b=this,c=b._driverSet.then(function(){return null===b._ready&&(b._ready=b._initDriver()),b._ready});return i(c,a,a),c},a.prototype.setDriver=function(a,b,c){function d(){g._config.driver=g.driver()}function e(a){return g._extend(a),d(),g._ready=g._initStorage(g._config),g._ready}function f(a){return function(){function b(){for(;c<a.length;){var f=a[c];return c++,g._dbInfo=null,g._ready=null,g.getDriver(f).then(e).catch(b)}d();var h=new Error("No available storage method found.");return g._driverSet=ma.reject(h),g._driverSet}var c=0;return b()}}var g=this;Na(a)||(a=[a]);var h=this._getSupportedDrivers(a),j=null!==this._driverSet?this._driverSet.catch(function(){return ma.resolve()}):ma.resolve();return this._driverSet=j.then(function(){var a=h[0];return g._dbInfo=null,g._ready=null,g.getDriver(a).then(function(a){g._driver=a._driver,d(),g._wrapLibraryMethodsWithReady(),g._initDriver=f(h)})}).catch(function(){d();var a=new Error("No available storage method found.");return g._driverSet=ma.reject(a),g._driverSet}),i(this._driverSet,b,c),this._driverSet},a.prototype.supports=function(a){return!!Pa[a]},a.prototype._extend=function(a){ha(this,a)},a.prototype._getSupportedDrivers=function(a){for(var b=[],c=0,d=a.length;c<d;c++){var e=a[c];this.supports(e)&&b.push(e)}return b},a.prototype._wrapLibraryMethodsWithReady=function(){for(var a=0,b=Ta.length;a<b;a++)ga(this,Ta[a])},a.prototype.createInstance=function(b){return new a(b)},a}(),Wa=new Va;b.exports=Wa},{undefined:void 0}]},{},[1])(1)});

  var Sync = function(storekey,postfunction) {    
    // compare meta data
    var loop_step = next_step();
    hybriddcall({r:'s/storage/meta/'+storekey,c:GL.usercrypto,s:loop_step,z:0},0, function(object) {
      var meta = object.data;
      if(typeof meta==='undefined' || meta===null || meta==='null') {
        meta = {time:0,hash:null}
      }
      localforage.getItem(storekey+'.meta').then(function(localmeta) {
        // difference detected
        if(localmeta===null) { localmeta = {time:0,hash:0}; }
        var meta = this.meta;
        // DEBUG: logger(' KEY: '+storekey+' HASHES: '+meta.hash+' '+localmeta.hash);        
        if(meta.hash!==localmeta.hash) {
          // remote is newer
          if(meta.time>localmeta.time) {
            var loop_step = next_step();
            hybriddcall({r:'s/storage/get/'+storekey,c:GL.usercrypto,s:loop_step,z:0},0, function(object) {
              if(typeof object.data==='undefined' || object.data===null || object.data==='null') {
                localforage.getItem(storekey).then(function(value) {
                  if(typeof postfunction === 'function') {
                    postfunction(value);
                  }
                });
              } else {
                if(typeof postfunction === 'function') {
                 postfunction(object.data);
                }
                try {
                  localforage.setItem(storekey, object.data);
                  localforage.setItem(storekey+'.meta',{time:Date.now(),hash:DJB2.hash(object.data)});
                  return true;
                } catch(e) {
                  return false;
                }
              }
            });
          // remote is older
          } else {
            localforage.getItem(storekey).then(function(value) {
              if(typeof postfunction === 'function') {
                postfunction(value);
              }
              var loop_step = next_step();
              hybriddcall({r:'s/storage/set/'+storekey+'/'+value,c:GL.usercrypto,s:loop_step,z:0},0, function(object) {
                // add to proof of work queue
                console.log('TODO: after remote store, proof of work for data retention...');
              });
            });
          }
        // no changes between remote and local
        } else {
          localforage.getItem(storekey).then(function(value) {
            if(typeof postfunction === 'function') {
              postfunction(value);
            }
            if(meta.res!=='undefined' && meta.res===0) {
              // add to proof of work queue
              console.log('TODO: after local get, proof of work for data retention...');
            }
          });
        }
      }.bind({meta:meta}));
    });
  }    

	var storage = {

    Set : function (storekey, storevalue) {
      localforage.setItem(storekey, storevalue);
      localforage.setItem(storekey+'.meta',{time:Date.now(),hash:DJB2.hash(storevalue)});
      if(storekey.substr(-6)!=='-LOCAL') {
        setTimeout(function(storekey) {
          Sync(storekey);
        },2000,storekey);
      }
      return true;
    },

    Get : function (storekey, postfunction) {
      if(storekey.substr(-6)==='-LOCAL') {
        localforage.getItem(storekey).then(function(value) {
          postfunction(value);
        });
      } else {
        Sync(storekey, function(value) { postfunction(value); });
      }
      return true;
    },

    Del : function (storekey) {
      try {
        localforage.removeItem(storekey)
        return true;
      } catch(e) {
        return false;
      }
    }
    
    /*
    Idx : function (postfunction) {
      localforage.keys().then(function(value) {
        if(typeof postfunction === 'function') {
          postfunction(value);
        }
      }).catch(function(err) {
        if(typeof postfunction === 'function') {
          postfunction([]);
        }
      });
    }
    */
    
  }

  return storage;

})();

if (typeof define === 'function' && define.amd) {
  define(function () { return storage; });
} else if( typeof module !== 'undefined' && module != null ) {
  module.exports = storage;
} else if( typeof angular !== 'undefined' && angular != null ) {
  angular.module('storage', [])
  .factory('storage', function () {
    return storage;
  });
}
