import { scene as makeWGLScene, PointCollection, WireCollection} from 'w-gl';
import bus from './bus';
import getGraph from './getGraph';
import createLayout from 'ngraph.forcelayout';

import Viva from 'vivagraphjs';

export default function createScene(canvas) {
  let drawLinks = false;

  // Since graph can be loaded dynamically, we have these uninitialized
  // and captured into closure. loadGraph will do the initialization
  let graph, layout;
  let renderer, linkUI, nodeUI;

  let layoutSteps = 0; // how many frames shall we run layout?
  let rafHandle;

  getGraph(null).then(loadGraph);

  bus.on('load-graph', loadGraph);

  return {
    dispose,
    resetView,
  };

  function loadGraph(newGraph) {
    if (renderer) {
      renderer.dispose();
      renderer = null
    }
    // scene = initScene();
    graph = newGraph

    layout = Viva.Graph.Layout.constant(graph); 
    // node placement is simply given by the
    // position data for each node
    layout.placeNode(function (node) {
      if (!node.data.orgPos) { console.log(node.data); return {x: 0, y: 0};}
      return {x: node.data.orgPos['x'], y: node.data.orgPos['y']} ;
    });
    layout.step();


    var graphics = Viva.Graph.View.svgGraphics();

    var defs = Viva.Graph.svg('defs');
    graphics.getSvgRoot().append(defs);

    // specify where it should be rendered:
    console.log(document.getElementById( 'cnv' ))
    renderer = Viva.Graph.View.renderer(graph, {
      graphics:  Viva.Graph.View.webglGraphics(), //TODO: fallback to SVG if webGL not supported?
      layout: layout,
      container: canvas,
      renderLinks : true,
      prerender  : true

    });
    if(renderer)
      renderer.run();




    // var graphGenerator = Viva.Graph.generator();
    // var graph2 = graphGenerator.grid(5, 5);
    // var graphics = Viva.Graph.View.webglGraphics();


    // var layout2 = Viva.Graph.Layout.forceDirected(graph2, {
    //     springLength : 10,
    //     springCoeff : 0.0005,
    //     dragCoeff : 0.02,
    //     gravity : -1.2
    // });

    // var renderer2 = Viva.Graph.View.renderer(graph, {
    //     layout : layout,
    //     container: document.getElementById('cnv'),
    // });

    // renderer2.run();



    // let ui = initUIElements();
    // linkUI = ui.linkUI;
    // nodeUI = ui.nodeUI;

    // rafHandle = requestAnimationFrame(frame);
  }

  function resetView() {
    //TODO: do whatever is needed to reset the view ...
    return ;
  }

  function initScene() {
    let scene = makeWGLScene(canvas);
    scene.setClearColor(12/255, 41/255, 82/255, 1)
    let initialSceneSize = 100;
    scene.setViewBox({
      left:  -initialSceneSize,
      top:   -initialSceneSize,
      right:  initialSceneSize,
      bottom: initialSceneSize,
    });
    return scene;
  }
  
  function initUIElements() {
    let nodeIdToUI = new Map();
    let linkIdToUI = new Map();
    let nodes = new PointCollection(graph.getNodesCount());
    graph.forEachNode(node => {
      var point = layout.getNodePosition(node.id);
      let size = 10;
      if (node.data && node.data.size) {
        size = node.data.size;
      } else {
        if (!node.data) node.data = {};
        node.data.size = size;
      }
      point.size = size
      point.color = {
        r: 114/255,
        g: 248/255,
        b: 252/255,
      }
      var ui = nodes.add(point, node.id);
      nodeIdToUI.set(node.id, ui);
    });

    let lines = new WireCollection(graph.getLinksCount());
    lines.color.r = 6/255;
    lines.color.g = 28/255;
    lines.color.b = 70/255;
    lines.color.a = 0.2;

    graph.forEachLink(link => {
      var from = layout.getNodePosition(link.fromId);
      var to = layout.getNodePosition(link.toId);
      var line = { from, to };
      var ui = lines.add(line);
      linkIdToUI.set(link.id, ui);
    });

    // scene.appendChild(lines);
    scene.appendChild(nodes);

    return {nodeUI: nodeIdToUI, linkUI: linkIdToUI};
  }

  function frame() {
    rafHandle = requestAnimationFrame(frame);

    if (layoutSteps > 0) {
      layoutSteps -= 1;
      layout.step();
    }
    drawGraph();
    scene.renderFrame();
  }

  function drawGraph() {
    graph.forEachNode(node => {
      var pos = layout.getNodePosition(node.id);
      nodeUI.get(node.id).update(pos);
    });

    if (drawLinks) {
      graph.forEachLink(link => {
        var fromPos = layout.getNodePosition(link.fromId);
        var toPos = layout.getNodePosition(link.toId);
        linkUI.get(link.id).update(fromPos, toPos);
      })
    }
  }

  function dispose() {
    cancelAnimationFrame(rafHandle);

    bus.off('load-graph', loadGraph);
  }
}