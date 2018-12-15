import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
require ('babel-polyfill')

// vue对象挂载的属性或方法(慎用)
import base from './assets/js/base'
// 工具类(修改之前请务必通知其它人员，防止多人同步修改产生冲突)
import iknowsUtil from './assets/js/iknowsUtil.js';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/common/reset.css'
import './assets/css/common/common.css'
import './assets/css/common/fontSize.css'
import { logout} from "./assets/js/api.js"; 

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(base);
Vue.prototype.$iknowsUtil = iknowsUtil
// 超时时间
// axios.defaults.timeout = 5000
// 携带cookie
// axios.defaults.withCredentials = true;

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Content-Type'] = 'application/json';
// http请求拦截器
axios.interceptors.request.use(config => {
  let pathName = window.location.pathname;  
  let userName = document.getElementById('app').getAttribute('userName') || '';  
  if(pathName.indexOf('login') == -1 && userName == ''){    
    let list = pathName.split('/') || [];    
    if(list && list.length > 0){      
      userName = list[list.length-1] || '';    
    }  
  }
  let token = localStorage.getItem('iKnows'+userName+'Token');
  let iemi = localStorage.iKnowsIemi;
  let uname = localStorage.iKnowsUname;
  if (token) {
    config.headers.token = token;
  }
  if (iemi) {
    config.headers.iemi = iemi;
  }
  if (uname) {
    config.headers.uname = uname;
  }
  return config
}, error => {
  return error;
});


// 统一进行返回拦截
axios.interceptors.response.use(response => {
  let data = response.data;
  let code = data.code;
  // 状态为101,103时统一跳转至登陆页面
  if (code == 103 || code == 101) {
    //清除之前点击记录(包括侧边栏点击记录,时间选择记录)
    let userName = document.getElementById('app').getAttribute('userName') || '';    
    let pathName = window.location.pathname;    
    if(pathName.indexOf('login') == -1 && userName == ''){      
      let list = pathName.split('/') || [];      
      if(list && list.length > 0){        
        userName = list[list.length-1] || '';      
      }    
    }    
    delete localStorage['iKnows'+userName+'Token'];    
    delete localStorage['iKnows'+userName+'Config'];  
    delete localStorage['iKnows'+userName];  
    document.getElementById('app').setAttribute('userName', '');
    router.replace({
      path: '/login'
    });
  } else {
    return response;
  }
  return response;
}, error => {
  return error;
})

router.beforeEach((to, from, next) => {
  let pathName = window.location.pathname;  
  let userName = '';  //console.log(to,from)
  if(pathName.indexOf('login') == -1){    
    let list = pathName.split('/') || [];    
    if(list && list.length > 0){      
      userName = list[list.length-1] || '';    
    }  
  }  
  let token = localStorage.getItem('iKnows'+userName+'Token');
  if ( (token == '' || token == 'undefined') && to.path != '/login') {
    logout()
    // next({
    //   path: '/login',
    // })
  } else {
    next();
  }
});



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
