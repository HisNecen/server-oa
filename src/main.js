// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

//import element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//import axios
import axios from 'axios';

//import echarts
import echarts from 'echarts';
Vue.use(echarts);
Vue.use(ElementUI);


Vue.config.productionTip = false

Vue.prototype.$echarts = echarts;
Vue.prototype.axios = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
