/*eslint no-console: ["error", { allow: [ "warn", "error"] }] */

import bus from './bus';

import {getGraph, geoColocPositioner} from './getGraph';

import {WebglCircle, CircleNodeShader} from './WebglCircleShader';
import Viva from 'vivagraphjs';


var traverseNodes = require('ngraph.traverse').nodes;
var traverseLinks = require('ngraph.traverse').links;

export function getNeighborhood(graph, node, lType = 'geo', collector = undefined)
//This will include node, its outgoing elements, and its neighbors
{
  var neighbors = collector || {nodes: new Set([node]), links: new Set()}

  if(lType == 'geo')
  {
    traverseNodes(graph).neighbors(node.id).forEach( n => neighbors.nodes.add(n))
    traverseLinks(graph).from(node.id).forEach( l => neighbors.links.add(l))
  } else {

    //in this case, we need to do some graph traversal but only
    //following links that are most/least similar. And we will recurse ...

    let newNodesIds = new Set([])

    node.links.forEach( l => {
      //if this is the kind of link we are interested in
      // add it to the set of links and
      // add the from/to nodes to the newNodes set
      if(l.data[lType])
      {
        neighbors.links.add(l)
        newNodesIds.add(l.fromId).add(l.toId)
      }
    })
    //Next, for each of these node Ids, if we haven't already traversed it,
    //we recurse to collect more stuff
    newNodesIds.forEach(nodeId => 
    {
      let cNode = graph.getNode(nodeId)
      if(! neighbors.nodes.has(cNode)){
        neighbors.nodes.add(cNode)
        getNeighborhood(graph, cNode, lType, neighbors)
      }
    })
  }
  return neighbors
}





