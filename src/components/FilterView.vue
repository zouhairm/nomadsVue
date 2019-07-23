
<template>
  <div class='filter-box' v-if='showFilter'>
    <div class="f-year">
      Story Years: 
      <input type="radio" value="2018" class='f-year' v-model="selectedYear">
      <label for="one">2018</label>
      <input type="radio" value="2019" class='f-year' v-model="selectedYear">
      <label for="two">2019</label>
    </div>
    More to come ...

    <a href='#' @click.prevent='showFilter = false'  class='close-filter' title='Close filter'>[x]</a>
  </div>
</template>


<script>
/*eslint no-console: ["error", { allow: [ "warn", "error"] }] */
import bus from '../lib/bus';
import {getGraph} from '../lib/getGraph';

export default {
  name: 'FilterView',
  props: ['show'],
  data() {
    return {
      selectedYear: '2019',
      showFilter: false,
      leastSimilarNode: null,
      otherRelatedNodes: [],
      graph: null,
      storyText: '',
    };
  },

  watch: {
    selectedYear:
    {
      handler (new_year, old_year) { 
        if(new_year != old_year)
        {
          getGraph(new_year);
          this.showFilter = false;
        }
      }//end handler
    },
    show: {
      // immediate: true, 
      handler (new_val, _oldpars) {  /* eslint-disable-line no-unused-vars */
        this.showFilter = !this.showFilter
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
  },
}




</script>

<style>
* {
    box-sizing: border-box;
    z-index: 1; /* this might backfire? */
}

.filter-box {
  position: absolute;
  right: 8px;
  padding: 14px;
  bottom: 40px;
  width: 420px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0,0,0,.2), 0 -1px 0 rgba(0,0,0,.02);

  max-height: 88vh;
  overflow-y: scroll;
  border-radius: 2%;
  z-index: 1;

}
.f-year input { 
  margin: 10px;
}

.close-filter {
  float: right;
  margin-right: 14px;
  font-size: 12px;
  font-weight: bold;
  color: blue;
}

</style>