(this.webpackJsonptool=this.webpackJsonptool||[]).push([[0],{29:function(e,t,n){},31:function(e,t,n){},32:function(e,t,n){},34:function(e,t,n){},35:function(e,t,n){},58:function(e,t,n){"use strict";n.r(t);var c=n(2),a=n.n(c),r=n(18),i=n.n(r),o=(n(29),n(6)),l=n(19),s=n(4),u=n(5),d=n.n(u),j=(n(31),n(32),n(0)),v=function(e){var t=e.onClick,n=e.data,a=e.curr,r=Object(c.useState)(""),i=Object(s.a)(r,2),o=i[0],l=i[1];return Object(j.jsxs)("header",{className:"header",children:[Object(j.jsx)("ul",{className:"header-left",children:function(){for(var e=[],c=function(e){return""!==o?o===e?"item item-hover":"item":a===e?"item item-hover":"item"},r=function(a){var r=n[a];e.push(Object(j.jsx)("li",{className:c(r.type),onClick:function(){t(r.type)},onMouseEnter:function(){l(r.type)},onMouseLeave:function(){l("")},children:Object(j.jsx)("span",{className:"item-text",children:r.type})},a))},i=0;i<n.length;i++)r(i);return e}()}),Object(j.jsx)("div",{className:"header-right",children:Object(j.jsx)("a",{className:"about",href:"/admin",children:"\u767b\u5f55"})})]})},f=(n(34),n(35),function(e){var t=e.title,n=e.url,a=e.des,r=e.logo,i=Object(c.useState)(!1),o=Object(s.a)(i,2),l=o[0],u=o[1];return Object(j.jsxs)("div",{className:l?"card-box card-box-hover":"card-box",onMouseEnter:function(){u(!0)},onMouseLeave:function(){u(!1)},onClick:function(e){e.stopPropagation(),window.open(n)},children:[Object(j.jsx)("div",{className:"card-header",children:Object(j.jsxs)("div",{className:"card-header-left",children:[Object(j.jsx)("img",{src:r,alt:t,width:"40px",height:"40px"}),Object(j.jsx)("a",{href:n,target:"_blank",rel:"noreferrer",className:l?"card-title card-title-hover":"card-title",children:t})]})}),Object(j.jsx)("div",{className:"card-des",children:a}),Object(j.jsx)("div",{className:"card-url",children:n.replace("https://","").replace("http://","")})]})}),h=function(e){var t=e.curr,n=e.data;return Object(j.jsx)("div",{className:"content",children:function(){var e;if(n)return(null===(e=n.find((function(e){return e.type===t})))||void 0===e?void 0:e.list).map((function(e){return Object(j.jsx)(f,{title:e.name,url:e.url,des:e.desc,logo:e.logo},e.id)}))}()})},b=n(20),p=n(24),m=n.n(p),O=function(){var e=Object(o.a)(d.a.mark((function e(){var t;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,m.a.get("/api/");case 2:return t=e.sent,e.abrupt("return",t.data);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),g=O;var x=function(){var e=Object(c.useState)(),t=Object(s.a)(e,2),n=t[0],a=t[1],r=Object(c.useState)(!1),i=Object(s.a)(r,2),u=i[0],f=i[1],p=Object(c.useState)({title:"Van Nav",favicon:"https://pic.mereith.com/img/male.svg"}),m=Object(s.a)(p,2),O=m[0],x=m[1],w=Object(c.useState)([]),N=Object(s.a)(w,2),S=N[0],k=N[1],y=function(e){for(var t=[],n=e.map((function(e){return e.catelog})),c=0,a=Array.from(new Set(n));c<a.length;c++){var r,i=a[c],o={type:i},s=[],u=Object(l.a)(e);try{for(u.s();!(r=u.n()).done;){var d=r.value;d.catelog===i&&s.push(d)}}catch(j){u.e(j)}finally{u.f()}o.list=s,t.push(o)}return t},C=Object(c.useCallback)(Object(o.a)(d.a.mark((function e(){var t,c,r,i,o,l,s,u;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,g();case 3:null!==(r=e.sent)&&void 0!==r&&null!==(t=r.data)&&void 0!==t&&t.setting&&x(null===r||void 0===r||null===(i=r.data)||void 0===i?void 0:i.setting),o=y(null===r||void 0===r||null===(c=r.data)||void 0===c?void 0:c.tools),!n&&o.length&&a(null===(l=o[0])||void 0===l?void 0:l.type),window.localStorage.getItem("door")?k(o):k(y(null===r||void 0===r||null===(s=r.data)||void 0===s||null===(u=s.tools)||void 0===u?void 0:u.filter((function(e){return!(r.data&&r.data.privateList&&r.data.privateList.includes(e.catelog))})))),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0),console.log(e.t0);case 13:f(!0);case 14:case"end":return e.stop()}}),e,null,[[0,10]])}))),[k,n,a,x,f]);return Object(c.useEffect)((function(){"?door"===window.location.search&&window.localStorage.setItem("door","1"),0!==S.length||u||C(),window.localStorage.getItem("curr")&&a(window.localStorage.getItem("curr"))}),[S,C,a,u]),Object(j.jsxs)("div",{className:"App",children:[Object(j.jsxs)(b.a,{children:[Object(j.jsx)("meta",{charSet:"utf-8"}),Object(j.jsx)("link",{rel:"icon",href:null===O||void 0===O?void 0:O.favicon}),Object(j.jsx)("title",{children:null===O||void 0===O?void 0:O.title})]}),Object(j.jsx)(v,{onClick:function(e){window.localStorage.setItem("curr",e),a(e)},data:S,curr:n}),Object(j.jsx)("div",{className:"main",children:function(){if(S.length)return Object(j.jsx)(h,{data:S,curr:n})}()})]})},w=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,59)).then((function(t){var n=t.getCLS,c=t.getFID,a=t.getFCP,r=t.getLCP,i=t.getTTFB;n(e),c(e),a(e),r(e),i(e)}))};i.a.render(Object(j.jsx)(a.a.StrictMode,{children:Object(j.jsx)(x,{})}),document.getElementById("root")),w()}},[[58,1,2]]]);
//# sourceMappingURL=main.39bffd4f.chunk.js.map