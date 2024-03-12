var se=(t,e,s)=>{if(!e.has(t))throw TypeError("Cannot "+s)};var r=(t,e,s)=>(se(t,e,"read from private field"),s?s.call(t):e.get(t)),o=(t,e,s)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,s)},n=(t,e,s,i)=>(se(t,e,"write to private field"),i?i.call(t,s):e.set(t,s),s);var ee=(t,e,s,i)=>({set _(a){n(t,e,a,s)},get _(){return r(t,e,i)}}),p=(t,e,s)=>(se(t,e,"access private method"),s);import{r as we,a as Y,j as C,_ as N,u as Ee,T as Te,b as Re,c as ue,d as he,e as Ue,f as je,R as xe,g as Ke,n as F,t as He,h as _e,i as f,k as ie,l as ke,S as Me,m as qe,o as oe,M as Ie,p as ce,q as $e,s as Be,v as le,w as de,x as Ge,y as fe,z as ye,A as Le,H as Ne,Q as We}from"./QueryClientProvider-8Ly9q1Dj.js";import"./index-5BxWyWw0.js";var De,me=we;De=me.createRoot,me.hydrateRoot;const ze=Y.createContext(null),Qe=ze;function Se(){return Y.useContext(Qe)}const Ye=typeof Symbol=="function"&&Symbol.for,Je=Ye?Symbol.for("mui.nested"):"__THEME_NESTED__";function Ve(t,e){return typeof e=="function"?e(t):N({},t,e)}function Xe(t){const{children:e,theme:s}=t,i=Se(),a=Y.useMemo(()=>{const u=i===null?s:Ve(i,s);return u!=null&&(u[Je]=i!==null),u},[s,i]);return C.jsx(Qe.Provider,{value:a,children:e})}const pe={};function ge(t,e,s,i=!1){return Y.useMemo(()=>{const a=t&&e[t]||e;if(typeof s=="function"){const u=s(a),d=t?N({},e,{[t]:u}):u;return i?()=>d:d}return t?N({},e,{[t]:s}):N({},e,s)},[t,e,s,i])}function Ze(t){const{children:e,theme:s,themeId:i}=t,a=Ee(pe),u=Se()||pe,d=ge(i,a,s),y=ge(i,u,s,!0);return C.jsx(Xe,{theme:y,children:C.jsx(Te.Provider,{value:d,children:e})})}const et=["theme"];function tt(t){let{theme:e}=t,s=Re(t,et);const i=e[ue];return C.jsx(Ze,N({},s,{themeId:i?ue:void 0,theme:i||e}))}const ve={palette:{background:{default:"#fafafa",paper:"#fff"}},components:{MuiButtonBase:{defaultProps:{disableRipple:!0}},MuiDivider:{styleOverrides:{vertical:{marginRight:10,marginLeft:10},middle:{marginTop:10,marginBottom:10,width:"80%"}}}}},st={light:he(ve,{palette:{mode:"light",background:{default:"#fafafa",paper:"#fff"},primary:{main:"#3f51b5"}}}),dark:he(ve,{palette:{mode:"dark",background:{default:"#111",paper:"#171717"},primary:{main:"#333"}}})};function it({children:t}){const[e]=Ue();return C.jsx(tt,{theme:je(st[e]),children:t})}var _,k,g,w,v,l,W,j,I,te,O,q,Pe,rt=(Pe=class extends xe{constructor(e){super();o(this,I);o(this,O);o(this,_,void 0);o(this,k,void 0);o(this,g,void 0);o(this,w,void 0);o(this,v,void 0);o(this,l,void 0);o(this,W,void 0);o(this,j,void 0);n(this,j,!1),n(this,W,e.defaultOptions),p(this,I,te).call(this,e.options),n(this,l,[]),n(this,g,e.cache),this.queryKey=e.queryKey,this.queryHash=e.queryHash,n(this,_,e.state||at(this.options)),this.state=r(this,_),this.scheduleGc()}get meta(){return this.options.meta}optionalRemove(){!r(this,l).length&&this.state.fetchStatus==="idle"&&r(this,g).remove(this)}setData(e,s){const i=Ke(this.state.data,e,this.options);return p(this,O,q).call(this,{data:i,type:"success",dataUpdatedAt:s==null?void 0:s.updatedAt,manual:s==null?void 0:s.manual}),i}setState(e,s){p(this,O,q).call(this,{type:"setState",state:e,setStateOptions:s})}cancel(e){var i;const s=r(this,w);return(i=r(this,v))==null||i.cancel(e),s?s.then(F).catch(F):Promise.resolve()}destroy(){super.destroy(),this.cancel({silent:!0})}reset(){this.destroy(),this.setState(r(this,_))}isActive(){return r(this,l).some(e=>e.options.enabled!==!1)}isDisabled(){return this.getObserversCount()>0&&!this.isActive()}isStale(){return this.state.isInvalidated||!this.state.dataUpdatedAt||r(this,l).some(e=>e.getCurrentResult().isStale)}isStaleByTime(e=0){return this.state.isInvalidated||!this.state.dataUpdatedAt||!He(this.state.dataUpdatedAt,e)}onFocus(){var s;const e=r(this,l).find(i=>i.shouldFetchOnWindowFocus());e==null||e.refetch({cancelRefetch:!1}),(s=r(this,v))==null||s.continue()}onOnline(){var s;const e=r(this,l).find(i=>i.shouldFetchOnReconnect());e==null||e.refetch({cancelRefetch:!1}),(s=r(this,v))==null||s.continue()}addObserver(e){r(this,l).includes(e)||(r(this,l).push(e),this.clearGcTimeout(),r(this,g).notify({type:"observerAdded",query:this,observer:e}))}removeObserver(e){r(this,l).includes(e)&&(n(this,l,r(this,l).filter(s=>s!==e)),r(this,l).length||(r(this,v)&&(r(this,j)?r(this,v).cancel({revert:!0}):r(this,v).cancelRetry()),this.scheduleGc()),r(this,g).notify({type:"observerRemoved",query:this,observer:e}))}getObserversCount(){return r(this,l).length}invalidate(){this.state.isInvalidated||p(this,O,q).call(this,{type:"invalidate"})}fetch(e,s){var K,V,X,H;if(this.state.fetchStatus!=="idle"){if(this.state.dataUpdatedAt&&(s!=null&&s.cancelRefetch))this.cancel({silent:!0});else if(r(this,w))return(K=r(this,v))==null||K.continueRetry(),r(this,w)}if(e&&p(this,I,te).call(this,e),!this.options.queryFn){const h=r(this,l).find(m=>m.options.queryFn);h&&p(this,I,te).call(this,h.options)}const i=new AbortController,a={queryKey:this.queryKey,meta:this.meta},u=h=>{Object.defineProperty(h,"signal",{enumerable:!0,get:()=>(n(this,j,!0),i.signal)})};u(a);const d=()=>this.options.queryFn?(n(this,j,!1),this.options.persister?this.options.persister(this.options.queryFn,a,this):this.options.queryFn(a)):Promise.reject(new Error(`Missing queryFn: '${this.options.queryHash}'`)),y={fetchOptions:s,options:this.options,queryKey:this.queryKey,state:this.state,fetchFn:d};u(y),(V=this.options.behavior)==null||V.onFetch(y,this),n(this,k,this.state),(this.state.fetchStatus==="idle"||this.state.fetchMeta!==((X=y.fetchOptions)==null?void 0:X.meta))&&p(this,O,q).call(this,{type:"fetch",meta:(H=y.fetchOptions)==null?void 0:H.meta});const J=h=>{var m,D,Q,S;ie(h)&&h.silent||p(this,O,q).call(this,{type:"error",error:h}),ie(h)||((D=(m=r(this,g).config).onError)==null||D.call(m,h,this),(S=(Q=r(this,g).config).onSettled)==null||S.call(Q,this.state.data,h,this)),this.isFetchingOptimistic||this.scheduleGc(),this.isFetchingOptimistic=!1};return n(this,v,_e({fn:y.fetchFn,abort:i.abort.bind(i),onSuccess:h=>{var m,D,Q,S;if(typeof h>"u"){J(new Error(`${this.queryHash} data is undefined`));return}this.setData(h),(D=(m=r(this,g).config).onSuccess)==null||D.call(m,h,this),(S=(Q=r(this,g).config).onSettled)==null||S.call(Q,h,this.state.error,this),this.isFetchingOptimistic||this.scheduleGc(),this.isFetchingOptimistic=!1},onError:J,onFail:(h,m)=>{p(this,O,q).call(this,{type:"failed",failureCount:h,error:m})},onPause:()=>{p(this,O,q).call(this,{type:"pause"})},onContinue:()=>{p(this,O,q).call(this,{type:"continue"})},retry:y.options.retry,retryDelay:y.options.retryDelay,networkMode:y.options.networkMode})),n(this,w,r(this,v).promise),r(this,w)}},_=new WeakMap,k=new WeakMap,g=new WeakMap,w=new WeakMap,v=new WeakMap,l=new WeakMap,W=new WeakMap,j=new WeakMap,I=new WeakSet,te=function(e){this.options={...r(this,W),...e},this.updateGcTime(this.options.gcTime)},O=new WeakSet,q=function(e){const s=i=>{switch(e.type){case"failed":return{...i,fetchFailureCount:e.failureCount,fetchFailureReason:e.error};case"pause":return{...i,fetchStatus:"paused"};case"continue":return{...i,fetchStatus:"fetching"};case"fetch":return{...i,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:e.meta??null,fetchStatus:ke(this.options.networkMode)?"fetching":"paused",...!i.dataUpdatedAt&&{error:null,status:"pending"}};case"success":return{...i,data:e.data,dataUpdateCount:i.dataUpdateCount+1,dataUpdatedAt:e.dataUpdatedAt??Date.now(),error:null,isInvalidated:!1,status:"success",...!e.manual&&{fetchStatus:"idle",fetchFailureCount:0,fetchFailureReason:null}};case"error":const a=e.error;return ie(a)&&a.revert&&r(this,k)?{...r(this,k),fetchStatus:"idle"}:{...i,error:a,errorUpdateCount:i.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:i.fetchFailureCount+1,fetchFailureReason:a,fetchStatus:"idle",status:"error"};case"invalidate":return{...i,isInvalidated:!0};case"setState":return{...i,...e.state}}};this.state=s(this.state),f.batch(()=>{r(this,l).forEach(i=>{i.onQueryUpdate()}),r(this,g).notify({query:this,type:"updated",action:e})})},Pe);function at(t){const e=typeof t.initialData=="function"?t.initialData():t.initialData,s=typeof e<"u",i=s?typeof t.initialDataUpdatedAt=="function"?t.initialDataUpdatedAt():t.initialDataUpdatedAt:0;return{data:e,dataUpdateCount:0,dataUpdatedAt:s?i??Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchFailureReason:null,fetchMeta:null,isInvalidated:!1,status:s?"success":"pending",fetchStatus:"idle"}}var M,Fe,nt=(Fe=class extends Me{constructor(e={}){super();o(this,M,void 0);this.config=e,n(this,M,new Map)}build(e,s,i){const a=s.queryKey,u=s.queryHash??qe(a,s);let d=this.get(u);return d||(d=new rt({cache:this,queryKey:a,queryHash:u,options:e.defaultQueryOptions(s),state:i,defaultOptions:e.getQueryDefaults(a)}),this.add(d)),d}add(e){r(this,M).has(e.queryHash)||(r(this,M).set(e.queryHash,e),this.notify({type:"added",query:e}))}remove(e){const s=r(this,M).get(e.queryHash);s&&(e.destroy(),s===e&&r(this,M).delete(e.queryHash),this.notify({type:"removed",query:e}))}clear(){f.batch(()=>{this.getAll().forEach(e=>{this.remove(e)})})}get(e){return r(this,M).get(e)}getAll(){return[...r(this,M).values()]}find(e){const s={exact:!0,...e};return this.getAll().find(i=>oe(s,i))}findAll(e={}){const s=this.getAll();return Object.keys(e).length>0?s.filter(i=>oe(e,i)):s}notify(e){f.batch(()=>{this.listeners.forEach(s=>{s(e)})})}onFocus(){f.batch(()=>{this.getAll().forEach(e=>{e.onFocus()})})}onOnline(){f.batch(()=>{this.getAll().forEach(e=>{e.onOnline()})})}},M=new WeakMap,Fe),b,z,x,Oe,ut=(Oe=class extends Me{constructor(e={}){super();o(this,b,void 0);o(this,z,void 0);o(this,x,void 0);this.config=e,n(this,b,[]),n(this,z,0)}build(e,s,i){const a=new Ie({mutationCache:this,mutationId:++ee(this,z)._,options:e.defaultMutationOptions(s),state:i});return this.add(a),a}add(e){r(this,b).push(e),this.notify({type:"added",mutation:e})}remove(e){n(this,b,r(this,b).filter(s=>s!==e)),this.notify({type:"removed",mutation:e})}clear(){f.batch(()=>{r(this,b).forEach(e=>{this.remove(e)})})}getAll(){return r(this,b)}find(e){const s={exact:!0,...e};return r(this,b).find(i=>ce(s,i))}findAll(e={}){return r(this,b).filter(s=>ce(e,s))}notify(e){f.batch(()=>{this.listeners.forEach(s=>{s(e)})})}resumePausedMutations(){return n(this,x,(r(this,x)??Promise.resolve()).then(()=>{const e=r(this,b).filter(s=>s.state.isPaused);return f.batch(()=>e.reduce((s,i)=>s.then(()=>i.continue().catch(F)),Promise.resolve()))}).then(()=>{n(this,x,void 0)})),r(this,x)}},b=new WeakMap,z=new WeakMap,x=new WeakMap,Oe);function ht(t){return{onFetch:(e,s)=>{const i=async()=>{var m,D,Q,S,re;const a=e.options,u=(Q=(D=(m=e.fetchOptions)==null?void 0:m.meta)==null?void 0:D.fetchMore)==null?void 0:Q.direction,d=((S=e.state.data)==null?void 0:S.pages)||[],y=((re=e.state.data)==null?void 0:re.pageParams)||[],J={pages:[],pageParams:[]};let K=!1;const V=P=>{Object.defineProperty(P,"signal",{enumerable:!0,get:()=>(e.signal.aborted?K=!0:e.signal.addEventListener("abort",()=>{K=!0}),e.signal)})},X=e.options.queryFn||(()=>Promise.reject(new Error(`Missing queryFn: '${e.options.queryHash}'`))),H=async(P,A,U)=>{if(K)return Promise.reject();if(A==null&&P.pages.length)return Promise.resolve(P);const Z={queryKey:e.queryKey,pageParam:A,direction:U?"backward":"forward",meta:e.options.meta};V(Z);const Ae=await X(Z),{maxPages:ae}=e.options,ne=U?$e:Be;return{pages:ne(P.pages,Ae,ae),pageParams:ne(P.pageParams,A,ae)}};let h;if(u&&d.length){const P=u==="backward",A=P?ot:be,U={pages:d,pageParams:y},Z=A(a,U);h=await H(U,Z,P)}else{h=await H(J,y[0]??a.initialPageParam);const P=t??d.length;for(let A=1;A<P;A++){const U=be(a,h);h=await H(h,U)}}return h};e.options.persister?e.fetchFn=()=>{var a,u;return(u=(a=e.options).persister)==null?void 0:u.call(a,i,{queryKey:e.queryKey,meta:e.options.meta,signal:e.signal},s)}:e.fetchFn=i}}}function be(t,{pages:e,pageParams:s}){const i=e.length-1;return t.getNextPageParam(e[i],e,s[i],s)}function ot(t,{pages:e,pageParams:s}){var i;return(i=t.getPreviousPageParam)==null?void 0:i.call(t,e[0],e,s[0],s)}var c,E,T,$,B,R,G,L,Ce,ct=(Ce=class{constructor(t={}){o(this,c,void 0);o(this,E,void 0);o(this,T,void 0);o(this,$,void 0);o(this,B,void 0);o(this,R,void 0);o(this,G,void 0);o(this,L,void 0);n(this,c,t.queryCache||new nt),n(this,E,t.mutationCache||new ut),n(this,T,t.defaultOptions||{}),n(this,$,new Map),n(this,B,new Map),n(this,R,0)}mount(){ee(this,R)._++,r(this,R)===1&&(n(this,G,le.subscribe(()=>{le.isFocused()&&(this.resumePausedMutations(),r(this,c).onFocus())})),n(this,L,de.subscribe(()=>{de.isOnline()&&(this.resumePausedMutations(),r(this,c).onOnline())})))}unmount(){var t,e;ee(this,R)._--,r(this,R)===0&&((t=r(this,G))==null||t.call(this),n(this,G,void 0),(e=r(this,L))==null||e.call(this),n(this,L,void 0))}isFetching(t){return r(this,c).findAll({...t,fetchStatus:"fetching"}).length}isMutating(t){return r(this,E).findAll({...t,status:"pending"}).length}getQueryData(t){var e;return(e=r(this,c).find({queryKey:t}))==null?void 0:e.state.data}ensureQueryData(t){const e=this.getQueryData(t.queryKey);return e!==void 0?Promise.resolve(e):this.fetchQuery(t)}getQueriesData(t){return this.getQueryCache().findAll(t).map(({queryKey:e,state:s})=>{const i=s.data;return[e,i]})}setQueryData(t,e,s){const i=r(this,c).find({queryKey:t}),a=i==null?void 0:i.state.data,u=Ge(e,a);if(typeof u>"u")return;const d=this.defaultQueryOptions({queryKey:t});return r(this,c).build(this,d).setData(u,{...s,manual:!0})}setQueriesData(t,e,s){return f.batch(()=>this.getQueryCache().findAll(t).map(({queryKey:i})=>[i,this.setQueryData(i,e,s)]))}getQueryState(t){var e;return(e=r(this,c).find({queryKey:t}))==null?void 0:e.state}removeQueries(t){const e=r(this,c);f.batch(()=>{e.findAll(t).forEach(s=>{e.remove(s)})})}resetQueries(t,e){const s=r(this,c),i={type:"active",...t};return f.batch(()=>(s.findAll(t).forEach(a=>{a.reset()}),this.refetchQueries(i,e)))}cancelQueries(t={},e={}){const s={revert:!0,...e},i=f.batch(()=>r(this,c).findAll(t).map(a=>a.cancel(s)));return Promise.all(i).then(F).catch(F)}invalidateQueries(t={},e={}){return f.batch(()=>{if(r(this,c).findAll(t).forEach(i=>{i.invalidate()}),t.refetchType==="none")return Promise.resolve();const s={...t,type:t.refetchType??t.type??"active"};return this.refetchQueries(s,e)})}refetchQueries(t={},e){const s={...e,cancelRefetch:(e==null?void 0:e.cancelRefetch)??!0},i=f.batch(()=>r(this,c).findAll(t).filter(a=>!a.isDisabled()).map(a=>{let u=a.fetch(void 0,s);return s.throwOnError||(u=u.catch(F)),a.state.fetchStatus==="paused"?Promise.resolve():u}));return Promise.all(i).then(F)}fetchQuery(t){const e=this.defaultQueryOptions(t);typeof e.retry>"u"&&(e.retry=!1);const s=r(this,c).build(this,e);return s.isStaleByTime(e.staleTime)?s.fetch(e):Promise.resolve(s.state.data)}prefetchQuery(t){return this.fetchQuery(t).then(F).catch(F)}fetchInfiniteQuery(t){return t.behavior=ht(t.pages),this.fetchQuery(t)}prefetchInfiniteQuery(t){return this.fetchInfiniteQuery(t).then(F).catch(F)}resumePausedMutations(){return r(this,E).resumePausedMutations()}getQueryCache(){return r(this,c)}getMutationCache(){return r(this,E)}getDefaultOptions(){return r(this,T)}setDefaultOptions(t){n(this,T,t)}setQueryDefaults(t,e){r(this,$).set(fe(t),{queryKey:t,defaultOptions:e})}getQueryDefaults(t){const e=[...r(this,$).values()];let s={};return e.forEach(i=>{ye(t,i.queryKey)&&(s={...s,...i.defaultOptions})}),s}setMutationDefaults(t,e){r(this,B).set(fe(t),{mutationKey:t,defaultOptions:e})}getMutationDefaults(t){const e=[...r(this,B).values()];let s={};return e.forEach(i=>{ye(t,i.mutationKey)&&(s={...s,...i.defaultOptions})}),s}defaultQueryOptions(t){if(t!=null&&t._defaulted)return t;const e={...r(this,T).queries,...(t==null?void 0:t.queryKey)&&this.getQueryDefaults(t.queryKey),...t,_defaulted:!0};return e.queryHash||(e.queryHash=qe(e.queryKey,e)),typeof e.refetchOnReconnect>"u"&&(e.refetchOnReconnect=e.networkMode!=="always"),typeof e.throwOnError>"u"&&(e.throwOnError=!!e.suspense),typeof e.networkMode>"u"&&e.persister&&(e.networkMode="offlineFirst"),e}defaultMutationOptions(t){return t!=null&&t._defaulted?t:{...r(this,T).mutations,...(t==null?void 0:t.mutationKey)&&this.getMutationDefaults(t.mutationKey),...t,_defaulted:!0}}clear(){r(this,c).clear(),r(this,E).clear()}},c=new WeakMap,E=new WeakMap,T=new WeakMap,$=new WeakMap,B=new WeakMap,R=new WeakMap,G=new WeakMap,L=new WeakMap,Ce);const lt=document.getElementById("root"),dt=De(lt),ft=new ct;function gt(t){dt.render(C.jsx(Y.StrictMode,{children:C.jsx(Le,{children:C.jsx(Ne,{children:C.jsx(it,{children:C.jsx(We,{client:ft,children:C.jsx(t,{})})})})})}))}export{gt as default};