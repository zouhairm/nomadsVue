/*eslint no-console: ["error", { allow: ["log", "warn", "error"] }] */

import bus from './bus';

import getGraph from './getGraph';

import {WebglCircle, CircleNodeShader} from './WebglCircleShader';
import Viva from 'vivagraphjs';



export default function createScene(canvas) {
// Since graph can be loaded dynamically, we have these uninitialized
// and captured into closure. loadGraph will do the initialization
let graph, renderer, layout, rendererSettings;

//Save where the graph will be rendered
rendererSettings = {
  container: canvas,
  //by default we won't render links, 
  //but we will later override this to provide hovering highlighting
  renderLinks : false, 
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
  layout.placeNode(function (node) {
    if (!node.data.position) { 
      console.log(node.id + ' does not have position data! Setting to 0,0');
      return {x: 0, y: 0};
    }
    return node.data.position ;
  });
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
      return new WebglCircle(10, 0x009ee8ff); // hex rrggbb);
   });

  //to avoid releasing none existant links
  let releaseLinkInner = graphics.releaseLink;
  graphics.releaseLink = l =>  {if (graphics.getLinkUI(l.id)) releaseLinkInner(l)};

  rendererSettings.graphics = graphics

  //******************************************
  //*************** Events *******************
  //******************************************

  let highlightedNodes = []
  var events = Viva.Graph.webglInputEvents(graphics, graph);
  events.mouseEnter(function (node) {
      console.log('Mouse entered node: ' + node.id);

      //Unhighlight other nodes and their links
      highlightedNodes.forEach(oldnode => higlightNode(oldnode, false));

      //This is going to be the new highlighted 
      highlightedNodes = [node]
      //Highlight the new node
      let nLinks = higlightNode(node, true)
      //Set renderLinks to true if any links should be rendered
      rendererSettings.renderLinks = nLinks > 0;

      //Force a rerender in case the layout is stable
      renderer.rerender()

  }).mouseLeave(function (node) {        
      console.log('Mouse left node: ' + node.id);
      higlightNode(node, false);

      rendererSettings.renderLinks = false
      renderer.rerender()
  })

  // .dblClick(function (node) {
  //     higlightNode(node, false)
  // }).click(function (node) {
  //     higlightNode(node, true)
  // });

  function higlightNode(node, high) {
    let nLinks = 0

    var nodeUI = graphics.getNodeUI(node.id);
    if (high) {
      //Change node color/size
      nodeUI.color = 0xFFA500ff;//TODO: move these to CSS or something?
      nodeUI.size = 11;

      //create UI for links
      if(node.links){     
        node.links.forEach(link => {
          //skip non-outgoing links
          if (link['fromId'] == node.id)
          {          
            // renderer.createLinkUi(link);
            var linkPosition = layout.getLinkPosition(link.id);
            graphics.addLink(link, linkPosition);
            nLinks += 1
          }
        });
      }
    } else {
      //Change node color/size
      nodeUI.color = 0x009ee8ff;
      nodeUI.size = 10;

      //Remove ui for links
      //TODO: skip links we know we didn't highlight?
      if(node.links)
      {
        node.links.forEach(link => {graphics.releaseLink(link)}); //renderer.removeLinkUi(link)
      }
    }

    return nLinks;
  }

  //******************************************
  //*************** Renderer *****************
  //******************************************

  //Finally Ready to initialize and run the renderer!
    renderer = Viva.Graph.View.renderer(graph, rendererSettings);

    if(renderer)
    {
      renderer.run();
      fitAndCenter();

    }

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
    console.log('desired = ' + desiredScale + ' current = ' + currentScale)
    
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

function resetView() {
  if(renderer)
  {
    console.log('Recentering renderer')
    // renderer.reset();
    fitAndCenter();
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
