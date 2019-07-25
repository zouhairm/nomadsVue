<template>
  <div id="app">
    <div id="mapCanvas"></div>
    <div id="cnv"></div>
<!-- 
    <div id="controls">
      <a href="#" @click.prevent='toggleLayout' class='btn-command'>Reset Layout</a>
    </div> -->


    <story-view id='story' :pars='storyViewPars'  v-if='showStory'> </story-view>

    <search-view id='search'></search-view>

    <div id='about' class='about-box' v-if='showAbout'>
        <h2>About Project</h2>
        <div style='text-align: left'>
            <p>A Factual Intro (narrative to come ...)</p>
            <p>This web site is intended to help explore travel stories by thousands of people that have been submitted to the Travel Nomad Contest.<br>
            The stories are displayed geographically and their metadata (location, author, title) are searchable.
            A NN (LSTM w/ Doc2Vec) was trained on the stories to find relations between them. When a story is selected, the 4-most similar as well as the least similar story to it are highlighted.<br><br>

            Hopefully this makes the submissions of these aspiring writers fun to explore.
            Go Ahead - Explore the map, hover on stories, search for keywords, and enjoy reading the stories!<br>
            P.S. If you get lost or the screen bugs up, just double click to reset!</p>

        This is made possible thanks to the following packages/data
        <ul>
            <li><a target="_blank" href="https://www.worldnomads.com/create/scholarships/writing/2018/results">Travel Nomad Stories</a></li>
            <li><a target="_blank" href="https://radimrehurek.com/gensim/models/doc2vec.html">GenSim (Doc2Vec)</a></li>
            <li><a target="_blank" href="https://github.com/vuejs/awesome-vue">Vue.js</a></li>
            <li><a target="_blank" href="https://github.com/anvaka/VivaGraphJS">VivaGraphJS (w/ WebGL renderer)</a><li><a target="_blank" href="https://www.mapbox.com/">Mapbox</a></li>
        </ul>
        <p>For technical details, check out this <a target="_blank" href="https://zouhairm.github.io/writerBlock">Blog Post</a></p>
        </div>
        <a href='#' @click.prevent='showAbout = false'  class='close-about' title='Close this message'>Close</a>
    </div>

    <filter-view id='filter' :show='showFilter'> </filter-view>

    <div class='footer'>
        <a @click.prevent='showAbout = !showAbout' class='about-link'>About</a>
        <p class='copyText'>
            Made during late night hours by <a target="_blank" href="https://zouhairm.github.io/bio">Zouhair M</a>
        </p>

        <a @click.prevent='showFilter = !showFilter' class='filter-link'>Filter</a>
        <a @click.prevent='runFunky' class='funky-link'>Relayout</a>

    </div>



  </div>
</template>

<script>
/*eslint no-console: ["error", { allow: [ "warn", "error"] }] */

import {createScene} from './lib/createScene';
import bus from './lib/bus';


import StoryView  from './components/StoryView.vue'
import SearchView from './components/SearchView.vue'
import FilterView from './components/FilterView.vue'

var mapboxgl = require('mapbox-gl');


export default {
  name: 'app',
  data() {
    
    return {
      scene: null,
      showAbout: true,
      showFilter: false,
      graph: null,
      year: '2019',
      mapbox: null,
      storyViewPars: { node: null, graph: null, showdetails: false},
    };
  },


  methods: {
    runFunky(){
      this.scene.funkyLayout();
    },
    toggleLayout(){
      this.scene.toggleLayout();
    },
    resetView() {
      this.scene.resetView()
    },
  },

  computed:
  {
    showStory() {
      //don't show if showabout is being show
      if(this.showAbout) return false

      //otherwise show if selected node is not null
      return this.storyViewPars.node !=null
    }

  },

  components:
  {
    SearchView,
    StoryView,
    FilterView,
  },

  created(){
    bus.on('load-graph', (g, year) => {this.graph = g; this.year = year});
  },
  mounted() {

    //Token restricted to zouhairm.github.io/nomadsVue - please don't steal :p
    mapboxgl.accessToken = 'pk.eyJ1Ijoiem9vaGFpciIsImEiOiJjanlmMWRzenExN2N4M2xzOGVvdDg2eG9jIn0.HX4LVDqBgxUKivoqPLk_4w'

    this.mapbox = new mapboxgl.Map({
      container: 'mapCanvas',
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [0, 0],
      zoom: 1,
      minZoom: 1,
      maxZoom: 10,
    });
    this.mapbox.scrollZoom.disable()
    window.mapbox = this.mapbox


    const canvas = document.getElementById('cnv');
    this.scene = createScene(canvas, this.mapbox);

    //needed to provide closure in the
    //callbacks below -- yay JS !
    var self = this

    //register and handle events
    bus.on('node-hovered', nodeHovered);
    bus.on('node-clicked', nodeClicked);
    function nodeHovered(node)
    {
      self.storyViewPars.node = node;
      self.storyViewPars.showdetails = false;
    }

    function nodeClicked(node)
    {
      self.storyViewPars.node = node;
      self.storyViewPars.showdetails = true;

      //if clicked, forceShowAbout to close!
      self.showAbout = false

    }


  },
  beforeDestroy() {
    if (this.scene) {
      this.scene.dispose();
    }
  }

}
</script>

<style>
* {
    box-sizing: border-box;
    z-index: 1; /* this might backfire? */
}

body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;

  /* font info has to be applied to body so it applies to mouse overs and date picker */
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  position: relative;
  width: 100%;
  height: 100%;
}

#mapCanvas {
  z-index:0;
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
#cnv {
  z-index: 0;
  width: 100vw;
  height: 100vh;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #000000d9;

/*  background: #000000d9 url('assets/world-map-equirectangular.png') no-repeat;
  background-attachment: fixed;
  background-position: 0px 0px;
  /*background-width: 100vw;*/
}
canvas{ position: relative; z-index: 1 }


.btn-command {
  display: block;
  width: 20%;
  padding: 4px;
  margin-top: 10px;
  border: 1px solid;
  color: red;
  position: relative;
}

a {
  color: rgb(53, 162, 162);
  text-decoration: none;
  text-align: center;
  padding: 0 4px
}


.footer {
  position: absolute;
  width: 100%;
  left: 10px;
  bottom : 9px;
  display: flex;
  z-index: 1;

}

.copyText {
  font-size: 9px;
  color: #999;
}

.about-box {
  position: absolute;
  overflow: scroll;
  max-height: 80vh;
  max-width: 75vw;

  margin: auto;
  left: 0; right: 0; top: 64px;

  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1%;
  box-shadow: 0 2px 4px rgba(0,0,0,.2), 0 -1px 0 rgba(0,0,0,.02);
  z-index: 1;

}
.about-link {
  background: rgba(0, 120, 120, 0.4);
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 5%;
  cursor: pointer;
  z-index: 1;
}
.funky-link, 
.filter-link {
  background: rgba(0, 120, 120, 0.4);
  padding: 5px 10px;
  margin-right: 5px;
  position: absolute;
  right: 20px;
  border-radius: 5%;
  cursor: pointer;
  z-index: 1;
}
.funky-link {
  bottom: 100px;
}
.close-about {
  float: right;
  margin-right: 14px;
  font-size: 12px;
  font-weight: bold;
  color: blue;
}

</style>
