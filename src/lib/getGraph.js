/**
 * Load your graph here.
 */

import fromJson from 'ngraph.fromjson';
import axios from 'axios'

export default function getGraph(jsonGraphFileURL) {

  if ( jsonGraphFileURL == null )
  {
  	var jsonGraphFileURL = './2018Stories_cyto_debug.jsonviva.json';
  }

  return axios.get(jsonGraphFileURL).then( response => {
  			console.log('finally received data!')
  			console.log(response.data);
  			return Promise.resolve(tryJson(response.data));
  		});

  console.log('already returned :(')
  return null;

}

function tryJson(jsonContent) {
	try {
	  return fromJson(jsonContent);
	} catch (e) {
	  //eslint-disable-next-line
	  console.log('error loading JSON: ', e)
	  return null;
	}

}