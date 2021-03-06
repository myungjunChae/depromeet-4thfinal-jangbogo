// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { store } from './store/store'
import App from './App'
import router from './router'
import axios from 'axios'
import VueSocketIO from 'vue-socket.io';

Vue.prototype.$axios = axios
Vue.config.productionTip = false

Vue.use(VueSocketIO, '52.78.159.170', store);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  // render: h => h(App),
  components: { App },
  template: '<App/>'
})
