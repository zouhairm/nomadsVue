/**
 * Load your graph here.
 */

import fromJson from 'ngraph.fromjson';
import axios from 'axios';

import bus from './bus';

/* MUSTDO: make the file smaller ... */
export function getGraph(jsonGraphFileURL = './2018Stories_viva.json') {

  return axios.get(jsonGraphFileURL).then( 
    response => {
      let g = tryJson(response.data);
      bus.fire('load-graph', g)
  });
  //TODO: add catch handling of error ...
}

function tryJson(jsonContent) {
  try {
     computePositions(jsonContent)
     return fromJson(jsonContent)
  } catch (e) {
    //eslint-disable-next-line
    console.error('error loading JSON: ', e)
    return null;
  }

}



function projection(latlon)
{

  // let pos = NicolosiProjection(latlon['lon']*Math.PI/180, latlon['lat']*Math.PI/180)
  // pos.x *=  2000;
  // pos.y *= -2000;

  //equirectangular

  // latlon['lon'] = Math.round(latlon['lon']/15) * 15
  // latlon['lat'] = Math.round(latlon['lat']/15) * 15



  let pos = {
      x:  50*latlon['lon'],//*Math.cos(latlon['lat']/180.*Math.PI), 
      y: -50*latlon['lat']
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
      return {x: 0, y: 0};
    }

    return node.data.position ;

}


//Implementation of https://en.wikipedia.org/wiki/Nicolosi_globular_projection
//Taken from here: http://www.jhlabs.com/java/maps/proj/
function NicolosiProjection(lon,  lat) { /* eslint-disable-line no-unused-vars */
  var out = {}

  const EPS = 1e-10;
  const HALFPI = Math.PI/2;

  // lon = (lon + 20*Math.PI/180.)

  if (lon > Math.PI)
    lon -= 2*Math.PI

  if (Math.abs(lon) < EPS) {
    out.x = 0;
    out.y = lat;
  } else if (Math.abs(lat) < EPS) {
    out.x = lon;
    out.y = 0.;
  } else if (Math.abs(Math.abs(lon) - HALFPI) < EPS) {
    out.x = lon * Math.cos(lat);
    out.y = HALFPI * Math.sin(lat);
  } else if (Math.abs(Math.abs(lat) - HALFPI) < EPS) {
    out.x = 0;
    out.y = lat;
  } else {
    let tb, c, d, m, n, r2, sp;

    tb = HALFPI / lon - lon / HALFPI;
    c = lat / HALFPI;
    d = (1 - c * c)/((sp = Math.sin(lat)) - c);
    r2 = tb / d;
    r2 *= r2;
    m = (tb * sp / d - 0.5 * tb)/(1. + r2);
    n = (sp / r2 + 0.5 * d)/(1. + 1./r2);
    let x = Math.cos(lat);
    x = Math.sqrt(m * m + x * x / (1. + r2));
    out.x = HALFPI * ( m + (lon < 0. ? -x : x));
    let y = Math.sqrt(n * n - (sp * sp / r2 + d * sp - 1.) /
      (1. + 1./r2));
    out.y = HALFPI * ( n + (lat < 0. ? y : -y ));
  }
  return out;

}



