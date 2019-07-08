<template>
  <div id="app">
    <a href="#" @click.prevent='resetView' class='btn-command'>Reset View</a>
    
    <a href="#" @click.prevent='loadAllStories' class='btn-command'>Load All Stories!</a>

  </div>
</template>

<script>
import createScene from './lib/createScene';
import bus from './lib/bus';
import getGraph from './lib/getGraph.js'
export default {
  name: 'app',
  methods: {
    resetView() {
      this.scene.resetView()
    },

    loadAllStories() {
      var pr = getGraph('./2018Stories_cyto.jsonviva.json');
      pr.then(function(g) {if(g) bus.fire('load-graph', g)});
    }
  },
  mounted() {
    const canvas = document.getElementById('cnv');
    this.scene = createScene(canvas);
  },
  beforeDestroy() {
    if (this.scene) {
      this.scene.dispose();
    }
  }
}
</script>

<style>
#app {
  position: absolute;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.row .label {
  flex: 1;
}
.row .value {
  flex: 1;
}
.row select {
  width: 100%;
}
.btn-command {
  display: block;
  padding: 4px;
  margin-top: 10px;
  border: 1px solid;
}

a {
  color: rgb(244, 244, 244);
  text-decoration: none;
  text-align: center;
  padding: 0 4px
}
</style>
