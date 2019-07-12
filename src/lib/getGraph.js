/**
 * Load your graph here.
 */

import fromJson from 'ngraph.fromjson';
import axios from 'axios'

var assert = require('assert');

/* MUSTDO: make the file smaller ... */
export function getGraph(jsonGraphFileURL = './2018Stories_viva.json') {

  return axios.get(jsonGraphFileURL).then( 
    response => {
      return tryJson(response.data);
  });
  //TODO: add catch handling of error ...
}

function tryJson(jsonContent) {
  try {
     computePositions(jsonContent)
     var graph = fromJson(jsonContent)
     if(graph == null)
     {
      console.log('wtf')
      graph.pos = 3
     }
     return graph
  } catch (e) {
    //eslint-disable-next-line
    console.log('error loading JSON: ', e)
    return null;
  }

}


//TODO: consider memoizing!
function projection(latlon)
{
  let pos = {
      x:  20*latlon['lon']*Math.cos(latlon['lat']/180*Math.PI), 
      y: -20*latlon['lat']
    };
  return pos
}

function computePositions(jsonContent)
{
  const R0 = 5, dR = .4;
  const dTheta_at_R1 = 2 * Math.PI / 5 ;

  for (const [country, latlon] of Object.entries(jsonContent.metadata.countryPositions)) {
    jsonContent.metadata.countryPositions[country].xypos = projection(latlon)
    jsonContent.metadata.countryPositions[country].theta = 0
    jsonContent.metadata.countryPositions[country].R = R0

  }

  jsonContent.nodes.forEach(n => {
    let setinC = jsonContent.metadata.countryPositions[n.data['SetInCountry']]
    let p = setinC.xypos

    n.data.position = {x: p.x     + setinC.R * Math.cos(setinC.theta), 
                       y: p.y*1.2 + setinC.R * Math.sin(setinC.theta)
                      }

    setinC.R += dR
    setinC.theta += dTheta_at_R1 / Math.sqrt(setinC.R);

  });
}
export function geoColocPositioner (node) {

    if (!node.data.position) { 
      console.log(node.id + ' does not have position data! Setting to 0,0');
      return {x: 0, y: 0};
    }

    return node.data.position ;

}

