//简报中心
import Vue from 'vue';
import Router from 'vue-router';

import Login from "@/components/login/Login"

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: resolve => require(['@/components/Home/Home'], resolve)
    },
    {
      path: '/Home/:userName',
      name: 'home',
      component: resolve => require(['@/components/Home/Home'], resolve)
    },
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: resolve => require(['@/components/login/Login'], resolve)
    // },
    {
      path: '/login',
      name: 'login',
      component:Login
    },
    // 舆情头条页面
    {
      path: '/intelligencetopnews/:userName',
      name: 'intelligencetopnews',
      component: resolve => require(['@/components/intelligenceTopNews/IntelligenceTopNews'], resolve)
    },
    // 消息中心
    {
      path: '/messagecenter',
      name: 'messagecenter',
      component: resolve => require(['@/components/messageCenter/MessageCenter'], resolve)
    },
    // 列表页面
    {
      path: '/monitorresults',
      name: 'monitorresultsList',
      component: resolve => require(['@/components/monitorResults/MonitorResults'], resolve)
    },
    // 监测中心--监测列表
    {
      path: '/center/:userName',
      name: 'center',
      redirect: '/center/config/:userName',
      component: resolve => require(['@/components/monitorCenter/MonitorCenter'], resolve),
      children:[
        // 监测中心--监测列表页面
        {
          path: '/center/monitorcenter/:type/:userName',
          name: 'monitorcenter',
          component: resolve => require(['@/components/monitorCenter/MonitorCenter'], resolve)
        },
      ]
    },
    // 监测中心-二级页面
    {
      path: '/center/:userName',
      name: 'center',
      redirect: '/center/monitorresults/:userName',
      component: resolve => require(['@/components/monitorCenter/MonitorView'], resolve),
      children: [
        // 监测中心--方案配置页面
        {
          path: '/center/config/:id/:userName',
          name: 'config',
          component: resolve => require(['@/components/config/Config'], resolve)
        },
        // 监测中心--方案配置修改页面
        {
          path: '/center/config/:id/:userName',
          name: 'config',
          component: resolve => require(['@/components/config/Config'], resolve)
        },
        // 监测中心-舆情分析页面
        {
          path: '/center/monitoranalysis/:id/:userName',
          name: 'monitoranalysis',
          component: resolve => require(['@/components/monitorAnalysis/MonitorAnalysis'], resolve)
        },
        // 监测中心-事件监测页面
        {
          path: '/center/monitoranalysis/:id/:userName',
          name: 'monitoranalysis',
          component: resolve => require(['@/components/monitorAnalysis/MonitorAnalysis'], resolve)
        },
        // 监测中心-监测结果页面
        {
          path: '/center/monitorresults/:id/:userName',
          name: 'monitorresults',
          component: resolve => require(['@/components/monitorResults/MonitorResultsContent'], resolve)
        },
        // 监测中心-预警列表页面
        {
          path: '/center/warninglist/:userName',
          name: 'warninglist',
          component: resolve => require(['@/components/warningList/WarningList'], resolve)
        },
        // 监测中心-预警列表页面
        {
          path: '/center/warninglist/:id/:userName',
          name: 'warninglist',
          component: resolve => require(['@/components/warningList/WarningList'], resolve)
        },
      ]
    },

    // 事件监测的结果展示页面。
    {
      path: '/event/:userName',
      name: 'event',
      redirect: '/event/monitorresults/:userName',
      component: resolve => require(['@/components/eventCenter/EventView'], resolve),
      children: [
        // 监测中心(事件)-监测分析页面
        {
          path: '/event/eventanalysis/:id/:userName',
          name: 'eventanalysis',
          // component: resolve => require(['@/components/monitorAnalysis/MonitorAnalysis'], resolve)
          component: resolve => require(['@/components/eventCenter/EventAnalysis'], resolve)
        },
        // 监测中心(事件)-监测结果页面
        {
          path: '/event/monitorresults/:id/:userName',
          name: 'monitorresults',
          component: resolve => require(['@/components/monitorResults/MonitorResultsContent'], resolve)
        },
        // 监测中心(事件)-预警列表页面
        {
          path: '/event/warninglist/:id/:userName',
          name: 'warninglist',
          component: resolve => require(['@/components/warningList/WarningList'], resolve)
        },
        // 监测中心(事件)-配置修改页面
        {
          path: '/event/config/:id/:userName',
          name: 'config',
          component: resolve => require(['@/components/config/Config'], resolve)
        },
      ]
    },
    //用户中心查看页
    {
      path: '/userview/:userName',
      name: 'userview',
      component: resolve => require(['@/components/user/UserView'], resolve)
    },
    //
    {
      path: '/search/:userName',
      name: 'search',
      component: resolve => require(['@/components/search/search'], resolve)
    },
    //用户中心编辑页
    {
      path: '/useredit/:userName',
      name: 'useredit',
      component: resolve => require(['@/components/user/UserEdit'], resolve)  //简报中心
    },
    //简报中心
    {
      path: '/bulletincenter/:userName',
      name: 'bulletincenter',
      component: resolve => require(['@/components/bulletinCenter/BulletinCenter'], resolve)  //简报中心
    },
    //文章通用列表
    {
      path: '/publicsentiment',
      name: 'publicsentiment',
      component: resolve => require(['@/components/publicsentiment/PublicSentiment'], resolve)  //简报中心
    },
    //文章详情
    {
      path: '/details/:userName',
      name: 'details',
      component: resolve => require(['@/components/details/ArticleDetails'], resolve)  //文章详情
    },
    /****************************下载报告***********************/
    {
      path:'/downloadReport/:userName',
      name: 'downloadreport',
      component: resolve => require(['@/components/downloadReport/downloadReport'], resolve)
    },
    {
      path:'/eventReport/:userName',
      name:'eventReport',
      component: resolve => require(['@/components/downloadReport/eventReport'], resolve)
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
      component: resolve => require(['@/components/test/UserConfigureDemo'], resolve),
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
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

