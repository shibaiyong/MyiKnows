import Vue from 'vue'
import App from './App'
import router from './router'
// vue对象挂载的属性或方法(慎用)
import base from './assets/js/base'
// 工具类(修改之前请务必通知其它人员，防止多人同步修改产生冲突)
import iknowsUtil from './assets/js/iknowsUtil.js';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common/reset.css'
import './assets/css/common/common.css'
import './assets/css/common/fontSize.css'

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(base);
Vue.prototype.$iknowsUtil = iknowsUtil;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