export function createScene(canvas, _mapbox) {
// Since graph can be loaded dynamically, we have these uninitialized
// and captured into closure. loadGraph will do the initialization
let graph, renderer, layout, graphics, rendererSettings;
let mapbox = _mapbox;
let highlightedElements = {nodes: [], links: [], sticky: false}

//Save where the graph will be rendered
rendererSettings = {
  container: canvas,
  interactive: 'drag', // node and scroll are disabled!
  layoutType: 'geo'
  }

//Use event handler to register for a load-graph
//event if graph is changed
bus.on('load-graph', loadGraph);
bus.on('emulate-node-click', clickHandler)
bus.on('emulate-node-hover', hoverHandler)
bus.on('resetview', resetAllNodes)

//First time creating scene, use getGraph() with default
//parameters. getGraph will fire load-graph ...
getGraph(mapbox)

//the scene we return has the following member functions
return {
  graph,
  rendererSettings,
  dispose,
  resetView,
  toggleLayout,
};




function loadGraph(newGraph) {
  //If there is already a renderer
  //finalize it and clear up
  if (renderer) {
    resetAllNodes();
    renderer.dispose();
    renderer = null
    rendererSettings.freakyLayout = null;
  }

  //save graph to module copy
  graph = newGraph

  //******************************************
  //*************** Layout *******************
  //******************************************
  //Initialize a constant layout where the node
  //positions are directly from the data 
  layout = Viva.Graph.Layout.constant(graph);


  //Next we over-write the placeNode callback
  //placeNode will call updateNodePositions() which will update
  //the layoutNodes[] array with the positions computed
  //by geoColocPositioner
  layout.placeNode(geoColocPositioner);
  rendererSettings.layout = layout;

  //******************************************
  //*************** Graphics *****************
  //******************************************

  //We will use a webGL renderer
  //TODO: fallback to SVG if webGL not supported?
  //Or at least show an error message ...

  graphics = Viva.Graph.View.webglGraphics();
  graphics.link(function (link) {
            return Viva.Graph.View.webglLine(getLineColor(link));
        })
  // Tell webgl graphics we want to use custom shader to render nodes:
  graphics.setNodeProgram(CircleNodeShader(panBackground));
  // Change node ui model for WebGL shader
  graphics.node(n => {
      let ca = getNodeColorAlpha(n, false)
      return new WebglCircle(getNodeSize(n, false), ca.color, ca.alpha);
   });

  //to avoid releasing none existant links
  let releaseLinkInner = graphics.releaseLink;
  graphics.releaseLink = l =>  {if (graphics.getLinkUI(l.id)) releaseLinkInner(l)};

  rendererSettings.graphics = graphics

  //******************************************
  //*************** Events *******************
  //******************************************

  
  var events = Viva.Graph.webglInputEvents(graphics, graph);
  events.mouseEnter(function (node) {

      if (highlightedElements.sticky)
      {
        //sticky on means a node was clicked, so no highlighting to be done

        //however, we will still fire a node-hover-enter event
        //if the node is one of the highlighted ones!
        if(highlightedElements.nodes.has(node))
        {
          //when sticky, as if we clicked (so whole story will show)
          bus.fire('node-clicked', node)
        }
        return
      }

      hoverHandler(node)
  // eslint-disable-next-line no-unused-vars
  }).mouseLeave(function (node) {

    if(highlightedElements.sticky)
    {
      // nothing to do as long as sticky is on ...
      return
    }
    //Unhighlight all nodes and turn off link rendering
    clearHighlightedElements(highlightedElements)
    renderer.rerender()
  })
  .click(function (node) {
    if(highlightedElements.sticky){
      if (highlightedElements.nodes.has(node))
        clickHandler(node)
    } else{
       clickHandler(node)
    }

  })


  canvas.ondblclick = resetAllNodes

  canvas.addEventListener('touchend', (e) => {
    if (e.changedTouches.length >= 1) {
        let newEv = new MouseEvent('mouseup', e.changedTouches[0])
        graphics.getGraphicsRoot().dispatchEvent(newEv);
    }

  })

  canvas.onwheel = function (e) {
      let mZoom = mapbox.getZoom()

      if(mapbox.disableZoomPan){ 
        mZoom = 5 //this will ensure that both zoom-in & out will occur
      }

      let webglz = renderer.getTransform().scale

      let scaleFactor = 1;
      let delta = -Math.sign(e.wheelDelta)

      if(delta < 0 && mZoom < 10) { // renderer.zoomIn()
        scaleFactor = Math.pow(1 + 0.4, -0.1*delta);
        webglz *= scaleFactor
        if(!mapbox.disableZoomPan && (Math.log2(webglz) + 1 > 10)) return
      } 
      else if (delta > 0 && mZoom > 1){ // renderer.zoomOut()
        scaleFactor = Math.pow(1 + 0.4, -0.1*delta);
        webglz *= scaleFactor
        if(!mapbox.disableZoomPan && (Math.log2(webglz) + 1 < 1)) return
      }

      renderer.getGraphics().scale(scaleFactor, {x: e.pageX, y: e.pageY})
      renderer.getTransform().scale = webglz

      renderer.rerender()
      setTimeout(function() {renderer.rerender()}, 200);
  }

  //******************************************
  //*************** Renderer *****************
  //******************************************

  //Finally Ready to initialize and run the renderer!
  rendererSettings.renderLinks= false;  //by default we won't render links, 
  renderer = Viva.Graph.View.renderer(graph, rendererSettings);
  rendererSettings.container.onresize = () => {
    if (renderer) {
      renderer.reset(); fitAndCenter();
    }
  }

  if(renderer)
  {    
    renderer.run();
    fitAndCenter();

    renderer.on("scroll", (scale, offset) => canvas.onwheel({wheelDelta: scale, pageX: offset.x, pageY: offset.y}))
  }

  //saving these for debugging
  if(process.env.NODE_ENV == 'development') {    
    window.renderer = renderer;
    window.rendererSettings = rendererSettings;
    window.graph = graph
  }
}


function resetAllNodes()
{
  clearHighlightedElements(highlightedElements)
  highlightedElements.sticky = false

  graph.forEachNode(n => highlightNode(n, false))

  bus.fire('node-hovered', null)

  // fitAndCenter(true, rendererSettings.forceDirLayout ? null : 1);
  fitAndCenter()
}

function hoverHandler(node)
{
  clearHighlightedElements(highlightedElements)
  highlightedElements = highlightNeighborhood(node)
  renderer.rerender()

  bus.fire('node-hovered', node)
}
function clickHandler(node)
{
  clearHighlightedElements(highlightedElements)

  graph.forEachNode(hideNode)

  highlightedElements = highlightNeighborhood(node)
  highlightedElements.sticky = true
  renderer.rerender()

  bus.fire('node-clicked', node)
}

function clearHighlightedElements(nhood)
{
  nhood.nodes.forEach(n => highlightNode(n, false));
  nhood.links.forEach(n => highlightLink(n, false));
  rendererSettings.renderLinks = false;

  nhood.nodes = []
  nhood.links = []
}

function highlightNeighborhood(node)
{
  var nhood = getNeighborhood(graph, node, rendererSettings.layoutType)

  nhood.nodes.forEach(n => highlightNode(n, true))
  nhood.links.forEach(l => highlightLink(l, true))
  rendererSettings.renderLinks = nhood.links.size > 0

  return nhood
}
function highlightOnlyStronglyDisimilarLinks()
{
  traverseLinks(graph).forEach(l => highlightLink(l, isStronglyDisimilar(l)))
}


function highlightLink(link, high) {
  if(high){
    // Equivalent to renderer.createLinkUi(link);
    // but we don't have access to it
    var linkPosition = layout.getLinkPosition(link.id);
    graphics.addLink(link, linkPosition);
  } else
  {
    // Equivalent to renderer.removeLinkUi(link);
    // but we don't have access to it
    graphics.releaseLink(link)
  }
}

function hideNode(node)
{
  var nodeUI = graphics.getNodeUI(node.id);
  nodeUI.alpha = 0.;
  // nodeUI.size  = 0;
}

function highlightNode(node, high) {
  var nodeUI = graphics.getNodeUI(node.id);
  
  //Change node color/size
  if(nodeUI)
  {
    let ca = getNodeColorAlpha(node, high);
    nodeUI.color = ca.color;
    nodeUI.alpha = ca.alpha;

    nodeUI.size  = getNodeSize(node, high);
  }

}


function panBackground(e){
    if(! mapbox.disableZoomPan )
    {
      //First, let's match the zoom. 
      //Note that Mapbox uses a different convention for zoom...
      let zoom = e[0]
      mapbox.jumpTo({zoom: Math.log2(zoom)+1, center: [0,0]})

      //Next, let's match the pan - we use mapbox's unproject to make
      //sure that the graph center matches.
      let pan = {x: (e[12]+1)/2, y: -(e[13]+1)/2+1}
      pan.x += (zoom - 1)/2
      pan.y += (zoom - 1)/2
      
      let newCenter_xy = {x: -pan.x*mapbox._container.clientWidth  + 0.5*mapbox._container.clientWidth,
                          y: -pan.y*mapbox._container.clientHeight + 0.5*mapbox._container.clientHeight}

      let newCenter_latlon = mapbox.unproject(newCenter_xy)
      mapbox.jumpTo({center: newCenter_latlon})


      //In case we've panned to the edge of the screen, we should clip
      //the renderer!
      let actualCenter_xy = mapbox.project(newCenter_latlon)

      //We're off by 10 pixels - tell renderer to move back!
      if(Math.abs(actualCenter_xy.y - mapbox._container.clientHeight/2) > 5)
      {
        renderer.moveTo(newCenter_xy.x, newCenter_xy.y - (newCenter_latlon.lat < 0 ? 5: -5))         
      }
    }
}

function fitAndCenter(rerender = true, desiredZoom = 1){
  let midPoint = {
        x: mapbox._container.clientWidth/2,
        y: mapbox._container.clientHeight/2,
      };

  if(desiredZoom == null){ 
    let graphRect = layout.getGraphRect();
    if(rendererSettings.forceDirLayout){
      graphRect = rendererSettings.forceDirLayout.getGraphRect()
    }
    let graphSize = Math.min(graphRect.x2 - graphRect.x1, graphRect.y2 - graphRect.y1);
    let screenSize = Math.min(midPoint.x, midPoint.y)*2
    desiredZoom = screenSize / graphSize * 0.8;
  }

  var cbAtEndOfZoom = () =>
  {
    renderer.moveTo(midPoint.x, midPoint.y) //move once zooming is done with..
    if(rerender) {renderer.rerender(); setTimeout(function() {renderer.rerender()}, 200);}
  }
  zoomTo(desiredZoom, renderer.getTransform().scale, cbAtEndOfZoom)

}

// function zoomToOneShot(desiredScale, zPoint)
// {
//   if(zPoint == undefined)
//   {
//       zPoint = {
//         x: mapbox._container.clientWidth/2,
//         y: mapbox._container.clientHeight/2,
//       };
//   }
//   //get current scale:
//   let currentScale = renderer.getTransform().scale
//   let scaleFactor = desiredScale / currentScale

//   renderer.getGraphics().scale(scaleFactor, zPoint)
//   renderer.getTransform().scale = scaleFactor
// }
// From https://github.com/anvaka/VivaGraphJS/issues/57
function zoomTo(desiredScale, currentScale, cb = null) {
    // zoom API in vivagraph 0.5.x is silly. There is no way to pass transform
    // directly. Maybe it will be fixed in future, for now this is the best I could do:    
    let newScale = currentScale;
    if (desiredScale < currentScale) {
        newScale = renderer.zoomOut();
    }
    else if(desiredScale > currentScale)
    {
        newScale = renderer.zoomIn();
    }

    //Recurse if we are not yet at the right scale!
    if(Math.abs(desiredScale - newScale) > Math.abs(currentScale - newScale)/2)
    {
        setTimeout(() => zoomTo(desiredScale, newScale, cb), 20);
    } else if(cb != null){
      cb();
    }
}

function getNodeSize(node, high)
{
  if (high)
    return 2;
  else
    return 2;
}
function getNodeColorAlpha(node, high)
{
  const colors = {'EU': 0x0062ff, 'NA': 0x37ff00, 'SA': 0xfb00ff,
                'AF': 0xffaa00, 'AS': 0xfffb00, 'OC':0xff0015,
                'highlighted': 0xffffff, 'N/A': 0x7d7d7d}


  return {color: colors[node.data.AuthorCont] || colors['N/A'], 
          alpha: high ? .8: .5}
}
function getLineColor(link)
{
// 0x1f77b4ff, 0xaec7e8ff,
// 0xff7f0eff, 0xffbb78ff,
// 0x2ca02cff, 0x98df8aff,
// 0xd62728ff, 0xff9896ff,
// 0x9467bdff, 0xc5b0d5ff,
// 0x8c564bff, 0xc49c94ff,
// 0xe377c2ff, 0xf7b6d2ff,
// 0x7f7f7fff, 0xc7c7c7ff,
// 0xbcbd22ff, 0xdbdb8dff,
// 0x17becfff, 0x9edae5ff
  if(link.data)
  {
    if(link.data.mostSimilar)
      return 0x4238ffff;

    if(link.data.leastSimilar)
      return 0xff3838ff;
  }

  return 0xdedcf2ff;

}


function resetView() {
  if(renderer)
  {
    renderer.reset();
    fitAndCenter();
  }
}



function dispose() {
  // cancelAnimationFrame(rafHandle);
  bus.off('load-graph', loadGraph);
}


function isStronglyDisimilar(link, minCount = 3)
{
  if(!link.data.leastSimilar) return false;

  let nLeast = [new Set(), new Set()]

  graph.getNode(link.fromId).links.forEach( l => {if (l.data.leastSimilar) nLeast[0].add(l.fromId).add(l.toId)} )
  graph.getNode(link.toId  ).links.forEach( l => {if (l.data.leastSimilar) nLeast[1].add(l.fromId).add(l.toId)} )

  //minCount + 1 since set will the self node in it
  return (nLeast[0].size >= (minCount + 1) || nLeast[1].size >= (minCount + 1))
}

function springWeight(l, s, lType)
{

  if(lType == 'mostSimilar')
  {
    if (l.data.mostSimilar) {
       s.length = 5;  s.weight = 3.0;
     } else if (l.data.leastSimilar) { 
       s.length = l.data.d*1000; s.weight = 0.001;
     } else { 
      s.length = l.data.d*50;   s.weight = 0.001;
    }
    return
  }

  //else == lType = leastSimilar
  if(l.data.leastSimilar){
    //we will see if this link is connected to a node
    //that has at least a total of 3 dissimilar nodes
    //otherwise we won't use it in the clustering
    s.length = 5;
    s.weight = isStronglyDisimilar(l, 3) ? 3.0 : 0.001;
  } else if (l.data.mostSimilar) { 
    s.length = l.data.d*1000; 
    s.weight = 0.001;
  } else { 
    s.length = l.data.d*50;   s.weight = 0.001;
  }
}

function toggleLayout(lType)
{
  rendererSettings.layoutType = lType
  //dispose of any forceDirLayout if we already have one
  if(rendererSettings.forceDirLayout)
  {
    rendererSettings.forceDirLayout.timer.stop()
    rendererSettings.forceDirLayout.dispose()
    rendererSettings.forceDirLayout = null
  }

  resetAllNodes()

  //Reset position of nodes
  graph.forEachNode( n => {n.position = {x: n.data.position.x, y: n.data.position.y} })

  if (lType == 'mostSimilar' || lType == 'leastSimilar'){
   
    rendererSettings.forceDirLayout = Viva.Graph.Layout.forceDirected(graph, {
          springLength : 50,
          springCoeff : 0.001,
          dragCoeff : .1,
          gravity : -.01,
          springTransform: ((l, s) => springWeight(l, s, lType))
      })

    rendererSettings.layout.placeNode(function(node) {
      // read node position from force directed layout:
      return graphics.getNodeUI(node.id).position = rendererSettings.forceDirLayout.getNodePosition(node.id);
    });

  } else if (lType === 'geo'){
    rendererSettings.layout.placeNode(geoColocPositioner);
    rendererSettings.layout.step();
    graph.forEachNode( n => {geoColocPositioner(n); graphics.getNodeUI(n.id).position = n.position = n.data.position});

    // graph.forEachNode( n => {n.position = n.data.position})
  } else {
    console.error('Unsupported layout type ' + lType)
    return;
  }

  //Finally, if this is a non-geo layout, simulate it
  if(lType != 'geo' && rendererSettings.forceDirLayout)
  {
    mapbox.disableZoomPan = true
    rendererSettings.renderLinks = true

    // let renderer know we want it to render links
    //Finally run a timer to step the simulation and render.
    rendererSettings.forceDirLayout.maxSteps = 200
    rendererSettings.forceDirLayout.timer =
            Viva.Graph.Utils.timer(() => {
              try {
                let stable = rendererSettings.forceDirLayout.step(); 
                if(rendererSettings.forceDirLayout.maxSteps % 40 == 0 || stable){
                  fitAndCenter(false, null)
                }
                //highlight links halfway through
                //TODO: do this progressively as springs reach equilibrium ?
                if(rendererSettings.forceDirLayout.maxSteps == 25 || stable)
                {
                  if (lType == 'mostSimilar'){
                    traverseLinks(graph).forEach( (l) => highlightLink(l, l.data[lType]))
                  } else {
                    highlightOnlyStronglyDisimilarLinks()
                  }
                  rendererSettings.renderLinks = true
                }
                renderer.rerender();
                return (!stable && rendererSettings.forceDirLayout.maxSteps-- > 0);
              } 
              catch { 
                renderer.rerender();
                return false;
              }
            }, 30)
  } else {
    //re-enable mapbox panning/zooming
    mapbox.disableZoomPan = false
    //unhighlight links
    traverseLinks(graph).forEach( (l) => highlightLink(l, false))
    rendererSettings.renderLinks = false;
    fitAndCenter()
  }

}

} //end of Export
