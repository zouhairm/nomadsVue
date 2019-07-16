<template>
<div class="container row">
  <div class="search col-xs-12 col-sm-6 col-md-4">
    

    <form class="search-form" role="search" v-on:submit.prevent="onSubmit"> 
      <div class="input-group">
        <input v-model="searchPattern" type="text" class="form-control no-shadow" placeholder="Search Stories">

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
          showSearchResults: false,
          lastInputHandle: 0,
          matchedNodes: [],
          graph: null
      };
  },

  mounted(){
    bus.on('load-graph', g => this.graph = g);
  },

  watch:
  {
    searchPattern: function (newPattern, oldVal){  /* eslint-disable-line no-unused-vars */
      this.showSearchResults = this.graph && newPattern && (newPattern.length > 3);

      if (! this.showSearchResults) 
        return; // probably we are still loading...

      // we are throttling input here. No need to react to every keystroke:
      if (this.lastInputHandle) {
        clearTimeout(this.lastInputHandle);
        this.lastInputHandle = 0;
      }

      var self = this
      this.lastInputHandle = setTimeout(function() {
        self.showSearchResults = newPattern;
        self.matchedNodes = getAllMatches(self.graph, newPattern);
        // showMatches(allMatches, header);
        self.lastInputHandle = 0;
      }, 150);

    }
  },

  methods:
  {
    onSubmit()
    {
        return null
    },

    showDetails(node, click)
    {
        bus.fire(click ? 'node-clicked' : 'node-hovered', this.graph, node);
    }
  },
}

