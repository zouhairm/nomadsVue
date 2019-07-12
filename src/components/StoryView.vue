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
      Most Similar: {{mostSimilar}}<br>
      Least Similar: {{leastSimilar}}
    </div>
    <div class="ac-more" @click.prevent='readMore' v-else > Continue Reading ... </div>

	</div>
</template>


<script>
import bus from '../lib/bus';

export default {
	name: 'StoryView',
	props: ['pars'],
	data() {
		return {
			Title: 'Hello World!',
			Author: 'Me!',
			Text: 'lol'
		};
	},
	methods:
  {
    readMore(){
      //pretend node was clicked which will get App.vue to trigger on that node
      //therefore this component will re-render but with showdetails = true...
      //hacky, but that's because we're not allowed to change showdetails as its a prop :s
      bus.fire('node-clicked', this.pars.node);
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

		storyText(){
			if(this.pars.node)
			{
				if (this.pars.showdetails)
				{
					// TODO: actually fetch the story details and show them
					return this.pars.node.data.Excerpt;
				}
				else
				{
					return this.pars.node.data.Excerpt;
				}
			}
			return 'No story selected ...'
		},

    mostSimilar(){
      if(this.pars.node)
      {
        return 'Need to find most similar story!'
      }
      return 'None'
    },
    leastSimilar(){
      if(this.pars.node)
      {
        return 'Need to find least similar story!'
      }
      return 'None'
    }
	}
}


</script>


<style>
.info-box {
  position: absolute;
  left: 8px;
  padding: 14px;
  top: 64px;
  width: 420px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0,0,0,.2), 0 -1px 0 rgba(0,0,0,.02);

  max-height: 78vh;
  overflow-y: auto;
}


.ac-header {
  font-size: 1.25em;
  text-align: center;
  margin: 20px
}

.ac-setin,
.ac-author {
  font-size: 0.6em !important; 
  margin: 8px;
}

.ac-related,
.ac-more {
  cursor: pointer;
  color: blue;
}

.ac-storytext{
  margin: 20px 0px;
  white-space: pre-line;
}

</style>