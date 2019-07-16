<template>
<div class="container row">
  <div class="search col-xs-12 col-sm-6 col-md-4">
    

    <form class="search-form" role="search" v-on:submit.prevent="onSubmit"> 
      <div class="input-group">
        <input v-model="searchPattern" 
              @focus="searchInputFocused = true"
              @blur="unfocusTimeout"
        type="text" class="form-control no-shadow" placeholder="Search Stories">

        <span class="input-group-btn">
            <button class="btn" tabindex="-1" type="button"><fa-icon :icon="[ 'fas', 'search' ]"/>
            </button>
        </span>
      </div>
    </form>


    <div class="search-results" v-if="showSearchResults">
      <div class="scroll-wrapper">
        <ul>
          <li v-for="n in matchedNodes" :key="n.id">
            <a href="#" @click='showDetails(n, true)' @mouseover='showDetails(n, false)'> {{n.data.label}} </a>
          </li>
        </ul>
      </div>
    </div>


  </div>


</div>


</template>



<script>
/*eslint no-console: ["error", { allow: [ "warn", "error"] }] */
import bus from '../lib/bus';

export default {
  name: 'SearchView',
  data() {
      return {
          searchPattern: '',
          searchInputFocused: false,
          lastInputHandle: 0,
          matchedNodes: [],
      };
  },

  computed:{
    showSearchResults(){
      return this.$parent.graph && (this.searchInputFocused) && 
             this.searchPattern && (this.searchPattern.length > 3);
    }
  },
  watch:
  {
    searchPattern: function (newPattern, oldVal){  /* eslint-disable-line no-unused-vars */

      if (! this.showSearchResults)
        return; // probably we are still loading...

      // we are throttling input here. No need to react to every keystroke:
      if (this.lastInputHandle) {
        clearTimeout(this.lastInputHandle);
        this.lastInputHandle = 0;
      }

      var self = this
      this.lastInputHandle = setTimeout(function() {
        self.matchedNodes = getAllMatches(self.$parent.graph, newPattern);
        // showMatches(allMatches, header);
        self.lastInputHandle = 0;
      }, 150);

    }
  },

  methods:
  {
    unfocusTimeout()
    {
      var self = this;
      setTimeout(function() {self.searchInputFocused = false}, 150);
    },

    onSubmit()
    {
        return null
    },

    showDetails(node, click)
    {
        bus.fire(click ? 'emulate-node-click' : 'emulate-node-hover', node);
    }
  },
}

function getAllMatches(graph, pattern) {
  var allMatches = [];
  var matcher = compileMatcher(pattern);
  graph.forEachNode(function(node) {
    if (matcher.isMatch(node.data) && allMatches.length < 10) 
      allMatches.push(node);
  });

  return allMatches;
}

function compileMatcher(pattern) {
  var rMatch = compileRegex(pattern);
  return {
    isMatch: function(data) {
      // a simple name based match. Could be extended to complex filters
      return rMatch && data && 
              ( (data.label   && data.label.match(rMatch)) ||
                (data.Excerpt && data.Excerpt.match(rMatch)) ||
                (data.SetInCountry && data.SetInCountry.match(rMatch)) ||
                (data.AuthorCountry && data.AuthorCountry.match(rMatch)) ||
                (data.AuthorName && data.AuthorName.match(rMatch))
              ) ;
    }
  }
}

function compileRegex(pattern) {
  try {
    return new RegExp(pattern, 'ig');
  } catch (e) {
    // this cannot be compiled. Ignore it.
  }
}




</script>

<style>
.search {
  position: absolute;
  top: 2vh;
  right: 3vw;
  width: 25vw;
}
.search .search-results {
  padding-top: 5px;
  background: rgba(255, 255, 255, 0.8);
  width: 25vw;
  max-width: 25vw;
  max-height: 30vh;
}

.search .scroll-wrapper {
  border-top: 1px solid #808080;
  height: 250px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0,0,0,.2), 0 -1px 0 rgba(0,0,0,.02);
  max-height: 96vh;
  max-width: 25vw;
  overflow-y: auto;
}

.scroll-wrapper ul {
  overflow-y: scroll;
  text-overflow: ellipsis;
  width: 100%;
  height: 100%;
  list-style: none;
  margin: 0;
  box-sizing: content-box;
  padding-top: 0px;
  padding-right: 20px;
  padding-bottom: 0;
  padding-left: 0;
}

.scroll-wrapper ul li {
  height: 25px;
  max-width: 100%;
  text-overflow: ellipsis;
}
.scroll-wrapper ul li a {
  opacity: 0.9;
  text-decoration: none;
  width: 100%;
  height: 100%;
  /*display: block;*/
  margin: 0;
  padding: 0;
  padding-left: 20px;
  line-height: 25px;
  white-space: nowrap;
  &:hover,
  &:focus{
    text-decoration:none;
    opacity: 1;
    background:rgba(26, 26, 26, 0.95);
  }
}

.search-form input {
    width: 23vw;
    background: rgba(26, 26, 26, 0.5);
    color: white;
    border-radius: 0;
    border: 0;
    line-height: 25px;
    font-size:14;
  };
.search-form .input-group {
  display: inline-flex;
  border: 1px solid #808080;
  &:hover,
  &.focused {
    border-color: white;
    button.btn {
      background: #66afe9;
    }
  }
};
.input-group .btn {
  color: white;
  border-radius: 0;
  /*background: #808080;*/
  height: 25px;
}




</style>