function getAllMatches(graph, pattern) {
  var allMatches = [];
  var matcher = compileMatcher(pattern);
  console.warn('seeking new entries! ' + pattern)
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





// function searchController($scope) {
//   // when graph model is done loading we will have graph instance set via
//   // `allPackagesGraph` variable from scope
//   var graph;

//   // we will throttle user input to increase responsiveness
//   var lastInputHandle;

//   // since search is not started => no matches
//   $scope.matchedPackages = [];

//   // we are not searching anything at the moment, hide search results:
//   $scope.showSearchResults = false;

//   // on mobile devices we don't want to always show list of packages
//   $scope.showListOfPackages = true;

//   // let parent scope transfer focus to the scene
//   $scope.formSubmitted = function(e) {
//     appEvents.fire('focusScene');
//     if ($scope.selectedPackage && $scope.selectedPackage[0] === ':') {
//       // command mode starts with colon and has a form of
//       // <command> <value>
//       var commandInput = $scope.selectedPackage;
//       var commandMatch = commandInput.match(/^:([^\s]+)(.+)?$/);
//       if (commandMatch) handleCommand(commandMatch[1], commandMatch[2], commandInput);
//     }
//   };

//   $scope.showDetails = function(packageName) {
//     appEvents.fire('focusOnPackage', packageName);
//     appEvents.fire('focusScene');
//     if (screen.isSmall()) {
//       $scope.showListOfPackages = false;
//     }
//   };

//   appEvents.on('showDependencyGraph', showDependencyGraph);

//   // `allPackagesGraph` will be available only after we are done downloading
//   // graph data. Need to monitor this event before search can become enabled
//   $scope.$watch('allPackagesGraph', function(newValue, oldValue) {
//     if (!newValue) return;

//     graph = newValue;
//   });

//   // this is used for pagenating results when user scrolls.
//   $scope.loadMore = function noop() {};

//   // tell parents that search pattern is changed, update search results
//   $scope.searchPatternChanged = searchPatternChanged;

//   function handleCommand(command, args, commandInput) {
//     // todo: simplify this
//     if (command.match(/^d.*ts$/i) && args) { // Assume 'dependents'
//       appEvents.fire('subgraphRequested', args.replace(/^\s+|\s+$/g, ''), 'dependents');
//     } else if (command.match(/^d.*es$/i) && args) { // assume 'dependencies'
//       appEvents.fire('subgraphRequested', args.replace(/^\s+|\s+$/g, ''), 'dependencies');
//     } else if (command.match(/^a(ll)?d.*ts$/i) && args) { // Assume 'alldependents'
//       appEvents.fire('subgraphRequested', args.replace(/^\s+|\s+$/g, ''), 'alldependents');
//     } else if (command.match(/^a(ll)?d.*es$/i) && args) { // assume 'alldependencies'
//       appEvents.fire('subgraphRequested', args.replace(/^\s+|\s+$/g, ''), 'alldependencies');
//     } else if (commandInput.match(/i love npm/i)) {
//       // todo: this should be based on some sort of plugins
//       appEvents.fire('jiggle');
//     } else {
//       // TODO: Implement more commands. This is supposed to be command mode, where users
//       // can enter complex filters.
//       // Ideas: `:help`, `:about`
//       console.log('This cool idea is not implemented yet');
//     }
//   }

//   function searchPatternChanged(searchPattern) {
//     $scope.showSearchResults = graph && searchPattern;
//     if (!graph) return; // probably we are still loading...

//     // we are throttling input here. No need to react to every keystroke:
//     if (lastInputHandle) {
//       clearTimeout(lastInputHandle);
//       lastInputHandle = 0;
//     }

//     if (searchPattern && searchPattern[0] === ':') {
//       $scope.showSearchResults = false; // this should be handled elsewhere
//       // this is command mode. It should be handled only when form is submitted
//       return;
//     }

//     lastInputHandle = setTimeout(function() {
//       appEvents.fire('search', searchPattern);

//       $scope.showSearchResults = searchPattern;
//       var allMatches = getAllMatches(graph, searchPattern);
//       var header = createSearchResultsHeader(allMatches.length);
//       showMatches(allMatches, header);
//       lastInputHandle = 0;
//       if (!$scope.$$phase) $scope.$digest();
//     }, 150);
//   }

//   function showDependencyGraph(e) {
//     $scope.showSearchResults = true;
//     if (screen.isSmall()) {
//       $scope.showListOfPackages = false;
//     }
//     if (e.type === 'dependents') {
//       $scope.selectedPackage = ':dependents ' + e.name;
//     } else if (e.type === 'dependencies') {
//       $scope.selectedPackage = ':dependencies ' + e.name;
//     } else if (e.type === 'alldependents') {
//       $scope.selectedPackage = ':alldependents ' + e.name;
//     } else if (e.type === 'alldependencies') {
//       $scope.selectedPackage = ':alldependencies ' + e.name;
//     } else {
//       throw new Error('Unsupported subgraph type');
//     }

//     var allMatches = [];
//     var packageName = require('./simpleEscape')(e.name);
//     var header;
//     if (e.graph) {
//       e.graph.forEachNode(function(node) {
//         if (node.data.label !== e.name) allMatches.push(node.data.label);
//       });
//       if (e.type.match(/(all)?dependents/)) {
//         header = createDependentsResultHeader(allMatches.length, packageName);
//       } else if (e.type.match(/(all)?dependencies/)){
//         header = createDependenciesResultHeader(allMatches.length, packageName);
//       }
//     } else {
//       header = 'Could not find package ' + packageName;
//     }

//     showMatches(allMatches, header);
//   }

//   function showMatches(allMatches, header) {
//     // Gradually render allMatches to DOM (e.g. when user scrolls the list)
//     // but first, remove all items from array
//     $scope.matchedPackages.length = 0;

//     // let UI know how many packages we have
//     $scope.totalMatches = allMatches.length;
//     $scope.header = header;

//     // loadMore will ask next page of items
//     $scope.loadMore = pagify(allMatches, appendMatches).nextPage;

//     // load first page
//     $scope.loadMore();

//     function appendMatches(items) {
//       for (var i = 0; i < items.length; ++i) {
//         $scope.matchedPackages.push(items[i]);
//       }
//     }
//   }
// }

// // TODO: maybe this should be a separate module? It could be used by graphModel
// // too to filter the graph...
// function getAllMatches(graph, pattern) {
//   var allMatches = [];
//   var matcher = require('./matcher')(pattern);
//   graph.forEachNode(function(node) {
//     if (matcher.isMatch(node.data)) allMatches.push(node.data.label);
//   });

//   // TODO: could be a good idea to sort this
//   return allMatches;
// }

// function createDependentsResultHeader(foundCount, packageName) {
//   if (foundCount === 1) {
//     return "1 <small>package depends on </small> " + packageName;
//   } else if (foundCount === 0) {
//     return "<small>No packages depend on </small> " + packageName;
//   } else {
//     return "{{totalMatches|number}} <small>packages depend on </small> " + packageName;
//   }
// }

// function createDependenciesResultHeader(foundCount, packageName) {
//   if (foundCount === 1) {
//     return packageName + " <small>depends on </small> 1 <small>package</small>";
//   } else if (foundCount === 0) {
//     return packageName + "<small> does not have dependencies</small>";
//   } else {
//     return packageName + "<small> depends on</small> {{totalMatches|number}} <small>packages</small>";
//   }
// }

// function createSearchResultsHeader(foundCount) {
//   if (foundCount === 1) {
//     return "<small>Found</small> 1 <small>package</small>";
//   } else if (foundCount === 0) {
//     return "<small>No matches found</small>";
//   } else {
//     return "<small>Found</small> {{totalMatches|number}} <small>packages</small>";
//   }
// }

</script>

<style>
.search {
  position: absolute;
  top: 2vh;
  right: 3vw;
  .search-results {
    padding-top: 12px;
    background: rgba(0, 0, 0, 0.85);
    h4 {
      margin: 0 0 5px 0;
      padding: 0 0 5px 20px;
    }
  }

  .scroll-wrapper {
    border-top: 1px solid #808080;
    height: 250px;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0 2px 4px rgba(0,0,0,.2), 0 -1px 0 rgba(0,0,0,.02);

    max-height: 96vh;
    max-width: 20vw;
    overflow-y: auto;

  }

  ul {
    overflow-y: scroll;
    overflow-x: hidden;
    width: 100%;
    height: 100%;
    color: white;
    list-style: none;
    margin: 0;
    box-sizing: content-box;
    padding-top: 0px;
    padding-right: 20px;
    padding-bottom: 0;
    padding-left: 0;
    li {
      height: 25px;
      a {
        opacity: 0.5;
        color: white;
        text-decoration: none;
        width: 100%;
        height: 100%;
        display: block;
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
    }
  }
  .search-form {
    input {
      width: 100%;
      background: rgba(26, 26, 26, 0.5);
      color: white;
      border-radius: 0;
      border: 0
    }
    .input-group {
      display: inline-flex;
      border: 1px solid #808080;
      &:hover,
      &.focused {
        border-color: white;
        button.btn {
          background: #66afe9;
        }
      }
    }
    button.btn {
      color: white;
      border-radius: 0;
      background: #808080;
    }
  }
  h4 {
    color: white;
    .small {
      opacity: 0.5;
    }
  }
}


</style>