<template>
  <div id="app">
    <a href="#" @click.prevent='runLayout' class='btn-command'>Make 200 layout steps</a>
    
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
    runLayout() {
      this.scene.runLayout(200);
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
