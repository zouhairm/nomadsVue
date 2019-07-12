/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

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
let graph, renderer, layout, rendererSettings;

//Save where the graph will be rendered
rendererSettings = {
  container: canvas,
  }

//First time creating scene, use getGraph() with default
//parameters and load it.
getGraph().then(loadGraph);

//Use event handler to register for a load-graph
//event if graph is changed
bus.on('load-graph', loadGraph);

//the scene we return has the following member functions
return {
  dispose,
  resetView,
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
  let graphics = Viva.Graph.View.webglGraphics();
  // Tell webgl graphics we want to use custom shader to render nodes:
  graphics.setNodeProgram(CircleNodeShader());
  // Change node ui model for WebGL shader
  graphics.node(n => {
      return new WebglCircle(10, getNodeColor(n, false)); // hex rrggbb);
   });

  //to avoid releasing none existant links
  let releaseLinkInner = graphics.releaseLink;
  graphics.releaseLink = l =>  {if (graphics.getLinkUI(l.id)) releaseLinkInner(l)};

  rendererSettings.graphics = graphics

  //******************************************
  //*************** Events *******************
  //******************************************

  let highlightedElements = {nodes: [], links: [], sticky: false}
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

      clearHighlightedElements(highlightedElements)
      highlightedElements = highlightNeighborhood(node)
      renderer.rerender()

      //Tell back to main app that we have a selected node.
      bus.fire('node-hovered', node)

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
    clearHighlightedElements(highlightedElements)
    highlightedElements = highlightNeighborhood(node)
    highlightedElements.sticky = true
    bus.fire('node-clicked', node)

    renderer.rerender()
  })

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

  function highlightNode(node, high) {
    var nodeUI = graphics.getNodeUI(node.id);
    if (high) {
      //Change node color/size
      nodeUI.color = getNodeColor(node, high);
      nodeUI.size = 18;
    } else {
      //Change node color/size
      nodeUI.color = getNodeColor(node, high);
      nodeUI.size = 16;
    }
  }


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
    panBackground();
  }


}


function panBackground(){

      let cyDiv = rendererSettings.container
      let transform = renderer.getTransform()
      var pan  = {x: transform.offsetX, y: transform.offsetY}
      var zoom = transform.scale * 5;
      
      var ax = - 670 * zoom;
      var ay = - 450 * zoom;

      var x = pan.x + ax;
      var y = pan.y + ay;

      if(x*y != 0) return;

      cyDiv.style.backgroundPosition = x +'px ' + y + 'px ';
      cyDiv.style.backgroundSize = (window.screen.width * zoom)+'px '+(window.screen.height * zoom)+'px'; 


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

function getNodeColor(node, high)
{
  const colors = {'EU': 0x0062ff, 'NA': 0x37ff00, 'SA': 0xfb00ff,
                'AF': 0xffaa00, 'AS': 0xfffb00, 'OC':0xff0015,
                'highlighted': 0xffffff, 'N/A': 0x7d7d7d}

  if(high)
  {
    return colors['highlighted'];
  }
  else
  {
    return colors[node.data.AuthorCont] || colors['N/A'];
  }
}

function resetView() {
  if(renderer)
  {
    console.log('Recentering renderer')
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
