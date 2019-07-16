/*eslint no-console: ["error", { allow: [ "warn", "error"] }] */

import bus from './bus';

import {getGraph, geoColocPositioner} from './getGraph';

import {WebglCircle, CircleNodeShader} from './WebglCircleShader';
import Viva from 'vivagraphjs';



var traverseNodes = require('ngraph.traverse').nodes;
var traverseLinks = require('ngraph.traverse').links;



export function getNeighborhood(graph, node)
//This will include node, its outgoing elements, and its neighbors
{
  var neighbors = {nodes: [node], links: []}

  traverseNodes(graph).neighbors(node.id).forEach( n => neighbors.nodes.push(n))
  traverseLinks(graph).from(node.id).forEach( l => neighbors.links.push(l))

  return neighbors
}


export function createScene(canvas) {
// Since graph can be loaded dynamically, we have these uninitialized
// and captured into closure. loadGraph will do the initialization
let graph, renderer, layout, graphics, rendererSettings;

let highlightedElements = {nodes: [], links: [], sticky: false}

//Save where the graph will be rendered
rendererSettings = {
  container: canvas,
  }


//Use event handler to register for a load-graph
//event if graph is changed
bus.on('load-graph', loadGraph);
bus.on('emulate-node-click', clickHandler)
bus.on('emulate-node-hover', hoverHandler)

//First time creating scene, use getGraph() with default
//parameters. getGraph will fire load-graph ...
getGraph()

//the scene we return has the following member functions
return {
  graph,
  dispose,
  resetView,
  toggleLayout,
};


function loadGraph(newGraph) {
  //If there is already a renderer
  //finalize it and clear up
  if (renderer) {
    renderer.dispose();
    renderer = null
  }

  //save graph to module copy
  graph = newGraph

  //******************************************
  //*************** Layout *******************
  //******************************************
  //Initialize a constant layout where the node
  //positions are directly from the data 
  layout = Viva.Graph.Layout.constant(graph);

  //For that, we over-write the placeNode callback
  layout.placeNode(geoColocPositioner);
  // Run one step so that node positions are computed
  layout.step();
  rendererSettings.layout = layout;

  //******************************************
  //*************** Graphics *****************
  //******************************************

  //We will use a webGL renderer
  //TODO: fallback to SVG if webGL not supported?
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
        if(highlightedElements.nodes.includes(node))
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
      if (highlightedElements.nodes.includes(node))
        clickHandler(node)
    } else{
       clickHandler(node)
    }

  })


  canvas.ondblclick = resetAllNodes
  //******************************************
  //*************** Renderer *****************
  //******************************************

  //Finally Ready to initialize and run the renderer!
  rendererSettings.renderLinks= false;  //by default we won't render links, 
  renderer = Viva.Graph.View.renderer(graph, rendererSettings);

  if(renderer)
  {
    renderer.run();
    fitAndCenter();
  }

}


function resetAllNodes()
{
  clearHighlightedElements(highlightedElements)
  highlightedElements.sticky = false

  graph.forEachNode(n => highlightNode(n, false))

  fitAndCenter();
  renderer.rerender()

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
  var nhood = getNeighborhood(graph, node)

  nhood.nodes.forEach(n => highlightNode(n, true))
  nhood.links.forEach(l => highlightLink(l, true))
  rendererSettings.renderLinks = nhood.links.length > 0

  return nhood
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

  let ca = getNodeColorAlpha(node, high);
  nodeUI.color = ca.color;
  nodeUI.alpha = ca.alpha;

  nodeUI.size  = getNodeSize(node, high);

}




function panBackground(e){

      let zoom = e[0]
      let pan = {x: (e[12]+1)/2, y: -(e[13]+1)/2+1}

      // console.log('zoom = ' + zoom + ' pan = ' + pan.x + ',' + pan.y)

      var x =  pan.x * 100 - 2200*zoom/3
      var y =  pan.y * 100 - 3250*zoom/3

      let cyDiv = rendererSettings.container
      cyDiv.style.backgroundPosition = x +'vw ' + y + 'vh ';
      cyDiv.style.backgroundSize = (1500 * zoom)+'vw auto'//+(window.screen.height * zoom)+'px'; 

}

function fitAndCenter(){
  // Final bit: most likely graph will take more space than available
  // screen. Let's zoom out to fit it into the view:
  var graphRect = layout.getGraphRect();  
  renderer.moveTo((graphRect.x1 + graphRect.x2)/2,
                  (graphRect.y1 + graphRect.y2)/2);

  var graphSize = Math.min(graphRect.x2 - graphRect.x1, graphRect.y2 - graphRect.y1);
  var screenSize = Math.min(rendererSettings.container.clientWidth, rendererSettings.container.clientHeight);
  var desiredScale = screenSize / graphSize;

  zoomTo(desiredScale, 1);

}

//From https://github.com/anvaka/VivaGraphJS/issues/57
function zoomTo(desiredScale, currentScale) {
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
        setTimeout(function() {
            zoomTo(desiredScale, newScale);
        }, 16);
    }
}

function getNodeSize(node, high)
{
  if (high)
    return 15;
  else
    return 12;
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



function toggleLayout(){
  //doesn't seem to be working ...
  //might need to do something different to change renderer?
  
  if(renderer)
  {
    var newLayout = Viva.Graph.Layout.forceDirected(graph, {
        springLength : 10,
        springCoeff : 0.0005,
        dragCoeff : 0.02,
        gravity : -1.2
    });

    renderer.reset();
    renderer.layout = newLayout;
    renderer.layout.step()
    renderer.rerender();

  }
}
function resetView() {
  if(renderer)
  {
    renderer.reset();
    fitAndCenter();
    renderer.rerender();
  }
}

// function initScene() {
//   let scene = makeWGLScene(canvas);
//   scene.setClearColor(12/255, 41/255, 82/255, 1)
//   let initialSceneSize = 100;
//   scene.setViewBox({
//     left:  -initialSceneSize,
//     top:   -initialSceneSize,
//     right:  initialSceneSize,
//     bottom: initialSceneSize,
//   });
//   return scene;
// }

function dispose() {
  // cancelAnimationFrame(rafHandle);
  bus.off('load-graph', loadGraph);
}


} //end of Export
