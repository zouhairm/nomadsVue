<template>
  <div id="app">
          <!-- Set the display of this container to none so we can
         add it programmatically to `legendControl` -->

    <div class='legend' v-show='!showAbout'>
      <div class="country">
        <h4>Author Country:</h4>
        <div><span style='background-color: #ffaa00'></span>Africa</div>
        <div><span style='background-color: #fffb00'></span>Asia</div>
        <div><span style='background-color: #0062ff'></span>Europe</div>
        <div><span style='background-color: #37ff00'></span>N. America</div>
        <div><span style='background-color: #fb00ff'></span>S. America</div>
        <div><span style='background-color: #ff0015'></span>Oceania</div>
      </div>

      <div class="links">
        <h4>Story Similarity:</h4>
        <div><span style="color:#4949ff; ">&#8211;</span>Most</div>
        <div><span style="color:gray;">&#8211;</span>Somewhat</div>
        <div><span style="color:red; ">&#8211;</span>Least</div>
      </div> 
    </div>

    <div id="mapCanvas"></div>
    <div id="cnv"></div>





    <story-view id='story' :pars='storyViewPars'  v-if='showStory'> </story-view>

    <search-view id='search' v-if='!isMobile()'></search-view>

    <div id='about' class='about-box' v-if='showAbout'>
        <fa-icon class='close-about' @click.prevent='closeAbout()' :icon="[ 'fas', 'window-close' ]"/>
        <h2>About <em>Nomads' Vue</em></h2>
        <div style='text-align: left'>
        <p>
          <span style='font-weight: bold;'>Intro</span>
          This project is intended to help explore travel stories by thousands of people that have been submitted to the Travel Nomad Contest.<br>

          Hopefully this makes the submissions of these aspiring writers fun to explore, and that a wide audience of users finds it interesting; whether it be aspiring travel writers, daydreaming office workers thinking about exploring a new destination, or social scientists interested in understanding why and how people travel. In a time where it feels like differences between nations and their people are amplified, I hope this serves as reminder that so many of us are connected through the way we experience our planet and each other.

          <br><br>
          <span style='font-weight: bold;'>How to Use</span>

          When a story is hovered or selected, the story and its metadata (location, author, title) are displayed in a reading pane on the left. A Neural-Network model was trained on the stories to find relations between them, and similar as well as the least similar stories to the selected story that are identified by the model are highlighted and can be explored from the graph or the reading view.<br>

          The stories are displayed geographically and color-coded by the continent origin of the author. It is also possible to cluster most similar or least similar stories together using the options popup in the bottom-right corner.

          The stories' metadata are searchable using the top-right corner box.
          <br><br>

          Go Ahead - Explore the map, hover on stories, search for keywords, and enjoy reading the stories!<br>
          If you get lost or the screen bugs up, <b>double click to reset</b>
          <br><br> 

          <span style='font-weight: bold;'>Credits</span>
          This project is made possible thanks to the following packages and data:
          <ul>
              <li><a target="_blank" href="https://www.worldnomads.com/create/scholarships/writing/2018/results">Travel Nomad Stories</a></li>
              <li><a target="_blank" href="https://radimrehurek.com/gensim/models/doc2vec.html">GenSim (Doc2Vec)</a></li>
              <li><a target="_blank" href="https://github.com/vuejs/awesome-vue">Vue.js</a></li>
              <li><a target="_blank" href="https://github.com/anvaka/VivaGraphJS">VivaGraphJS (w/ WebGL renderer)</a><li><a target="_blank" href="https://www.mapbox.com/">Mapbox</a></li>
          </ul>

          For more background, insights, and technical details; check out my <a target="_blank" href="https://zouhairm.github.io/writerBlock">Blog Post</a>

        </p>
        </div>
        <!-- <a href='#' @click.prevent='showAbout = false'  class='close-about' title='Close this message'>Close</a> -->
    </div>

    <filter-view id='filter'> </filter-view>

    <div class='footer'>
        <a @click.prevent='toggleAbout()' class='about-link'>About</a>
        <p class='copyText'>
            Made during late night hours by <a target="_blank" href="https://zouhairm.github.io/bio">Zouhair M</a>
        </p>

        <a v-if='!showAbout' @click.prevent='showFilter = !showFilter && !showAbout' class='options-link'>Settings</a>
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
      mapbox: null,
      storyViewPars: { node: null, showdetails: false},
      year: '2019',
    };
  },


  methods: {
    toggleAbout() {
      this.showAbout = !this.showAbout;
      this.showFilter = !this.showAbout && !this.isMobile()
    },
    closeAbout() {
      this.showAbout = false
      this.showFilter = !this.isMobile()
    },
    isMobile() {
     return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
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
    this.mapbox.dragPan.disable()



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
  touch-action: none;
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
  box-shadow: 0 2px 4px rgba(0,0,0,.2), 0 -1px 0 rgba(0,0,0,.02);
  z-index: 1;
}
@media all and (min-width:0px) and (max-width: 640px) {
.about-box {
  position: absolute;
  left: 8px;
  padding: 14px;
  top: 2vh;
  width: 420px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0,0,0,.2), 0 -1px 0 rgba(0,0,0,.02);
  max-height: 88vh;
  max-width: 95vw;
  overflow-y: scroll;
  border-radius: 2%;
  z-index: 1;
  }
}

.about-link {
  background: rgba(0, 120, 120, 0.4);
  padding: 5px 10px;
  margin-right: 5px;
  border-radius: 5%;
  cursor: pointer;
  z-index: 1;
}
.options-link {
  background: rgba(0, 120, 120, 0.4);
  padding: 5px 10px;
  margin-right: 5px;
  position: absolute;
  right: 20px;
  border-radius: 5%;
  cursor: pointer;
  z-index: 1;
}

.close-about {
  position: sticky;
  top: 0;
  float: right;
  margin: 0px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: rgb(100,100,100);
  z-index: 2;
}

.legend {
  z-index: 1;
  /*background-color: rgb(100,100,100, 0.05);*/
  color: gray;
  /*box-shadow: 0 1px 2px rgba(0,0,0,0.10);*/
  font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
  position: absolute;
  display: inline-grid;

  margin: auto;
  right: 0px;
  left: 0px;
  top: 5px;
  max-width: 35vw;
  height: 6vh;
}

@media all and (min-width:0px) and (max-width: 640px) {
  .close-about {
    font-size:25px;
  }
  .legend{
    font: 9px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
    max-width: unset;
    max-height: 1vh;
    right: unset;
    line-height: 5px;
  }
}

.legend .country,
.legend .links{
  display: inline-flex;
}
 
.legend h4 {
  margin: 0 5px 5px;
}
 
.legend div span {
  border-radius: 50%;
  display: inline-block;
  height: 5px;
  width: 5px;
  margin-right: 5px;
  margin-left: 5px;
}

.legend .links div span {
  -webkit-text-stroke-width:4px;
}


</style>
