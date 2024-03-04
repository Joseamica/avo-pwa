(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function r(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=r(o);fetch(o.href,n)}})();const y="modulepreload",v=function(t){return"/"+t},g={},b=function(e,r,s){let o=Promise.resolve();if(r&&r.length>0){const n=document.getElementsByTagName("link");o=Promise.all(r.map(i=>{if(i=v(i),i in g)return;g[i]=!0;const l=i.endsWith(".css"),m=l?'[rel="stylesheet"]':"";if(!!s)for(let c=n.length-1;c>=0;c--){const d=n[c];if(d.href===i&&(!l||d.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${i}"]${m}`))return;const a=document.createElement("link");if(a.rel=l?"stylesheet":y,l||(a.as="script",a.crossOrigin=""),a.href=i,document.head.appendChild(a),l)return new Promise((c,d)=>{a.addEventListener("load",c),a.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${i}`)))})}))}return o.then(()=>e()).catch(n=>{const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=n,window.dispatchEvent(i),!i.defaultPrevented)throw n})};function M(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function S(t){if(t.__esModule)return t;var e=t.default;if(typeof e=="function"){var r=function s(){return this instanceof s?Reflect.construct(e,arguments,this.constructor):e.apply(this,arguments)};r.prototype=e.prototype}else r={};return Object.defineProperty(r,"__esModule",{value:!0}),Object.keys(t).forEach(function(s){var o=Object.getOwnPropertyDescriptor(t,s);Object.defineProperty(r,s,o.get?o:{enumerable:!0,get:function(){return t[s]}})}),r}var f={exports:{}};f.exports=h;f.exports.isMobile=h;f.exports.default=h;const w=/(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series[46]0|samsungbrowser.*mobile|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i,x=/CrOS/,O=/android|ipad|playbook|silk/i;function h(t){t||(t={});let e=t.ua;if(!e&&typeof navigator<"u"&&(e=navigator.userAgent),e&&e.headers&&typeof e.headers["user-agent"]=="string"&&(e=e.headers["user-agent"]),typeof e!="string")return!1;let r=w.test(e)&&!x.test(e)||!!t.tablet&&O.test(e);return!r&&t.tablet&&t.featureDetect&&navigator&&navigator.maxTouchPoints>1&&e.indexOf("Macintosh")!==-1&&e.indexOf("Safari")!==-1&&(r=!0),r}var E=f.exports;const P=M(E),$=P(),_="Avo PWA",R="hola@avoqado.io",j={app:{crash:{title:"Oooops... Sorry, I guess, something went wrong. You can:",options:{email:`contact with author by this email - ${R}`,reset:"Press here to reset the application"}}},loader:{fail:"Hmmmmm, there is something wrong with this component loading process... Maybe trying later would be the best idea"},images:{failed:"something went wrong during image loading :("},404:"Hey bro? What are you looking for?"},A={options:{anchorOrigin:{vertical:"top",horizontal:"center"},autoHideDuration:6e3},maxSnack:$?3:4},B={image:"/cover.png",description:"Starter kit for modern web applications"},C="https://giphy.com/embed/xTiN0L7EW5trfOvEk0";function p(){return Math.floor(Math.random()*256)}function k(){const t=p(),e=p(),r=p();return[`rgb(${t}, ${e}, ${r})`,`rgb(${255-t}, ${255-e}, ${255-r})`]}function N(){const s=Math.floor(Math.random()*256),o=Math.floor(Math.random()*256),n=Math.floor(Math.random()*256),i=Math.floor((s+255)/2),l=Math.floor((o+255)/2),m=Math.floor((n+255)/2),u=a=>("0"+a.toString(16)).slice(-2);return`#${u(i)}${u(l)}${u(m)}`}function L(){const[t,e]=k(),r=["font-size: 40px",`color: ${t}`,`border: 1px solid ${e}`,`background-color: ${e}`,"border-radius: 5px","padding: 10px"].join(";");console.log(`%c=== ${_} ===`,r)}Promise.all([b(()=>import("./Root-lU9mEplp.js"),__vite__mapDeps([0,1])),b(()=>import("./App-RmPQFAZy.js"),__vite__mapDeps([2,1,3]))]).then(([{default:t},{default:e}])=>{t(e)});L();export{b as _,S as a,C as b,N as c,B as d,R as e,M as g,j as m,A as n,_ as t};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/Root-lU9mEplp.js","assets/QueryClientProvider-1fNVGzkL.js","assets/App-RmPQFAZy.js","assets/App-QhB4Nbb8.css"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}