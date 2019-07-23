
<template>
	<div class='info-box'>
		<div class="ac-header">
      {{nodeMetaData.label}}
      <br>

      <div class="ac-setin">
        <fa-icon :icon="[ 'fas', 'map-marker' ]"/> 
        {{nodeMetaData.SetInCountry}}
      </div>

      <div class="ac-author">
        <fa-icon :icon="[ 'fas', 'info-circle' ]"/>
        By {{nodeMetaData.AuthorName}} ({{nodeMetaData.AuthorCountry}})
      </div>

    </div>

		<div class="ac-storytext"> 
			<fa-icon :icon="[ 'fas', 'book' ]"/> {{storyText}} 
		</div>

    <div class="ac-related" v-if='pars.showdetails'>
      Related Stories: 
      <ul style="margin-top: 3px">
        <li><div class="ac-most" @click.prevent='goToMostSimilar'>{{mostSimilarTitle}}</div> (Most Similar)</li>
        <li v-for="n in otherRelatedNodes" :key="n.id"><div class="ac-other" @click.prevent='goToOtherNode(n)'>{{n.data.label}}</div></li>
        <li><div class="ac-least" @click.prevent='goToLeastSimilar'>{{leastSimilarTitle}}</div> (Least Similar)</li>
      </ul>
    </div>
    <div class="ac-more" @click.prevent='readMore' v-else > Continue Reading ... </div>

	</div>
</template>


<script>
/*eslint no-console: ["error", { allow: [ "warn", "error"] }] */
import bus from '../lib/bus';
import jsyaml from 'js-yaml';
import axios from 'axios';

export default {
	name: 'StoryView',
	props: ['pars'],
	data() {
		return {
      mostSimilarNode: null,
      leastSimilarNode: null,
      otherRelatedNodes: [],
      graph: null,
      storyText: '',
		};
	},

  watch: { 
    pars: {
      deep: true,
      immediate: true, 
      handler (pars, _oldpars) {  /* eslint-disable-line no-unused-vars */

        //let's get story text if requested ... 
        this.storyText = 'No story selected ...'
        if(pars.node)
        {
          this.storyText = pars.node.data.Excerpt;
          if (pars.showdetails){
            // TODO: actually fetch the story details and show them
            this.storyText += ' (... Fetching more of the story ...)'
            getStoryFullText(this.pars.node.id, this.$parent.year)
              .then(txt => this.storyText = txt)
          }
        }

        //we are going to extract the most/least similar nodes

        //start by assuming they are null
        this.mostSimilarNode  = null
        this.leastSimilarNode = null
        this.otherRelatedNodes = []

        //if new node and graph are defined,
        if (pars.node && this.$parent.graph) {
          //iterate over the node links and get the nodes
          for(let i = 0; i < pars.node.links.length; ++i)
          {
            let l = pars.node.links[i]

            //only interested in outbound links!
            if (l.fromId != pars.node.id) continue;

            let toNode = this.$parent.graph.getNode(l.toId)
            if ('mostSimilar' in l.data)
            {
              this.mostSimilarNode = toNode
            }
            else if ('leastSimilar' in l.data)
            {
              this.leastSimilarNode = toNode
            }
            else
            {
              this.otherRelatedNodes.push(toNode)
            }
          }//endfor
        }//endif
      }//end handler
    }//end pars
  },//end watch


	methods:
  {
    readMore(){
      //pretend node was clicked which will get App.vue to trigger on that node
      //therefore this component will re-render but with showdetails = true...
      //hacky, but that's because we're not allowed to change showdetails as its a prop :s
      bus.fire('emulate-node-click', this.pars.node);
    },

    goToOtherNode(node){
      if(node)
      {
        bus.fire('emulate-node-click', node);
      }
    },
    goToLeastSimilar(){
      if (this.leastSimilarNode){
        bus.fire('emulate-node-click', this.leastSimilarNode);
      }
    },

    goToMostSimilar(){
      if (this.mostSimilarNode){
        bus.fire('emulate-node-click', this.mostSimilarNode);
      }
    }
  },

	computed:
	{
		nodeMetaData(){
			if(this.pars.node)
			{
				return this.pars.node.data
			}
			return {label: 'No story selected ...'}
		},



    mostSimilarTitle(){
      if(this.mostSimilarNode)
      {
        return this.mostSimilarNode.data.label
      }
      return 'None?'
    },

    leastSimilarTitle(){
      if(this.leastSimilarNode)
      {
        return this.leastSimilarNode.data.label
      }
      return 'None?'
    }
	}
}



function getStoryFullText(node_id, year = '2018')
{
  let storageURL = 'https://storage.googleapis.com/nomadstories/dataFolder/'
  storageURL += year + '/'
  storageURL += encodeURIComponent(node_id)

  return axios.get(storageURL).then( 
      response => { return jsyaml.load(response.data)['Text'];})
    .catch( e => {return e});
}



</script>


<style>
* {
    box-sizing: border-box;
    z-index: 1; /* this might backfire? */
}

.info-box {
  position: absolute;
  left: 8px;
  padding: 14px;
  top: 2vh;
  width: 420px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0,0,0,.2), 0 -1px 0 rgba(0,0,0,.02);

  max-height: 88vh;
  overflow-y: scroll;
  border-radius: 2%;
  z-index: 1;

}


.ac-header {
  font-size: 1.25em;
  text-align: center;
  margin: 0px
}

.ac-setin,
.ac-author {
  font-size: 0.6em !important; 
  margin: 8px;
}


.ac-more {
  cursor: pointer;
  color: blue;
}

.ac-related {
  display: inline
}

.ac-other,
.ac-most

{
  cursor: pointer;
  color: blue;
  display: inline;
}
.ac-least
{
  cursor: pointer;
  color: red;
  display: inline;
}

.ac-storytext{
  margin: 20px 0px;
  white-space: pre-line;

  max-height: 40vw;
  overflow-y: scroll;

  background: rgba(150, 150, 150, 0.4);

}

</style>