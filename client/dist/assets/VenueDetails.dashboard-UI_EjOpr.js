import{j as e,a as o}from"./QueryClientProvider-8Ly9q1Dj.js";import{d,f as c,e as i,H as x,g as m,L as s,O as u,c as p}from"./App-VPmrma5G.js";import"./index-5BxWyWw0.js";function y(){const{venueId:r}=d(),{data:a,isLoading:t,isError:l,error:n}=c({queryKey:["venue_details",r],queryFn:async()=>(await p.post(`/v1/admin/${r}/get-venue`)).data});return t?e.jsx("div",{children:"Loading..."}):l?e.jsxs("div",{children:["Error: ",n.message]}):e.jsxs(o.Fragment,{children:[e.jsxs(i,{dir:"row",align:"center",space:"sm",children:[e.jsx(x,{children:a.name}),e.jsx(m,{children:a.city})]}),e.jsx("hr",{}),e.jsxs(i,{dir:"row",align:"center",className:"",children:[e.jsxs("div",{className:"flex flex-col self-start w-1/4 divide-y divide-black bg-violet-700",children:[e.jsx(s,{to:"tables",className:"py-4 pl-4 font-semibold text-violet-100",children:"• Tables"}),e.jsx(s,{to:"bills",className:"py-4 pl-4 font-semibold text-violet-100",children:"• Bills"}),e.jsx(s,{to:"menus",className:"py-4 pl-4 font-semibold text-violet-100",children:"• Menus"})]}),e.jsx("div",{className:"w-3/4",children:e.jsx(u,{})})]})]})}export{y as default};