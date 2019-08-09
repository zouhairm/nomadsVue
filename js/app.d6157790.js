(function(e){function t(t){for(var a,i,s=t[0],c=t[1],l=t[2],d=0,h=[];d<s.length;d++)i=s[d],n[i]&&h.push(n[i][0]),n[i]=0;for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(e[a]=c[a]);u&&u(t);while(h.length)h.shift()();return r.push.apply(r,l||[]),o()}function o(){for(var e,t=0;t<r.length;t++){for(var o=r[t],a=!0,s=1;s<o.length;s++){var c=o[s];0!==n[c]&&(a=!1)}a&&(r.splice(t--,1),e=i(i.s=o[0]))}return e}var a={},n={app:0},r=[];function i(t){if(a[t])return a[t].exports;var o=a[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,i),o.l=!0,o.exports}i.m=e,i.c=a,i.d=function(e,t,o){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(i.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)i.d(o,a,function(t){return e[t]}.bind(null,a));return o},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=t,s=s.slice();for(var l=0;l<s.length;l++)t(s[l]);var u=c;r.push([0,"chunk-vendors"]),o()})({0:function(e,t,o){e.exports=o("56d7")},"034f":function(e,t,o){"use strict";var a=o("64a9"),n=o.n(a);n.a},"18fa":function(e,t,o){},"1acd":function(e,t,o){"use strict";var a=o("1fd1"),n=o.n(a);n.a},"1fd1":function(e,t,o){},"4cbd":function(e,t,o){"use strict";var a=o("6271"),n=o.n(a);n.a},"56d7":function(e,t,o){"use strict";o.r(t);o("cadf"),o("551c"),o("f751"),o("097d");var a=o("2b0e"),n=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{attrs:{id:"app"}},[o("div",{directives:[{name:"show",rawName:"v-show",value:!e.showAbout,expression:"!showAbout"}],staticClass:"legend"},[e._m(0),e._m(1)]),o("div",{attrs:{id:"mapCanvas"}}),o("div",{attrs:{id:"cnv"}}),e.showStory?o("story-view",{attrs:{id:"story",pars:e.storyViewPars}}):e._e(),e.isMobile()?e._e():o("search-view",{attrs:{id:"search"}}),e.showAbout?o("div",{staticClass:"about-box",attrs:{id:"about"}},[o("fa-icon",{staticClass:"close-about",attrs:{icon:["fas","window-close"]},on:{click:function(t){return t.preventDefault(),e.closeAbout()}}}),e._m(2),e._m(3)],1):e._e(),o("filter-view",{attrs:{id:"filter"}}),o("div",{staticClass:"footer"},[o("a",{staticClass:"about-link",on:{click:function(t){return t.preventDefault(),e.toggleAbout()}}},[e._v("About")]),e._m(4),e.showAbout?e._e():o("a",{staticClass:"options-link",on:{click:function(t){t.preventDefault(),e.showFilter=!e.showFilter&&!e.showAbout}}},[e._v("Settings")])])],1)},r=[function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"country"},[o("h4",[e._v("Author Country:")]),o("div",[o("span",{staticStyle:{"background-color":"#ffaa00"}}),e._v("Africa")]),o("div",[o("span",{staticStyle:{"background-color":"#fffb00"}}),e._v("Asia")]),o("div",[o("span",{staticStyle:{"background-color":"#0062ff"}}),e._v("Europe")]),o("div",[o("span",{staticStyle:{"background-color":"#37ff00"}}),e._v("N. America")]),o("div",[o("span",{staticStyle:{"background-color":"#fb00ff"}}),e._v("S. America")]),o("div",[o("span",{staticStyle:{"background-color":"#ff0015"}}),e._v("Oceania")])])},function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"links"},[o("h4",[e._v("Story Similarity:")]),o("div",[o("span",{staticStyle:{color:"#4949ff"}},[e._v("–")]),e._v("Most")]),o("div",[o("span",{staticStyle:{color:"gray"}},[e._v("–")]),e._v("Somewhat")]),o("div",[o("span",{staticStyle:{color:"red"}},[e._v("–")]),e._v("Least")])])},function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("h2",[e._v("About "),o("em",[e._v("Nomads' Vue")])])},function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticStyle:{"text-align":"left"}},[o("p",[o("span",{staticStyle:{"font-weight":"bold"}},[e._v("Intro")]),e._v("\n        This project is intended to help explore travel stories by thousands of people that have been submitted to the Travel Nomad Contest."),o("br"),e._v("\n\n        Hopefully this makes the submissions of these aspiring writers fun to explore, and that a wide audience of users finds it interesting; whether it be aspiring travel writers, daydreaming office workers thinking about exploring a new destination, or social scientists interested in understanding why and how people travel. In a time where it feels like differences between nations and their people are amplified, I hope this serves as reminder that so many of us are connected through the way we experience our planet and each other.\n\n        "),o("br"),o("br"),o("span",{staticStyle:{"font-weight":"bold"}},[e._v("How to Use")]),e._v("\n\n        When a story is hovered or selected, the story and its metadata (location, author, title) are displayed in a reading pane on the left. A Neural-Network model was trained on the stories to find relations between them, and similar as well as the least similar stories to the selected story that are identified by the model are highlighted and can be explored from the graph or the reading view."),o("br"),e._v("\n\n        The stories are displayed geographically and color-coded by the continent origin of the author. It is also possible to cluster most similar or least similar stories together using the options popup in the bottom-right corner.\n\n        The stories' metadata are searchable using the top-right corner box.\n        "),o("br"),o("br"),e._v("\n\n        Go Ahead - Explore the map, hover on stories, search for keywords, and enjoy reading the stories!"),o("br"),e._v("\n        If you get lost or the screen bugs up, "),o("b",[e._v("double click to reset")]),o("br"),o("br"),o("span",{staticStyle:{"font-weight":"bold"}},[e._v("Credits")]),e._v("\n        This project is made possible thanks to the following packages and data:\n        "),o("ul",[o("li",[o("a",{attrs:{target:"_blank",href:"https://www.worldnomads.com/create/scholarships/writing/2018/results"}},[e._v("Travel Nomad Stories")])]),o("li",[o("a",{attrs:{target:"_blank",href:"https://radimrehurek.com/gensim/models/doc2vec.html"}},[e._v("GenSim (Doc2Vec)")])]),o("li",[o("a",{attrs:{target:"_blank",href:"https://github.com/vuejs/awesome-vue"}},[e._v("Vue.js")])]),o("li",[o("a",{attrs:{target:"_blank",href:"https://github.com/anvaka/VivaGraphJS"}},[e._v("VivaGraphJS (w/ WebGL renderer)")])]),o("li",[o("a",{attrs:{target:"_blank",href:"https://www.mapbox.com/"}},[e._v("Mapbox")])])]),e._v("\n\n        For more background, insights, and technical details; check out my "),o("a",{attrs:{target:"_blank",href:"https://zouhairm.github.io/nomadStories"}},[e._v("Blog Post")])])])},function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("p",{staticClass:"copyText"},[e._v("\n          Made during late night hours by "),o("a",{attrs:{target:"_blank",href:"https://zouhairm.github.io/bio"}},[e._v("Zouhair M")])])}],i=(o("a69f"),o("0b21"),o("b54a"),o("ac6a"),o("b6d0")),s=o.n(i),c=o("00c7"),l=o.n(c),u=l()({}),d=u,h=o("768b"),f=o("2d1f"),p=o.n(f),m=o("8392"),v=o.n(m),g=o("bc3a"),y=o.n(g),b=o("e192");function w(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"2019",o="./Stories_viva_".concat(t,".json");return y.a.get(o).then(function(o){var a=_(e,o.data);d.fire("load-graph",a,t)})}function _(e,t){try{return k(e,t),v()(t)}catch(o){console.error("error loading JSON: ",o)}}function x(e,t){var o=e.project(new b["LngLat"](t["lon"],t["lat"]));return o}function k(e,t){for(var o=.1,a=.1/3,n=2*Math.PI/10/2,r=p()(t.metadata.countryPositions),i=0;i<r.length;i++){var s=Object(h["a"])(r[i],2),c=s[0],l=s[1];t.metadata.countryPositions[c].xypos=x(e,l),t.metadata.countryPositions[c].theta=0,t.metadata.countryPositions[c].R=o}t.nodes.forEach(function(e){var o=t.metadata.countryPositions[e.data["SetInCountry"]],r=o.xypos;e.data.position={x:r.x+o.R*Math.cos(o.theta),y:r.y+o.R*Math.sin(o.theta)},o.R+=a,o.theta+=n/Math.sqrt(o.R)})}function S(e){return e.data.position?e.data.position:{x:0,y:0}}o("63d9");var N=o("c3c3"),P=o.n(N);function A(e,t){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;this.size=e,this.color=t,this.alpha=o}function L(){var e,t,o,a,n,r,i,s,c,l=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,u=5,d=["precision mediump float;","varying vec4 color;","void main(void) {","   if ((gl_PointCoord.x - 0.5) * (gl_PointCoord.x - 0.5) + (gl_PointCoord.y - 0.5) * (gl_PointCoord.y - 0.5) < 0.25) {","     gl_FragColor = color;","   } else {","     gl_FragColor = vec4(0);","   }","}"].join("\n"),h=["attribute vec2 a_vertexPos;","attribute vec3 a_customAttributes;","uniform vec2 u_screenSize;","uniform mat4 u_transform;","varying vec4 color;","void main(void) {","   gl_Position = u_transform * vec4(a_vertexPos/u_screenSize, 0, 1);","   gl_PointSize = a_customAttributes[1] * sqrt(u_transform[0][0]);","   float c = a_customAttributes[0];","   color.b = mod(c, 256.0); c = floor(c/256.0);","   color.g = mod(c, 256.0); c = floor(c/256.0);","   color.r = mod(c, 256.0); c = floor(c/256.0); color /= 255.0;","   color.a = a_customAttributes[2];","}"].join("\n"),f=new Float32Array(64),p=0,m=l;return{load:function(r){o=r,t=P.a.Graph.webgl(r),e=t.createProgram(h,d),o.useProgram(e),n=t.getLocations(e,["a_vertexPos","a_customAttributes","u_screenSize","u_transform"]),o.enableVertexAttribArray(n.vertexPos),o.enableVertexAttribArray(n.customAttributes),a=o.createBuffer()},position:function(e,t){var o=e.id;f[o*u]=t.x,f[o*u+1]=-t.y,f[o*u+2]=e.color,f[o*u+3]=e.size,f[o*u+4]=e.alpha},render:function(){o.useProgram(e),o.bindBuffer(o.ARRAY_BUFFER,a),o.bufferData(o.ARRAY_BUFFER,f,o.DYNAMIC_DRAW),c&&(c=!1,o.uniformMatrix4fv(n.transform,!1,s),o.uniform2f(n.screenSize,r,i)),o.vertexAttribPointer(n.vertexPos,2,o.FLOAT,!1,u*Float32Array.BYTES_PER_ELEMENT,0),o.vertexAttribPointer(n.customAttributes,3,o.FLOAT,!1,u*Float32Array.BYTES_PER_ELEMENT,8),o.drawArrays(o.POINTS,0,p)},updateTransform:function(e){s=e,c=!0,m&&m(e)},updateSize:function(e,t){r=e,i=t,c=!0},createNode:function(e){f=t.extendArray(f,p,u),p+=1},removeNode:function(e){p>0&&(p-=1),e.id<p&&p>0&&t.copyArrayPart(f,e.id*u,p*u,u)},replaceProperties:function(e,t){}}}var C=o("dd42").nodes,E=o("dd42").links;function T(e,t){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"geo",a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:void 0,n=a||{nodes:new s.a([t]),links:new s.a};if("geo"==o)C(e).neighbors(t.id).forEach(function(e){return n.nodes.add(e)}),E(e).from(t.id).forEach(function(e){return n.links.add(e)});else{var r=new s.a([]);t.links.forEach(function(e){e.data[o]&&(n.links.add(e),r.add(e.fromId).add(e.toId))});var i=[];r.forEach(function(t){var o=e.getNode(t);n.nodes.has(o)||(n.nodes.add(o),i.push(o))}),i.forEach(function(t){return T(e,t,o,n)})}return n}function M(e,t){var o,a,n,r,i,c=t,l={nodes:[],links:[],sticky:!1};return i={container:e,interactive:"drag",layoutType:"geo"},d.on("load-graph",u),d.on("emulate-node-click",p),d.on("emulate-node-hover",f),d.on("resetview",h),w(c),{graph:o,rendererSettings:i,dispose:F,resetView:I,toggleLayout:V};function u(t){a&&(h(),a.dispose(),a=null,i.freakyLayout=null),o=t,n=P.a.Graph.Layout.constant(o),n.placeNode(S),i.layout=n,r=P.a.Graph.View.webglGraphics(),r.link(function(e){return P.a.Graph.View.webglLine(D(e))}),r.setNodeProgram(L(x)),r.node(function(e){var t=M(e,!1);return new A(C(e,!1),t.color,t.alpha)});var s=r.releaseLink;r.releaseLink=function(e){r.getLinkUI(e.id)&&s(e)},i.graphics=r;var u=P.a.Graph.webglInputEvents(r,o);u.mouseEnter(function(e){l.sticky?l.nodes.has(e)&&d.fire("node-clicked",e):f(e)}).mouseLeave(function(e){l.sticky||(m(l),a.rerender())}).click(function(e){l.sticky?l.nodes.has(e)&&p(e):p(e)}),e.ondblclick=h,e.addEventListener("touchend",function(e){if(e.changedTouches.length>=1){var t=new MouseEvent("mouseup",e.changedTouches[0]);r.getGraphicsRoot().dispatchEvent(t)}}),e.onwheel=function(e){var t=c.getZoom();c.disableZoomPan&&(t=5);var o=a.getTransform().scale,n=1,r=-Math.sign(e.wheelDelta);if(r<0&&t<10){if(n=Math.pow(1.4,-.1*r),o*=n,!c.disableZoomPan&&Math.log2(o)+1>10)return}else if(r>0&&t>1&&(n=Math.pow(1.4,-.1*r),o*=n,!c.disableZoomPan&&Math.log2(o)+1<1))return;a.getGraphics().scale(n,{x:e.pageX,y:e.pageY}),a.getTransform().scale=o,a.rerender(),setTimeout(function(){a.rerender()},200)},i.renderLinks=!1,a=P.a.Graph.View.renderer(o,i),i.container.onresize=function(){a&&(a.reset(),k())},a&&(a.run(),k(),a.on("scroll",function(t,o){return e.onwheel({wheelDelta:t,pageX:o.x,pageY:o.y})}))}function h(){m(l),l.sticky=!1,o.forEachNode(function(e){return _(e,!1)}),d.fire("node-hovered",null),k()}function f(e){m(l),l=v(e),a.rerender(),d.fire("node-hovered",e)}function p(e){m(l),o.forEachNode(b),l=v(e),l.sticky=!0,_(e,1),a.rerender(),d.fire("node-clicked",e)}function m(e){e.nodes.forEach(function(e){return _(e,!1)}),e.links.forEach(function(e){return y(e,!1)}),i.renderLinks=!1,e.nodes=[],e.links=[]}function v(e){var t=T(o,e,i.layoutType);return t.nodes.forEach(function(e){return _(e,!0)}),t.links.forEach(function(e){return y(e,!0)}),i.renderLinks=t.links.size>0,t}function g(){E(o).forEach(function(e){return y(e,R(e))})}function y(e,t){if(t){var o=n.getLinkPosition(e.id);r.addLink(e,o)}else r.releaseLink(e)}function b(e){var t=r.getNodeUI(e.id);t.alpha=0}function _(e,t){var o=r.getNodeUI(e.id);if(o){var a=M(e,t);o.color=a.color,o.alpha=a.alpha,o.size=C(e,t)}}function x(e){if(!c.disableZoomPan){var t=e[0];c.jumpTo({zoom:Math.log2(t)+1,center:[0,0]});var o={x:(e[12]+1)/2,y:-(e[13]+1)/2+1};o.x+=(t-1)/2,o.y+=(t-1)/2;var n={x:-o.x*c._container.clientWidth+.5*c._container.clientWidth,y:-o.y*c._container.clientHeight+.5*c._container.clientHeight},r=c.unproject(n);c.jumpTo({center:r});var i=c.project(r);Math.abs(i.y-c._container.clientHeight/2)>5&&a.moveTo(n.x,n.y-(r.lat<0?5:-5))}}function k(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,o={x:c._container.clientWidth/2,y:c._container.clientHeight/2};if(null==t){var r=n.getGraphRect();i.forceDirLayout&&(r=i.forceDirLayout.getGraphRect());var s=Math.min(r.x2-r.x1,r.y2-r.y1),l=2*Math.min(o.x,o.y);t=l/s*.8}var u=function(){a.moveTo(o.x,o.y),e&&(a.rerender(),setTimeout(function(){a.rerender()},200))};N(t,a.getTransform().scale,u)}function N(e,t){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,n=t;e<t?n=a.zoomOut():e>t&&(n=a.zoomIn()),Math.abs(e-n)>Math.abs(t-n)/2?setTimeout(function(){return N(e,n,o)},20):null!=o&&o()}function C(e,t){return 1===t?4:t?3:2}function M(e,t){var o={EU:25343,NA:3669760,SA:16449791,AF:16755200,AS:16775936,OC:16711701,highlighted:16777215,"N/A":8224125},a={color:o[e.data.AuthorCont]||o["N/A"],alpha:t?.9:.6};return 1===t&&(a.color=16777215),a}function D(e){if(e.data){if(e.data.mostSimilar)return 1111031807;if(e.data.leastSimilar)return 4281874687}return 3739022079}function I(){a&&(a.reset(),k())}function F(){d.off("load-graph",u)}function R(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:3;if(!e.data.leastSimilar)return!1;var a=[new s.a,new s.a];return o.getNode(e.fromId).links.forEach(function(e){e.data.leastSimilar&&a[0].add(e.fromId).add(e.toId)}),o.getNode(e.toId).links.forEach(function(e){e.data.leastSimilar&&a[1].add(e.fromId).add(e.toId)}),a[0].size>=t+1||a[1].size>=t+1}function j(e,t,o){"mostSimilar"==o?e.data.mostSimilar?(t.length=5,t.weight=3):e.data.leastSimilar?(t.length=1e3*e.data.d,t.weight=.001):(t.length=50*e.data.d,t.weight=.001):e.data.leastSimilar?(t.length=5,t.weight=3):e.data.mostSimilar?(t.length=1e3*e.data.d,t.weight=.001):(t.length=50*e.data.d,t.weight=.001)}function V(e){if(i.layoutType=e,i.forceDirLayout&&(i.forceDirLayout.timer.stop(),i.forceDirLayout.dispose(),i.forceDirLayout=null),h(),o.forEachNode(function(e){e.position={x:e.data.position.x,y:e.data.position.y}}),"mostSimilar"==e||"leastSimilar"==e)i.forceDirLayout=P.a.Graph.Layout.forceDirected(o,{springLength:50,springCoeff:.001,dragCoeff:.1,gravity:-.01,springTransform:function(t,o){return j(t,o,e)}}),i.layout.placeNode(function(e){return r.getNodeUI(e.id).position=i.forceDirLayout.getNodePosition(e.id)});else{if("geo"!==e)return void console.error("Unsupported layout type "+e);i.layout.placeNode(S),i.layout.step(),o.forEachNode(function(e){S(e),r.getNodeUI(e.id).position=e.position=e.data.position})}"geo"!=e&&i.forceDirLayout?(c.disableZoomPan=!0,i.renderLinks=!0,i.forceDirLayout.maxSteps=200,i.forceDirLayout.timer=P.a.Graph.Utils.timer(function(){try{var t=i.forceDirLayout.step();return(i.forceDirLayout.maxSteps%40==0||t)&&k(!1,null),(25==i.forceDirLayout.maxSteps||t)&&("mostSimilar"==e?E(o).forEach(function(t){return y(t,t.data[e])}):g(),i.renderLinks=!0),a.rerender(),!t&&i.forceDirLayout.maxSteps-- >0}catch(n){return a.rerender(),!1}},30)):(c.disableZoomPan=!1,E(o).forEach(function(e){return y(e,!1)}),i.renderLinks=!1,k())}}var D=function(){var e=this,t=e.$createElement,o=e._self._c||t;return e.showbox?o("div",{staticClass:"info-box"},[o("fa-icon",{staticClass:"close-box",attrs:{icon:["fas","window-close"]},on:{click:function(t){return t.preventDefault(),e.closebox()}}}),o("div",{staticClass:"ac-header"},[e._v("\n      "+e._s(e.nodeMetaData.label)+"\n      "),o("br"),o("div",{staticClass:"ac-setin"},[o("fa-icon",{attrs:{icon:["fas","map-marker"]}}),e._v(" \n        "+e._s(e.nodeMetaData.SetInCountry)+"\n      ")],1),o("div",{staticClass:"ac-author"},[o("fa-icon",{attrs:{icon:["fas","info-circle"]}}),e._v("\n        By "+e._s(e.nodeMetaData.AuthorName)+" ("+e._s(e.nodeMetaData.AuthorCountry)+")\n      ")],1)]),o("div",{staticClass:"ac-storytext"},[o("fa-icon",{attrs:{icon:["fas","book"]}}),e._v(" "+e._s(e.storyText)+" \n\t\t")],1),e.pars.showdetails?o("div",{staticClass:"ac-related"},[e._v("\n      Related Stories: \n      "),o("ul",{staticStyle:{"margin-top":"3px"}},[e._l(e.mostSimilarNodes,function(t){return o("li",{key:t.id},[o("div",{staticClass:"ac-most",on:{click:function(o){return o.preventDefault(),e.goToNode(t)}}},[e._v(e._s(e.nodeTitle(t)))])])}),e._l(e.otherRelatedNodes,function(t){return o("li",{key:t.id},[o("div",{staticClass:"ac-other",on:{click:function(o){return o.preventDefault(),e.goToNode(t)}}},[e._v(e._s(e.nodeTitle(t)))])])}),e._l(e.leastSimilarNodes,function(t){return o("li",{key:t.id},[o("div",{staticClass:"ac-least",on:{click:function(o){return o.preventDefault(),e.goToNode(t)}}},[e._v(e._s(e.nodeTitle(t)))])])})],2)]):o("div",{staticClass:"ac-more",on:{click:function(t){return t.preventDefault(),e.readMore(t)}}},[e._v(" Continue Reading ... ")])],1):e._e()},I=[],F=o("651e"),R=o.n(F),j={name:"StoryView",props:["pars"],data:function(){return{showbox:!1,mostSimilarNodes:[],leastSimilarNodes:[],otherRelatedNodes:[],graph:null,storyText:""}},watch:{pars:{deep:!0,immediate:!0,handler:function(e,t){var o=this;if(this.storyText="No story selected ...",e.node&&(this.showbox=!0,this.storyText=e.node.data.Excerpt,e.showdetails&&(this.storyText+=" (... Fetching more of the story ...)",V(this.pars.node.id,this.$parent.year).then(function(e){return o.storyText=e}))),this.mostSimilarNodes=[],this.leastSimilarNodes=[],this.otherRelatedNodes=[],e.node&&this.$parent.graph){var a=T(this.$parent.graph,e.node,"geo");a.nodes.forEach(function(t){if(e.node.id!=t.id){var a=o.$parent.graph.getLink(e.node.id,t.id);a||(a=o.$parent.graph.getLink(t.id,e.node.id)),a&&a.data.mostSimilar?o.mostSimilarNodes.push(t):a&&a.data.leastSimilar?o.leastSimilarNodes.push(t):o.otherRelatedNodes.push(t)}})}}}},methods:{readMore:function(){d.fire("emulate-node-click",this.pars.node)},goToNode:function(e){e&&d.fire("emulate-node-click",e)},nodeTitle:function(e){return e?e.data.label:"None?"},closebox:function(){this.showbox=!1,d.fire("resetview")}},computed:{nodeMetaData:function(){return this.pars.node?this.pars.node.data:{label:"No story selected ..."}}}};function V(e,t){var o="https://storage.googleapis.com/nomadstories/dataFolder/".concat(t,"/");return o+=encodeURIComponent(e),y.a.get(o).then(function(e){return R.a.load(e.data)["Text"]}).catch(function(e){return e})}var O=j,G=(o("4cbd"),o("2877")),$=Object(G["a"])(O,D,I,!1,null,"82c1344c",null),z=$.exports,Y=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"container row"},[o("div",{staticClass:"search col-xs-12 col-sm-6 col-md-4"},[o("form",{staticClass:"search-form",attrs:{role:"search"},on:{submit:function(t){return t.preventDefault(),e.onSubmit(t)}}},[o("div",{staticClass:"input-group"},[o("input",{directives:[{name:"model",rawName:"v-model",value:e.searchPattern,expression:"searchPattern"}],staticClass:"form-control no-shadow",attrs:{type:"text",placeholder:"Search Stories"},domProps:{value:e.searchPattern},on:{focus:function(t){e.searchInputFocused=!0},blur:e.unfocusTimeout,input:function(t){t.target.composing||(e.searchPattern=t.target.value)}}}),o("fa-icon",{staticClass:"btn",attrs:{tabindex:"-1",type:"button",icon:["fas","search"]}})],1)]),e.showSearchResults?o("div",{staticClass:"search-results"},[o("div",{staticClass:"scroll-wrapper"},[o("ul",e._l(e.matchedNodes,function(t){return o("li",{key:t.id},[o("a",{attrs:{href:"#"},on:{click:function(o){return e.showDetails(t,!0)},mouseover:function(o){return e.showDetails(t,!1)}}},[e._v(" "+e._s(t.data.label)+" ")])])}),0)])]):e._e()])])},H=[],U=(o("3b2b"),o("4917"),{name:"SearchView",data:function(){return{searchPattern:"",searchInputFocused:!1,lastInputHandle:0,matchedNodes:[]}},computed:{showSearchResults:function(){return this.$parent.graph&&this.searchInputFocused&&this.searchPattern&&this.searchPattern.length>3}},watch:{searchPattern:function(e,t){if(this.showSearchResults){this.lastInputHandle&&(clearTimeout(this.lastInputHandle),this.lastInputHandle=0);var o=this;this.lastInputHandle=setTimeout(function(){o.matchedNodes=B(o.$parent.graph,e),o.lastInputHandle=0},150)}}},methods:{unfocusTimeout:function(){var e=this;setTimeout(function(){e.searchInputFocused=!1},150)},onSubmit:function(){return null},showDetails:function(e,t){d.fire(t?"emulate-node-click":"emulate-node-hover",e)}}});function B(e,t){var o=[],a=Z(t);return e.forEachNode(function(e){a.isMatch(e.data)&&o.length<50&&o.push(e)}),o}function Z(e){var t=q(e);return{isMatch:function(e){return t&&e&&(e.label&&e.label.match(t)||e.Excerpt&&e.Excerpt.match(t)||e.SetInCountry&&e.SetInCountry.match(t)||e.AuthorCountry&&e.AuthorCountry.match(t)||e.AuthorName&&e.AuthorName.match(t))}}}function q(e){try{return new RegExp(e,"ig")}catch(t){}}var J=U,W=(o("db47"),Object(G["a"])(J,Y,H,!1,null,"19afbe98",null)),X=W.exports,K=function(){var e=this,t=e.$createElement,o=e._self._c||t;return e.showFilter?o("div",{staticClass:"filter-box"},[o("div",{staticClass:"f-year"},[e._v("\n    Story Years: \n    "),o("input",{directives:[{name:"model",rawName:"v-model",value:e.selectedYear,expression:"selectedYear"}],attrs:{type:"radio",value:"2018"},domProps:{checked:e._q(e.selectedYear,"2018")},on:{change:function(t){e.selectedYear="2018"}}}),o("label",[e._v("2018")]),o("input",{directives:[{name:"model",rawName:"v-model",value:e.selectedYear,expression:"selectedYear"}],attrs:{type:"radio",value:"2019"},domProps:{checked:e._q(e.selectedYear,"2019")},on:{change:function(t){e.selectedYear="2019"}}}),o("label",[e._v("2019")]),o("fa-icon",{staticClass:"close-filter",attrs:{icon:["fas","window-close"]},on:{click:function(t){return t.preventDefault(),e.closeShow()}}})],1),o("div",{staticClass:"f-geo"},[e._v("\n    Layout Clustering: \n    "),o("input",{directives:[{name:"model",rawName:"v-model",value:e.selectedLayout,expression:"selectedLayout"}],attrs:{type:"radio",value:"geo"},domProps:{checked:e._q(e.selectedLayout,"geo")},on:{change:function(t){e.selectedLayout="geo"}}}),o("label",[e._v("Geo")]),o("input",{directives:[{name:"model",rawName:"v-model",value:e.selectedLayout,expression:"selectedLayout"}],attrs:{type:"radio",value:"mostSimilar"},domProps:{checked:e._q(e.selectedLayout,"mostSimilar")},on:{change:function(t){e.selectedLayout="mostSimilar"}}}),o("label",[e._v("Similar")]),o("input",{directives:[{name:"model",rawName:"v-model",value:e.selectedLayout,expression:"selectedLayout"}],attrs:{type:"radio",value:"leastSimilar"},domProps:{checked:e._q(e.selectedLayout,"leastSimilar")},on:{change:function(t){e.selectedLayout="leastSimilar"}}}),o("label",[e._v("Disimilar")])])]):e._e()},Q=[],ee={name:"FilterView",data:function(){return{selectedYear:"2019",selectedLayout:"geo",leastSimilarNode:null,otherRelatedNodes:[],graph:null,storyText:""}},created:function(){var e=this;d.on("load-graph",function(){e.selectedLayout="geo"})},computed:{showFilter:function(){return this.$parent.showFilter}},methods:{closeShow:function(){this.$parent.showFilter=!1}},watch:{selectedYear:{handler:function(e,t){e!=t&&w(this.$parent.mapbox,e)}},selectedLayout:{handler:function(e,t){e!=t&&this.$parent.scene.toggleLayout(e)}},show:{}}},te=ee,oe=(o("1acd"),Object(G["a"])(te,K,Q,!1,null,"1bef21e4",null)),ae=oe.exports,ne=o("e192"),re={name:"app",data:function(){return{scene:null,showAbout:!0,showFilter:!1,graph:null,mapbox:null,storyViewPars:{node:null,showdetails:!1},year:"2019"}},methods:{toggleAbout:function(){this.showAbout=!this.showAbout,this.showFilter=!this.showAbout&&!this.isMobile()},closeAbout:function(){this.showAbout=!1,this.showFilter=!this.isMobile()},isMobile:function(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}},computed:{showStory:function(){return!this.showAbout&&null!=this.storyViewPars.node}},components:{SearchView:X,StoryView:z,FilterView:ae},created:function(){var e=this;d.on("load-graph",function(t,o){e.graph=t,e.year=o})},mounted:function(){this.$ga.page(window.location.pathname),ne.accessToken="pk.eyJ1Ijoiem9vaGFpciIsImEiOiJjanlmMWRzenExN2N4M2xzOGVvdDg2eG9jIn0.HX4LVDqBgxUKivoqPLk_4w",this.mapbox=new ne.Map({container:"mapCanvas",style:"mapbox://styles/mapbox/dark-v9",center:[0,0],zoom:1,minZoom:1,maxZoom:10}),this.mapbox.scrollZoom.disable(),this.mapbox.dragPan.disable();var e=document.getElementById("cnv");this.scene=M(e,this.mapbox);var t=this;function o(e){t.storyViewPars.node=e,t.storyViewPars.showdetails=!1}function a(e){t.storyViewPars.node=e,t.storyViewPars.showdetails=!0,t.showAbout=!1}d.on("node-hovered",o),d.on("node-clicked",a)},beforeDestroy:function(){this.scene&&this.scene.dispose()}},ie=re,se=(o("034f"),Object(G["a"])(ie,n,r,!1,null,null,null)),ce=se.exports,le=o("0284"),ue=o.n(le),de=o("ecee"),he=o("c074"),fe=o("ad3d");a["a"].use(ue.a,{id:"UA-144701829-1",autoTracking:{screenview:!0},debug:{sendHitTask:!0}}),de["c"].add(he["a"]),a["a"].component("fa-icon",fe["a"]),a["a"].config.productionTip=!1,new a["a"]({render:function(e){return e(ce)}}).$mount("#app")},6271:function(e,t,o){},"64a9":function(e,t,o){},db47:function(e,t,o){"use strict";var a=o("18fa"),n=o.n(a);n.a}});
//# sourceMappingURL=app.d6157790.js.map