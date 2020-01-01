import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import locale from "view-design/dist/locale/ar-SA";
import 'material-icons/iconfont/material-icons.css';
import axios from 'axios'
import VueAxios from 'vue-axios'


Vue.use(ViewUI, {locale});
Vue.use(VueAxios, axios)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
