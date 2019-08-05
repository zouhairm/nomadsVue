import Vue from 'vue'
import App from './App.vue'


import VueAnalytics from 'vue-analytics'
Vue.use(VueAnalytics, {
  id: 'UA-144701829-1',
  autoTracking: {screenview: true},
  debug: { sendHitTask: process.env.NODE_ENV === 'production'}
})

//1st, configure font-awesome
import { library } from '@fortawesome/fontawesome-svg-core' //get library and add icons of interest
import { fas } from '@fortawesome/free-solid-svg-icons'; //we want the free icons
library.add(fas); //add the free icons

//2nd, get the vue <-> font awesome component and register it with the app
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
Vue.component('fa-icon', FontAwesomeIcon)
Vue.config.productionTip = false


new Vue({
  render: h => h(App),
}).$mount('#app')
