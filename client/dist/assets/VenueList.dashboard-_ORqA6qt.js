import{j as r}from"./QueryClientProvider-8Ly9q1Dj.js";import{f as t,L as o,c as d}from"./App-VPmrma5G.js";import"./index-5BxWyWw0.js";function p(){const{data:s,isLoading:i,isError:n,error:a}=t({queryKey:["venues_list"],queryFn:async()=>(await d.get("/v1/admin/get-venues")).data});return i?r.jsx("div",{children:"Loading..."}):n?r.jsxs("div",{children:["Error: ",a.message]}):r.jsx("div",{children:r.jsx("div",{children:s.map(e=>r.jsx(o,{to:e.id,children:e.name},e.id))})})}export{p as default};
