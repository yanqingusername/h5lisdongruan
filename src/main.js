import Vue from 'vue'
import App from './App.vue'
// 导入vant
import Vant,{ Locale } from 'vant'
// 引入组件库
import VueEasytable from "vue-easytable";
import zhCN from 'vant/es/locale/lang/zh-CN';
// 导入路由
import router from './router/index'
// 导入vuex
import store from './store/index'
// 移动端适配
import 'lib-flexible'

import moment from 'moment'
import _ from 'lodash'
// 全局样式
import 'vant/lib/index.css';
import "vue-easytable/libs/theme-default/index.css";
import './assets/style/variable.scss'
import './assets/iconfont/iconfont.css'
import './assets/style/index.scss'
import VConsole from 'vconsole'
import { PullRefresh } from 'vant';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


import {VueJsonp} from 'vue-jsonp'
Vue.use(VueJsonp)

Vue.use(ElementUI);



Vue.prototype.$vconsole = VConsole;

Vue.config.productionTip = false

Vue.prototype.$moment = moment
Vue.prototype.$lodash = _

Vue.use(Vant)
Locale.use('zh-CN', zhCN)

Vue.use(VueEasytable);
Vue.use(PullRefresh);

/* 路由发生变化修改页面title */
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
