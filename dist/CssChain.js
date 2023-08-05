"use strict";import{setProp as x}from"./ApiChain.js";export const map=(t,...e)=>Array.prototype.map.apply(t,e),csv=(t,...e)=>map(t,...e).join(","),collectionText=t=>map(t,e=>getNodeText(e)).join("");const u=t=>document.createElement(t);function L(t,e,o){const n=u(t);return n[e]=o,n}export function isNode(t){return!!t?.nodeType}const w=()=>"",f=t=>Array.isArray(t)||t&&typeof t.forEach=="function",g=(t,e)=>typeof t===e,y=t=>g(t,"string"),$=t=>g(t,"number"),m=t=>g(t,"function"),O=t=>t.getRootNode().host,T=t=>O(t)&&t.assignedNodes,a=(t,e)=>(t.forEach(e),t),C=t=>T(t)?t.assignedNodes().forEach(e=>e.remove()):t.innerHTML="",P={1:t=>t.assignedNodes?collectionText(t.assignedNodes())||collectionText(t.childNodes):["SCRIPT","AUDIO","STYLE","CANVAS","DATALIST","EMBED","OBJECT","PICTURE","IFRAME","METER","NOSCRIPT","SELECT","OPTGROUP","PROGRESS","TEMPLATE","VIDEO"].includes(t.nodeName)?"":t.innerText,3:t=>t.nodeValue,11:t=>collectionText(t.childNodes)};export const getNodeText=t=>(P[t.nodeType]||w)(t),setNodeText=(t,e)=>T(t)?t.assignedElements().forEach(o=>o.innerText=e):t.innerText=e,assignParent=(t,e)=>t.map(o=>e.appendChild(o)),collectionHtml=t=>map(t,e=>e.assignedElements?map(e.assignedElements(),o=>o.outerHTML).join(""):e.innerHTML).join(""),html2NodeArr=t=>{let e=u("div");isNode(t)?e.append(t.cloneNode(!0)):f(t)?a(t,n=>a(html2NodeArr(n),r=>e.appendChild(r))):e.innerHTML=t;const o=n=>{if(n.nodeType!==3)return n;const r=u("span");return r.append(n),r};return[...e.childNodes].map(n=>(n.remove(),n)).map(o)},addNodeHtml=(t,e)=>{const o=(r,s)=>s instanceof Node?s.remove()||r.append(s):html2NodeArr(s).forEach(i=>r.append(i)),n=r=>T(t)?t.assign(...t.assignedNodes(),...assignParent(a(html2NodeArr(r),s=>s.slot=t.name),t.getRootNode().host)):o(t,r);e instanceof NodeList||f(e)?[...e].forEach(n):n(e)},setNodeHtml=(t,e)=>{C(t),addNodeHtml(t,e)};function M(t){if(t?.flatten){const e=[],o=n=>n.CssChainAssignedNodes?a(n.CssChainAssignedNodes,o):e.push(n);return a(this.CssChainAssignedNodes,o),e}return this.CssChainAssignedNodes}class p extends Array{attr(...e){if(e.length<2)return this.getAttribute(...e);let[o,n,r]=e,s=this.$(r);return m(n)?s.map((i,h,l)=>n(i,h,l,this)).forEach((i,h)=>s[h].setAttribute(o,i)):s.setAttribute(...e),this}prop(...e){if(e.length<2)return this[0][e[0]];let[o,n,r]=e,s=this.$(r);return m(n)?s.map((i,h,l)=>n(i,h,l,this)).forEach((i,h)=>s[h][o]=i):s.forEach(i=>i[o]=n),this}forEach(...e){return Array.prototype.forEach.apply(this,e),this}map(...e){return map(this,...e)}push(...e){return Array.prototype.push.apply(this,e),this}querySelector(e){return new p().push(this.querySelectorAll(e)[0])}querySelectorAll(e){return this.reduce((o,n)=>o.push(...(n.shadowRoot||n).querySelectorAll(e)),new p)}$(...e){return e.length&&e[0]?this.querySelectorAll(...e):this}parent(e){const o=new Set,n=s=>o.has(s)?0:(o.add(s),s),r=s=>{for(;s=s.parentElement;)if(s.matches(e))return n(s)};return CssChain(this.map(e?r:s=>n(s.parentElement)).filter(s=>s))}on(...e){return this.addEventListener(...e)}append(e){return this.forEach(o=>addNodeHtml(o,e))}remove(...e){return e.length?m(e[1])?this.removeEventListener(...e):this.map(o=>o.matches(e[0])).filter(o=>o):(this.forEach(o=>o.remove()),new p)}erase(){return this.forEach(e=>C(e))}slots(...e){const o=e.length?csv(e[0].split(","),s=>['""',"''"].includes(s)||!s?"slot:not([name])":`slot[name="${s}"]`):"slot",n=this.filter(s=>s.matches&&s.matches(o)),r=this.filter(s=>!n.includes(s)&&s.querySelector).map(s=>s.shadowRoot||s).$(e.length?csv(e[0].split(","),s=>['""',"''"].includes(s)||!s?"slot:not([name])":`slot[name="${s}"]`):"slot");return e.length===2?(r.html(e[1]),this):CssChain([...n,...r])}template(e){if(e===void 0){const r=this.$("[slot]").forEach(s=>this.$(s.slot?`slot[name="${s.slot}"]`:"slot:not([name])").length||s.parentNode.insertBefore(L("slot","name",s.slot),s));r.remove(),e=u("template"),this.childNodes.forEach(s=>e.content.append(s)),this.append(r)}else y(e)&&(e=this.$(e),e.remove());e=e.cloneNode(!0);const o=e.content?e.content.childNodes:e;return CssChain(o).slots().forEach(r=>{const s=this.children.filter(d=>d.slot===r.name),i=r.parentNode;r.CssChainAssignedNodes=[],r.assignedNodes=r.assignedElements=M;const h=(d,c)=>{const N=i.insertBefore(d,c);return d.CssChainAssignedSlot||r.CssChainAssignedNodes.push(d),d.CssChainAssignedSlot=r,N};a(s,d=>d.cssChainSlot=r);const l=(d,c)=>{if(d.tagName==="SLOT"){const N=d.parentNode,A=h(d,c);a(N.querySelectorAll(`[slot="${d.name}"]`),S=>i.insertBefore(S,A))}else h(d,c)};a(s,d=>l(d,r)),s.length&&(r.hidden=!0)}),this.children.filter(r=>!r.cssChainSlot).remove(),this.append(CssChain(html2NodeArr("<light-dom></light-dom>")).append(o)),this}get innerText(){return this.txt()}set innerText(e){return this.txt(e)}txt(e,o=void 0){const n=this.$(o);return e===void 0?collectionText(n):(n.forEach(m(e)?(r,s)=>setNodeText(r,e(r,s,n,this)):r=>setNodeText(r,e)),this)}get outerHTML(){return this.map(e=>e.outerHTML).join("")}set outerHTML(e){return this.forEach((o,n,r)=>{const s=o.parentNode;html2NodeArr(m(e)?e(o,n,r):e).forEach(i=>s.insertBefore(r[n]=i,o)),o.remove()})}get innerHTML(){return this.html()}set innerHTML(e){return this.html(e)}html(e,o=void 0){const n=o?this.$(o):this;return e===void 0?collectionHtml(n):(n.forEach(m(e)?(r,s)=>setNodeHtml(r,e(r,s,n)):r=>setNodeHtml(r,e)),this)}assignedElements(e){return CssChain([].concat(...this.map(o=>o.assignedElements?o.assignedElements(e):[])))}assignedNodes(e){return CssChain([].concat(...this.map(o=>o.assignedNodes?o.assignedNodes(e):[])))}cloneNode(...e){return this.map(o=>o.cloneNode&&o.cloneNode(...e))}clone(e=1,o=void 0){let n=e;if($(e)&&(n=Array.from({length:e},(s,i)=>i)),f(n)){const s=[];return this.forEach(i=>n.forEach((h,l)=>{const d=i.ownerDocument.importNode(i,!0),c=o&&o(d,h,l,n);y(c)?s.push(...html2NodeArr(c)):f(c)?s.push(...c):s.push(isNode(c)?c:d)})),CssChain(s)}const r=e;return this.map(s=>r?r.importNode(s,!0):s.cloneNode?s.cloneNode(!0):Object.assign({},s))}get firstElementChild(){return CssChain(this.map(e=>e.firstElementChild).filter(e=>e))}get firstChild(){return CssChain(this.map(e=>e.firstChild).filter(e=>e))}get childNodes(){return CssChain([].concat(...map(this,e=>[...e.childNodes||[]])))}get children(){return CssChain([].concat(...map(this,e=>[...e.children||[]])))}}const E=new Set,R=Object.getPrototypeOf({});export function applyPrototype(t,e){const o=y(t)?u(t):t;if(!E.has(o.tagName)){E.add(o.tagName);for(let n in o)n in e.prototype||x(o,n,e);for(let n;(n=Object.getPrototypeOf(o))!==R&&n!=null&&!E.has(n);){E.add(n);for(let r of Object.getOwnPropertyNames(n))r in e.prototype||x(o,r,e)}}}Object.getOwnPropertyNames(window).filter(t=>t.startsWith("HTML")&&t.endsWith("Element")&&t.length>11).map(t=>t.substring(4,t.length-7).toLowerCase()).forEach(t=>applyPrototype(u(t),p));export function CssChain(t,e=document,o=[]){const n=typeof t=="string"?(e.shadowRoot||e).querySelectorAll(t):f(t)?t:[t?t.shadowRoot||t:document];f(o)?o.length||(o=[...n].slice(0,256)):o=[o],o.forEach(s=>applyPrototype(s,p));const r=new p;return r.push(...n),r}export default CssChain;
//# sourceMappingURL=CssChain.js.map
