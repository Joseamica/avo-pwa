if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,a)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let o={};const l=e=>i(e,n),d={module:{uri:n},exports:o,require:l};s[n]=Promise.all(r.map((e=>d[e]||l(e)))).then((e=>(a(...e),o)))}}define(["./workbox-78331965"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/Admin-jSEGOn7-.js",revision:null},{url:"assets/App-a_5Ctw7i.css",revision:null},{url:"assets/App-VPmrma5G.js",revision:null},{url:"assets/BillDetails.dashboard--4103RXD.js",revision:null},{url:"assets/BillList.dashboard-WxiH4bTV.js",revision:null},{url:"assets/Dashboard-M2PPUkX4.js",revision:null},{url:"assets/FIXMenusList.dashboard-TpOA_-WF.js",revision:null},{url:"assets/index-5BxWyWw0.js",revision:null},{url:"assets/Login-4Is7kRgp.js",revision:null},{url:"assets/QueryClientProvider-8Ly9q1Dj.js",revision:null},{url:"assets/Root-v-dCOvQT.js",revision:null},{url:"assets/TableDetails.dashboard-e20G3f9X.js",revision:null},{url:"assets/TableList.dashboard-zNAzI1nv.js",revision:null},{url:"assets/TableNumber-yMLdA7jL.js",revision:null},{url:"assets/VenueDetails.dashboard-UI_EjOpr.js",revision:null},{url:"assets/VenueList.dashboard-_ORqA6qt.js",revision:null},{url:"assets/workbox-window.prod.es5-prqDwDSL.js",revision:null},{url:"index.html",revision:"f6dd1420f936fdca328f7f33d54d5bab"},{url:"apple-touch-icon.png",revision:"410d328b07c46ddbe9a2e7cb29aa70da"},{url:"audit.png",revision:"4e06993eed49427f321924f5441942bf"},{url:"bundle.png",revision:"9f0f2831f95d176ff29e2ef2ef94d0ed"},{url:"cover.png",revision:"1df4043c45d5bb3e7cfaa413f24ec0f2"},{url:"demo-dark.png",revision:"02bd120430604874b8daa043b5305edf"},{url:"demo-light.png",revision:"2d500252e78cdb3d463788942aab219b"},{url:"favicon.svg",revision:"1d63cc3476f55e13ee57fff67a6fd741"},{url:"file-folder-structure.png",revision:"6d40a900cc13f62f95701d7fb58dd1d6"},{url:"pwa-192x192.png",revision:"3b6265c5e75ae1c1fd666d575f33884b"},{url:"pwa-512x512.png",revision:"e571b86ade2a8bda44002d5903cae102"},{url:"pwa-reload.png",revision:"0b6b77eb7dbc9ee80eb9e7054731e0d6"},{url:"use-template.png",revision:"22633ffac72d95c35b8f2a6ee15df6b2"},{url:"favicon.svg",revision:"1d63cc3476f55e13ee57fff67a6fd741"},{url:"favicon.ico",revision:"eb5b87164c9be3cb704a1ac547f2c51d"},{url:"robots.txt",revision:"5e0bd1c281a62a380d7a948085bfe2d1"},{url:"apple-touch-icon.png",revision:"410d328b07c46ddbe9a2e7cb29aa70da"},{url:"pwa-192x192.png",revision:"3b6265c5e75ae1c1fd666d575f33884b"},{url:"pwa-512x512.png",revision:"e571b86ade2a8bda44002d5903cae102"},{url:"manifest.webmanifest",revision:"0b386a8b67048c795b8fb1e0bbb47be6"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/avoqado-d0a24\.appspot\.com\/o\//,new e.CacheFirst({cacheName:"restaurant-images",plugins:[new e.ExpirationPlugin({maxEntries:500,maxAgeSeconds:63072e3}),new e.CacheableResponsePlugin({statuses:[200]})]}),"GET"),e.registerRoute(/^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/avoqado-d0a24\.appspot\.com\/o\/1\.%20Madre%20Cafecito%2F.*\.(png|jpg|jpeg)$/,new e.CacheFirst({cacheName:"local-images2",plugins:[new e.ExpirationPlugin({maxEntries:500,maxAgeSeconds:63072e3}),new e.CacheableResponsePlugin({statuses:[200]})]}),"GET")}));
