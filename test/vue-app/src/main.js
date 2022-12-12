import Vue from 'vue'
import App from './App.vue'

import "../../../dist/design-system.es";

Vue.config.productionTip = false
Vue.config.ignoredElements = [
  /^ao-/  // Use a `RegExp` to ignore all elements that start with "ao-" 2.5+ only
];

new Vue({
  render: h => h(App),
}).$mount('#app')
