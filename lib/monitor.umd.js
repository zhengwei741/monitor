!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e="undefined"!=typeof globalThis?globalThis:e||self).monitor=n()}(this,function(){"use strict";const t=window.requestIdleCallback||window.requestAnimationFrame||(e=>setTimeout(e,17));function n(){return window.location.href}let i=[];let o={},r=void 0;function a(e,n=!1){n?u("",{baseInfo:o,eventInfo:[e]}):(i.push(e),clearTimeout(r),5<=i.length?c():r=window.setTimeout(c,5e3))}function c(){if(i.length){const n=i.slice(0,5);i=i.slice(5);var e=Date.now();u("",{...o,sendTime:e,data:n.map(e=>e)}),i.length&&t(c)}}const u=(e,n)=>{console.log(e,"--------------url"),console.log(n,"--------------data")};window.addEventListener("beforeunload",()=>{c()});function f(e,n){return{name:e,value:void 0===n?-1:n,delta:0,entries:[],id:"v2-".concat(Date.now(),"-").concat(Math.floor(8999999999999*Math.random())+1e12)}}function s(e,n){try{if(PerformanceObserver.supportedEntryTypes.includes(e)){if("first-input"===e&&!("PerformanceEventTiming"in self))return;var t=new PerformanceObserver(function(e){return e.getEntries().map(n)});return t.observe({type:e,buffered:!0}),t}}catch(e){}}function p(n,t){function i(e){"pagehide"!==e.type&&"hidden"!==document.visibilityState||(n(e),t&&(removeEventListener("visibilitychange",i,!0),removeEventListener("pagehide",i,!0)))}addEventListener("visibilitychange",i,!0),addEventListener("pagehide",i,!0)}function d(n){addEventListener("pageshow",function(e){e.persisted&&n(e)},!0)}function m(n,t,i){var o;return function(e){0<=t.value&&(e||i)&&(t.delta=t.value-(o||0),!t.delta&&void 0!==o||(o=t.value,n(t)))}}function e(){return"hidden"===document.visibilityState?0:1/0}function l(){p(function(e){e=e.timeStamp;R=e},!0)}function v(){return R<0&&(R=e(),l(),d(function(){setTimeout(function(){R=e(),l()},0)})),{get firstHiddenTime(){return R}}}function g(n,t){function e(e){"first-contentful-paint"===e.name&&(c&&c.disconnect(),e.startTime<o.firstHiddenTime&&(r.value=e.startTime,r.entries.push(e),i(!0)))}var i,o=v(),r=f("FCP"),a=window.performance&&performance.getEntriesByName&&performance.getEntriesByName("first-contentful-paint")[0],c=a?null:s("paint",e);(a||c)&&(i=m(n,r,t),a&&e(a),d(function(e){r=f("FCP"),i=m(n,r,t),requestAnimationFrame(function(){requestAnimationFrame(function(){r.value=performance.now()-e.timeStamp,i(!0)})})}))}function y(n,e){function t(e){-1<C&&n(e)}function i(e){var n,t;e.hadRecentInput||(n=c[0],t=c[c.length-1],a&&e.startTime-t.startTime<1e3&&e.startTime-n.startTime<5e3?(a+=e.value,c.push(e)):(a=e.value,c=[e]),a>r.value&&(r.value=a,r.entries=c,o()))}k||(g(function(e){C=e.value}),k=!0);var o,r=f("CLS",0),a=0,c=[],u=s("layout-shift",i);u&&(o=m(t,r,e),p(function(){u.takeRecords().map(i),o(!0)}),d(function(){C=-1,r=f("CLS",a=0),o=m(t,r,e)}))}function h(e,n){L||(L=n,S=e,F=new Date,w(removeEventListener),T())}function T(){var n;0<=S&&S<F-q&&(n={entryType:"first-input",name:L.type,target:L.target,cancelable:L.cancelable,startTime:L.timeStamp,processingStart:L.timeStamp+S},P.forEach(function(e){e(n)}),P=[])}function w(n){["mousedown","keydown","touchstart","pointerdown"].forEach(function(e){return n(e,I,D)})}function b(e,n){function t(e){e.startTime<i.firstHiddenTime&&(o.value=e.processingStart-e.startTime,o.entries.push(e),a(!0))}var i=v(),o=f("FID"),r=s("first-input",t),a=m(e,o,n);r&&p(function(){r.takeRecords().map(t),r.disconnect()},!0),r&&d(function(){o=f("FID"),a=m(e,o,n),P=[],S=-1,L=null,w(addEventListener),P.push(t),T()})}function E(n,t){function e(e){var n=e.startTime;n<r.firstHiddenTime&&(a.value=n,a.entries.push(e),i())}var i,o,r=v(),a=f("LCP"),c=s("largest-contentful-paint",e);c&&(i=m(n,a,t),o=function(){A[a.id]||(c.takeRecords().map(e),c.disconnect(),A[a.id]=!0,i(!0))},["keydown","click"].forEach(function(e){addEventListener(e,o,{once:!0,capture:!0})}),p(o,!0),d(function(e){a=f("LCP"),i=m(n,a,t),requestAnimationFrame(function(){requestAnimationFrame(function(){a.value=performance.now()-e.timeStamp,A[a.id]=!0,i(!0)})})}))}var L,S,F,P,R=-1,k=!1,C=-1,D={passive:!0,capture:!0},q=new Date,I=function(e){var n,t,i,o;function r(){h(t,i),o()}function a(){o()}e.cancelable&&(n=(1e12<e.timeStamp?new Date:performance.now())-e.timeStamp,"pointerdown"==e.type?(t=n,i=e,o=function(){removeEventListener("pointerup",r,D),removeEventListener("pointercancel",a,D)},addEventListener("pointerup",r,D),addEventListener("pointercancel",a,D)):h(n,e))},A={};function H(e){console.log(e),console.log("init"),console.log({}),U(),x(),B(),M()}const U=function(){g(function(e){a({...e,pageURL:n(),subType:"fp",type:"performance"})})},x=function(){E(function(e){a({...e,pageURL:n(),subType:"lcp",type:"performance"})})},B=function(){b(function(e){a({...e,pageURL:n(),subType:"fid",type:"performance"})})},M=function(){y(function(e){a({...e,pageURL:n(),subType:"cls",type:"performance"})})};return{init:H,install:function(e,n){H(n),e.prototype?e.prototype.$monitor={}:e.config.globalProperties.$monitor={}}}});