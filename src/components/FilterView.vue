
<template>
  <div class='filter-box' v-if='showFilter'>
    <div class="f-year">
      Story Years: 
      <input type="radio" value="2018" v-model="selectedYear">
                          <label>2018</label>
      <input type="radio" value="2019" v-model="selectedYear">
                          <label>2019</label>
    <fa-icon class='close-filter' @click.prevent='showFilter = false' :icon="[ 'fas', 'window-close' ]"/>
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
      showFilter: true,
      leastSimilarNode: null,
      otherRelatedNodes: [],
      graph: null,
      storyText: '',
    };
  },

  created() {
    //FIXME: this probably fires toggleLayout unnecessarily
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
        this.showFilter = !this.showFilter
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
  padding: 2px 4px;
  bottom: 9px;
  background: rgba(150, 150, 150, 0.9);
  box-shadow: 0 2px 4px rgba(0,0,0,.2), 0 -1px 0 rgba(0,0,0,.02);

  max-height: 88vh;
  overflow-y: scroll;
  border-radius: 1%;
  z-index: 2;
}

.f-geo, .f-year {
  margin-top: 2px;
  margin-bottom: 2px;
}

.f-year input, 
.f-geo input {
  margin: 5px;
  margin-top: -1px;
  vertical-align: middle;
}

.close-filter {
  float: right;
  margin: 0px;
  padding: 0px;
  font-size: 12px;
  font-weight: bold;
  color: rgba(200, 200, 200);
  cursor: pointer;
}

</style>