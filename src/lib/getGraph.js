/**
 * Load your graph here.
 */

import fromJson from 'ngraph.fromjson';
import axios from 'axios';

import bus from './bus';

import {LngLat} from 'mapbox-gl'

/* MUSTDO: make the file smaller ... */
export function getGraph(map, year = '2019') {
  let jsonGraphFileURL = `./Stories_viva_${year}.json`
  return axios.get(jsonGraphFileURL)
    .then( 
      response => {
        let g = tryJson(map, response.data);
        bus.fire('load-graph', g, year);
  });
  //TODO: add catch handling of error ...
}

function tryJson(map, jsonContent) {
  try {
     computePositions(map, jsonContent)
     return fromJson(jsonContent)
  } catch (e) {
    //eslint-disable-next-line
    console.error('error loading JSON: ', e)
  }

}

function projection(map, latlon)
{
  var p = map.project(new LngLat(latlon['lon'], latlon['lat']))
  return p;
}

function computePositions(map, jsonContent)
{
  const R0 = .1, dR = .1/3;
  const dTheta_at_R1 = 2 * Math.PI / 10 /2 ;

  for (const [country, latlon] of Object.entries(jsonContent.metadata.countryPositions)) {
    jsonContent.metadata.countryPositions[country].xypos = projection(map, latlon)
    jsonContent.metadata.countryPositions[country].theta = 0
    jsonContent.metadata.countryPositions[country].R = R0

  }

  jsonContent.nodes.forEach(n => {
    let setinC = jsonContent.metadata.countryPositions[n.data['SetInCountry']]
    let p = setinC.xypos

    n.data.position = {x: p.x     + setinC.R * Math.cos(setinC.theta), 
                       y: p.y     + setinC.R * Math.sin(setinC.theta)
                      }

    setinC.R += dR
    setinC.theta += dTheta_at_R1 / Math.sqrt(setinC.R);

  });
}
export function geoColocPositioner (node) {

    if (!node.data.position) { 
      return {x: 0, y: 0};
    }

    return node.data.position ;

}




