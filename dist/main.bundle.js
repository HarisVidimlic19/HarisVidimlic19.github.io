"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[179],{527:()=>{var e;e=function(){var e="undefined"!=typeof window?window:this,t=e.Glider=function(t,o){var i=this;if(t._glider)return t._glider;if(i.ele=t,i.ele.classList.add("glider"),(i.ele._glider=i).opt=Object.assign({},{slidesToScroll:1,slidesToShow:1,resizeLock:!0,duration:.5,easing:function(e,t,o,i,r){return i*(t/=r)*t+o}},o),i.animate_id=i.page=i.slide=0,i.arrows={},i._opt=i.opt,i.opt.skipTrack)i.track=i.ele.children[0];else for(i.track=document.createElement("div"),i.ele.appendChild(i.track);1!==i.ele.children.length;)i.track.appendChild(i.ele.children[0]);i.track.classList.add("glider-track"),i.init(),i.resize=i.init.bind(i,!0),i.event(i.ele,"add",{scroll:i.updateControls.bind(i)}),i.event(e,"add",{resize:i.resize})},o=t.prototype;return o.init=function(e,t){var o,i=this,r=0,s=0,n=(i.slides=i.track.children,[].forEach.call(i.slides,(function(e,t){e.classList.add("glider-slide"),e.setAttribute("data-gslide",t)})),i.containerWidth=i.ele.clientWidth,i.settingsBreakpoint());t=t||n,"auto"!==i.opt.slidesToShow&&void 0===i.opt._autoSlide||(o=i.containerWidth/i.opt.itemWidth,i.opt._autoSlide=i.opt.slidesToShow=i.opt.exactWidth?o:Math.max(1,Math.floor(o))),"auto"===i.opt.slidesToScroll&&(i.opt.slidesToScroll=Math.floor(i.opt.slidesToShow)),i.itemWidth=i.opt.exactWidth?i.opt.itemWidth:i.containerWidth/i.opt.slidesToShow,[].forEach.call(i.slides,(function(e){e.style.height="auto",e.style.width=i.itemWidth+"px",r+=i.itemWidth,s=Math.max(e.offsetHeight,s)})),i.track.style.width=r+"px",i.trackWidth=r,i.isDrag=!1,i.preventClick=!1,i.move=!1,i.opt.resizeLock&&i.scrollTo(i.slide*i.itemWidth,0),(n||t)&&(i.bindArrows(),i.buildDots(),i.bindDrag()),i.updateControls(),i.emit(e?"refresh":"loaded")},o.bindDrag=function(){function e(){t.mouseDown=void 0,t.ele.classList.remove("drag"),t.isDrag&&(t.preventClick=!0),t.isDrag=!1}var t=this;function o(){t.move=!0}t.mouse=t.mouse||t.handleMouse.bind(t);var i={mouseup:e,mouseleave:e,mousedown:function(e){e.preventDefault(),e.stopPropagation(),t.mouseDown=e.clientX,t.ele.classList.add("drag"),t.move=!1,setTimeout(o,300)},touchstart:function(e){t.ele.classList.add("drag"),t.move=!1,setTimeout(o,300)},mousemove:t.mouse,click:function(e){t.preventClick&&t.move&&(e.preventDefault(),e.stopPropagation()),t.preventClick=!1,t.move=!1}};t.ele.classList.toggle("draggable",!0===t.opt.draggable),t.event(t.ele,"remove",i),t.opt.draggable&&t.event(t.ele,"add",i)},o.buildDots=function(){var e=this;if(e.opt.dots){if("string"==typeof e.opt.dots?e.dots=document.querySelector(e.opt.dots):e.dots=e.opt.dots,e.dots){e.dots.innerHTML="",e.dots.setAttribute("role","tablist"),e.dots.classList.add("glider-dots");for(var t=0;t<Math.ceil(e.slides.length/e.opt.slidesToShow);++t){var o=document.createElement("button");o.dataset.index=t,o.setAttribute("aria-label","Page "+(t+1)),o.setAttribute("role","tab"),o.className="glider-dot "+(t?"":"active"),e.event(o,"add",{click:e.scrollItem.bind(e,t,!0)}),e.dots.appendChild(o)}}}else e.dots&&(e.dots.innerHTML="")},o.bindArrows=function(){var e=this;e.opt.arrows?["prev","next"].forEach((function(t){var o=e.opt.arrows[t];(o=o&&("string"==typeof o?document.querySelector(o):o))&&(o._func=o._func||e.scrollItem.bind(e,t),e.event(o,"remove",{click:o._func}),e.event(o,"add",{click:o._func}),e.arrows[t]=o)})):Object.keys(e.arrows).forEach((function(t){t=e.arrows[t],e.event(t,"remove",{click:t._func})}))},o.updateControls=function(e){var t=this,o=(e&&!t.opt.scrollPropagate&&e.stopPropagation(),t.containerWidth>=t.trackWidth),i=(t.opt.rewind||(t.arrows.prev&&(t.arrows.prev.classList.toggle("disabled",t.ele.scrollLeft<=0||o),t.arrows.prev.setAttribute("aria-disabled",t.arrows.prev.classList.contains("disabled"))),t.arrows.next&&(t.arrows.next.classList.toggle("disabled",Math.ceil(t.ele.scrollLeft+t.containerWidth)>=Math.floor(t.trackWidth)||o),t.arrows.next.setAttribute("aria-disabled",t.arrows.next.classList.contains("disabled")))),t.slide=Math.round(t.ele.scrollLeft/t.itemWidth),t.page=Math.round(t.ele.scrollLeft/t.containerWidth),t.slide+Math.floor(Math.floor(t.opt.slidesToShow)/2)),r=Math.floor(t.opt.slidesToShow)%2?0:i+1;1===Math.floor(t.opt.slidesToShow)&&(r=0),t.ele.scrollLeft+t.containerWidth>=Math.floor(t.trackWidth)&&(t.page=t.dots?t.dots.children.length-1:0),[].forEach.call(t.slides,(function(e,o){var s=e.classList,n=(e=s.contains("visible"),t.ele.scrollLeft),l=t.ele.scrollLeft+t.containerWidth,a=(c=t.itemWidth*o)+t.itemWidth,c=([].forEach.call(s,(function(e){/^left|right/.test(e)&&s.remove(e)})),s.toggle("active",t.slide===o),i===o||r&&r===o?s.add("center"):(s.remove("center"),s.add([o<i?"left":"right",Math.abs(o-(!(o<i)&&r||i))].join("-"))),Math.ceil(c)>=Math.floor(n)&&Math.floor(a)<=Math.ceil(l));s.toggle("visible",c),c!==e&&t.emit("slide-"+(c?"visible":"hidden"),{slide:o})})),t.dots&&[].forEach.call(t.dots.children,(function(e,o){e.classList.toggle("active",t.page===o)})),e&&t.opt.scrollLock&&(clearTimeout(t.scrollLock),t.scrollLock=setTimeout((function(){clearTimeout(t.scrollLock),.02<Math.abs(t.ele.scrollLeft/t.itemWidth-t.slide)&&(t.mouseDown||t.trackWidth>t.containerWidth+t.ele.scrollLeft&&t.scrollItem(t.getCurrentSlide()))}),t.opt.scrollLockDelay||250))},o.getCurrentSlide=function(){return this.round(this.ele.scrollLeft/this.itemWidth)},o.scrollItem=function(e,t,o){o&&o.preventDefault();var i,r=this,s=e,n=(++r.animate_id,o=r.slide,!0===t?(e=Math.round(e*r.containerWidth/r.itemWidth))*r.itemWidth:("string"==typeof e&&(n="prev"===e,e=r.opt.slidesToScroll%1||r.opt.slidesToShow%1?r.getCurrentSlide():r.slide,n?e-=r.opt.slidesToScroll:e+=r.opt.slidesToScroll,r.opt.rewind&&(i=r.ele.scrollLeft,e=n&&!i?r.slides.length:!n&&i+r.containerWidth>=Math.floor(r.trackWidth)?0:e)),e=Math.max(Math.min(e,r.slides.length),0),r.slide=e,r.itemWidth*e));return r.emit("scroll-item",{prevSlide:o,slide:e}),r.scrollTo(n,r.opt.duration*Math.abs(r.ele.scrollLeft-n),(function(){r.updateControls(),r.emit("animated",{value:s,type:"string"==typeof s?"arrow":t?"dot":"slide"})})),!1},o.settingsBreakpoint=function(){var t=this,o=t._opt.responsive;if(o){o.sort((function(e,t){return t.breakpoint-e.breakpoint}));for(var i=0;i<o.length;++i){var r=o[i];if(e.innerWidth>=r.breakpoint)return t.breakpoint!==r.breakpoint&&(t.opt=Object.assign({},t._opt,r.settings),t.breakpoint=r.breakpoint,!0)}}var s=0!==t.breakpoint;return t.opt=Object.assign({},t._opt),t.breakpoint=0,s},o.scrollTo=function(t,o,i){var r=this,s=(new Date).getTime(),n=r.animate_id,l=function(){var a=(new Date).getTime()-s;r.ele.scrollLeft=r.ele.scrollLeft+(t-r.ele.scrollLeft)*r.opt.easing(0,a,0,1,o),a<o&&n===r.animate_id?e.requestAnimationFrame(l):(r.ele.scrollLeft=t,i&&i.call(r))};e.requestAnimationFrame(l)},o.removeItem=function(e){var t=this;t.slides.length&&(t.track.removeChild(t.slides[e]),t.refresh(!0),t.emit("remove"))},o.addItem=function(e){this.track.appendChild(e),this.refresh(!0),this.emit("add")},o.handleMouse=function(e){var t=this;t.mouseDown&&(t.isDrag=!0,t.ele.scrollLeft+=(t.mouseDown-e.clientX)*(t.opt.dragVelocity||3.3),t.mouseDown=e.clientX)},o.round=function(e){var t=1/(this.opt.slidesToScroll%1||1);return Math.round(e*t)/t},o.refresh=function(e){this.init(!0,e)},o.setOption=function(e,t){var o=this;o.breakpoint&&!t?o._opt.responsive.forEach((function(t){t.breakpoint===o.breakpoint&&(t.settings=Object.assign({},t.settings,e))})):o._opt=Object.assign({},o._opt,e),o.breakpoint=0,o.settingsBreakpoint()},o.destroy=function(){function t(e){e.removeAttribute("style"),[].forEach.call(e.classList,(function(t){/^glider/.test(t)&&e.classList.remove(t)}))}var o=this,i=o.ele.cloneNode(!0);o.opt.skipTrack||(i.children[0].outerHTML=i.children[0].innerHTML),t(i),[].forEach.call(i.getElementsByTagName("*"),t),o.ele.parentNode.replaceChild(i,o.ele),o.event(e,"remove",{resize:o.resize}),o.emit("destroy")},o.emit=function(t,o){t=new e.CustomEvent("glider-"+t,{bubbles:!this.opt.eventPropagate,detail:o}),this.ele.dispatchEvent(t)},o.event=function(e,t,o){var i=e[t+"EventListener"].bind(e);Object.keys(o).forEach((function(e){i(e,o[e])}))},t},"function"==typeof define&&define.amd?define(e):"object"==typeof exports?module.exports=e():e();const t=document.querySelectorAll(".js-fullheight");function o(){const e=window.innerHeight;t.forEach((t=>t.style.height=`${e}px`))}window.addEventListener("resize",o),o();var i,r;i=document.querySelector(".js-fh5co-nav-toggle"),r=document.getElementById("ftco-nav"),i.addEventListener("click",(function(){r.classList.toggle("show")}));document.querySelectorAll('#ftco-nav a[href^="#"]').forEach((function(e){e.addEventListener("click",(function(t){t.preventDefault();var o=e.getAttribute("href"),i=document.querySelector(o).offsetTop;window.scrollTo({top:i-70,behavior:"smooth"})}))})),new Glider(document.querySelector(".glider"),{dots:".glider-dots"}).setOption({arrows:{prev:".glider-prev",next:".glider-next"}});const s=document.querySelector(".ftco_navbar");window.addEventListener("scroll",(()=>{const e=window.scrollY;e>150?s.classList.add("scrolled"):s.classList.remove("scrolled","awake"),e>350?s.classList.add("awake"):s.classList.remove("awake")})),function(){let e=new IntersectionObserver(((e,t)=>{e.forEach((e=>{e.isIntersecting&&!e.target.classList.contains("ftco-animated")&&(e.target.classList.contains("number")?function(e,t,o){const i=parseFloat(e.textContent)||0,r=(t-i)/o*10;let s=0;const n=()=>{s+=16;const l=Math.min(i+r*s,t);e.textContent=l.toLocaleString("en-US",{minimumFractionDigits:0}),s<o&&requestAnimationFrame(n)};n()}(e.target,e.target.dataset.number,2e4):e.target.classList.add("fadeIn","ftco-animated"),t.unobserve(e.target))}))}),{threshold:.2}),t=document.querySelectorAll(".ftco-animate"),o=document.querySelectorAll(".number");t.forEach((t=>{e.observe(t)})),o.forEach((t=>{e.observe(t)}))}(),async function(){try{const e=await fetch("../docs/data/output.html"),t=await e.text();document.getElementById("sidebar").innerHTML=t}catch(e){console.error(e)}}();const n=document.getElementById("solarSystemSVG");!function(){const e=n.width.baseVal.value/2,t=n.height.baseVal.value/2;var o=document.createElementNS("http://www.w3.org/2000/svg","circle");o.setAttribute("cx",e),o.setAttribute("cy",t),o.setAttribute("r",5),o.setAttribute("fill","yellow"),n.appendChild(o),fetch("./data/planetPositions.json").then((e=>e.json())).then((o=>{Object.entries(o).forEach((([o,i])=>{!function(e,t,o,i){const r=16,{A:s,ec:l,coordinates:a,color:c,scale:d,W:u}=t;var h=-a[0]*r+o,f=-a[1]*r+i;if("neptune"==e)return;if("uranus"==e)var p="hide";else p="show";var m=document.createElementNS("http://www.w3.org/2000/svg","circle");m.setAttribute("cx",h),m.setAttribute("cy",f),m.setAttribute("r",3*d),m.setAttribute("stroke","none"),m.setAttribute("fill",c),m.setAttribute("class",p),n.appendChild(m);const v=s*r,g=Math.sqrt(v*v*(1-l*l)),b=s*l*r,w=b*Math.sin(u),k=b*Math.cos(u);var L=document.createElementNS("http://www.w3.org/2000/svg","ellipse");L.setAttribute("cx",o-w/2),L.setAttribute("cy",i+k/2),L.setAttribute("rx",v),L.setAttribute("ry",g),L.setAttribute("fill","none"),L.setAttribute("stroke",c),L.setAttribute("stroke-width","1"),L.setAttribute("class",p),n.appendChild(L)}(o,i,e,t)}))}))}()}},e=>{var t;t=527,e(e.s=t)}]);