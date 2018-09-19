//简报中心
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: resolve => require(['@/components/home/Home'], resolve)
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/components/login/Login'], resolve)
    },
    // 舆情头条页面
    {
      path: '/intelligencetopnews',
      name: 'intelligencetopnews',
      component: resolve => require(['@/components/intelligenceTopNews/intelligenceTopNews'], resolve)
    },
    // 消息中心
    {
      path: '/messagecenter',
      name: 'messagecenter',
      component: resolve => require(['@/components/messageCenter/MessageCenter'], resolve)
    },
    // 监测配置页面
    {
      path: '/monitorconfig',
      name: 'monitorconfig',
      component: resolve => require(['@/components/config/MonitorConfig'], resolve)
    },

    // 监测中心
    {
      path: '/monitorcenter',
      name: 'monitorcenter',
      component: resolve => require(['@/components/monitorCenter/MonitorCenter'], resolve)
    },
    // 监测中心-监测结果页面
    {
      path: '/monitorresults',
      name: 'monitorresults',
      component: resolve => require(['@/components/monitorResults/MonitorResults'], resolve)
    },
    // 监测中心-预警列表页面
    {
      path: '/warninglist',
      name: 'warninglist',
      component: resolve => require(['@/components/warningList/WarningList'], resolve)
    },
    //用户中心查看页
    {
      path: '/userview',
      name: 'userview',
      component: resolve => require(['@/components/user/UserView'], resolve)
    },
    //用户中心编辑页
    {
      path: '/useredit',
      name: 'useredit',
      component: resolve => require(['@/components/user/UserEdit'], resolve)  //简报中心

    },
    //简报中心
    {
      path: '/bulletincenter',
      name: 'bulletincenter',
      component: resolve => require(['@/components/bulletincenter/BulletinCenter'], resolve)  //简报中心

    },
    //文章通用列表
    {
      path: '/publicsentiment',
      name: 'publicsentiment',
      component: resolve => require(['@/components/publicsentiment/PublicSentiment'], resolve)  //简报中心

    },
    //文章详情
    {
      path: '/details',
      name: 'details',
      component: resolve => require(['@/components/details/ArticleDetails'], resolve)  //文章详情

    },
    /****************************组件demo页面***********************/
    // 定比例布局展示示例
    {
      path: '/layout',
      name: 'layout',
      component: resolve => require(['@/components/test/LayOut'], resolve)
    },
    // 折线图demo
    {
      path: '/linedemo',
      name: 'linedemo',
      component: resolve => require(['@/components/test/ZCChartsLineDemo'], resolve)
    },
    // 柱状图demo
    {
      path: '/bardemo',
      name: 'bardemo',
      component: resolve => require(['@/components/test/ZCChartsBarDemo'], resolve)
    },
    // 饼状图demo
    {
      path: '/piedemo',
      name: 'piedemo',
      component: resolve => require(['@/components/test/ZCChartsPieDemo'], resolve)
    },
    // 地图demo
    {
      path: '/mapdemo',
      name: 'mapdemo',
      component: resolve => require(['@/components/test/ZCChartsMapDemo'], resolve)
    },
    // 列表页demo
    {
      path: '/tabledemo',
      name: 'tabledemo',
      component: resolve => require(['@/components/test/ZCTableDemo'], resolve)
    },
    // 列表页demo
    {
      path: '/worlddemo',
      name: 'worlddemo',
      component: resolve => require(['@/components/test/ZCChartsWorldDemo'], resolve)
    },
    {
      path: '/test',
      name: 'test',
      component: resolve => require(['@/components/test/test2'], resolve),
      children: [  //这里就是二级路由的配置
        {
          path: '/test/A',
          name: 'A',
          component: resolve => require(['@/components/test/testA'], resolve),
        },
        {
          path: '/test/B',
          name: 'B',
          component: resolve => require(['@/components/test/testB'], resolve),
        },
        {
          path: '/test/C',
          name: 'C',
          component: resolve => require(['@/components/test/testC'], resolve),
        }
      ]
    },
    /****************************404页面***********************/
    {
      path: '/*',
      name: 'notfind',
      component: resolve => require(['@/components/error/404'], resolve)
    }
  ],

})
