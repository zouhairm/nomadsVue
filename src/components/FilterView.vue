
<template>
  <div class='filter-box' v-if='showFilter'>
    <div class="f-year">
      Story Years: 
      <input type="radio" value="2018" v-model="selectedYear">
                          <label>2018</label>
      <input type="radio" value="2019" v-model="selectedYear">
                          <label>2019</label>
    </div>
    <div class="f-geo">
      Layout Clustering: 
      <input type="radio" value="geo" v-model="selectedLayout">
                          <label>Geo</label>
      <input type="radio" value="mostSimilar" v-model="selectedLayout">
                          <label>Similar</label>
      <input type="radio" value="leastSimilar" v-model="selectedLayout">
                          <label>Disimilar</label>
    </div>

    <a href='#' @click.prevent='showFilter = false'  class='close-filter' title='Close'>[x]</a>
  </div>
</template>


<script>
/*eslint no-console: ["error", { allow: [ "warn", "error"] }] */
import bus from '../lib/bus'
import {getGraph} from '../lib/getGraph';

export default {
  name: 'FilterView',
  props: ['show'],
  data() {
    return {
      selectedYear: '2019',
      selectedLayout: 'geo',
      showFilter: false,
      leastSimilarNode: null,
      otherRelatedNodes: [],
      graph: null,
      storyText: '',
    };
  },

  created() {
    bus.on('load-graph', () => {this.selectedLayout = 'geo'})
  },

  watch: {
    selectedYear:
    {
      handler (new_year, old_year) { 
        if(new_year != old_year){
          getGraph(new_year);
        }
      }//end handler
    },
    selectedLayout:
    {
      handler (new_layout, old_layout){
        if(new_layout != old_layout){
          this.$parent.scene.toggleLayout(new_layout)
        }
      }
    },
    show: {
      handler (new_val, _oldpars) {  /* eslint-disable-line no-unused-vars */
        this.showFilter = new_val
      }//end handler
    }//end pars
  },//end watch
}




</script>

<style scoped>
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
.f-geo input {
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