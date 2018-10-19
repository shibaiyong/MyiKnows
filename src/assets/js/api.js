import axios from 'axios';
import Vue from 'vue'

// 开发环境
// let baseUrl = 'http://10.50.2.26:8080/iknows';
// 原始环境
// let baseUrl = 'http://114.115.148.225:8080/iknows';
// 正式环境
let baseUrl = 'http://49.4.90.208:8095/iknows';

export const getDemoList = params => {
  return axios.get(`${baseUrl}/headline/list`, params).then(res => res.data)
}
export const eventBus = new Vue;
//登录
export const login = params => {
  return axios.post(`${baseUrl}/user/login`, params).then(res => res.data)
}
//登出
export const logout = params => {
  return axios.get(`${baseUrl}/user/logout`).then(res => res.data)
}
//获取数据总量
export const getTotalData = params => {
  return axios.get(`${baseUrl}/statistics`).then(res => res.data)
}
//消息中心列表
export const messagePageList = params => {
  return axios.get(`${baseUrl}/message/list`, params).then(res => res.data)
}
//最新消息列表
export const getLastMessage = params => {
  return axios.get(`${baseUrl}/message/latest`).then(res => res.data)
}
//标记消息已读
export const messageRead = params => {
  return axios.post(`${baseUrl}/message/read`, params).then(res => res.data)
}
//消息删除
export const messageDelete = params => {
  return axios.post(`${baseUrl}/message/delete`, params).then(res => res.data)
}
/**************************************方案配置********************************************/
//配置方案类型
export const planType = id => {
  return axios.get(`${baseUrl}/plan/type/${id}`).then(res => res.data)
}
//模糊方案组合推荐
export const recommendGroup = params => {
  return axios.get(`${baseUrl}/keyword/recommendGroup`, {params: params}).then(res => res.data)
}
//地域查询
export const regionQuery = params => {
  return axios.get(`${baseUrl}/region/partten`, { params: params}).then(res => res.data)
}
//保存配置方案
export const planSave = params => {
  return axios.post(`${baseUrl}/plan/save`, params).then(res => res.data)
}
//展示配置方案
export const planShow = id => {
  return axios.get(`${baseUrl}/plan/${id}`).then(res => res.data)
}
//更新配置方案
export const planUpdate = params => {
  return axios.post(`${baseUrl}/plan/update`, params).then(res => res.data)
}
//预警模型查询
export const modelShow = params => {
  return axios.post(`${baseUrl}/warnWord/model`, params).then(res => res.data)
}
//监测人物历史查询
export const recommendUsers = params => {
  return axios.get(`${baseUrl}/keyword/recommendUsers`, {params: params}).then(res => res.data)
}
//监测文稿查询
export const articleGather= params => {
  return axios.get(`${baseUrl}/plan/article/gather`, {params: params}).then(res => res.data)
}
//文稿相似度对比
export const articleSimilar = params => {
  return axios.post(`${baseUrl}/plan/article/similar`, params).then(res => res.data)
}
/**************************************舆情头条********************************************/
//舆情头条
export const getIntelligentTopNews = params => {
  return axios.get(`${baseUrl}/headline/list`, {params: params}).then(res => res.data)
}
/**************************************首页********************************************/
//首页监测统计
export const getHomeCount = params => {
  return axios.get(`${baseUrl}/portal/countByCarrier`, params).then(res => res.data)
}
//首页预警趋势
export const getRecentTrends = params => {
  return axios.get(`${baseUrl}/portal/countByWarn`, params).then(res => res.data)
}
//首页热点舆情
export const getHotIntelligence = params => {
  return axios.get(`${baseUrl}/portal/listTop`, params).then(res => res.data)
}
/**************************************监测结果列表********************************************/

//监测结果列表
export const getMonitorResults = params => {
  return axios.post(`${baseUrl}/monitor/list`, params).then(res => res.data)
}
export const getMonitorType = params => {
  return axios.get(`${baseUrl}/monitor/listPlanType`,{params: params}).then(res => res.data)
}
/**************************************预警列表********************************************/
//预警列表--预警列表接口
export const getWarnList = params => {
  return axios.get(`${baseUrl}/warn/list`, {params:params}).then(res => res.data)
}
//预警列表-预警分类占比接口
export const getWarnLevel = params => {
  return axios.get(`${baseUrl}/warn/statisticLevel`, {params:params}).then(res => res.data)
}
//预警列表-预警变化趋势接口
export const getWarnChange = params => {
  return axios.get(`${baseUrl}/warn/statisticCarrier`, {params:params}).then(res => res.data)
}
//预警列表-预警列表已读接口
export const warnListRead = params => {
  return axios.get(`${baseUrl}/warn/read`, {params:params}).then(res => res.data)
}
/**************************************舆情分析********************************************/
//2.7.1	媒体分组汇总趋势图
export const getMonitorAnalysis_mediaTrend = params => {
  return axios.post(`${baseUrl}/monitor/analysis/qryMediaTrend`, params).then(res => res.data)
};
//2.7.2	最新舆情表格
export const getMonitorAnalysis_lastArticle = params => {
  return axios.post(`${baseUrl}/monitor/analysis/qryLastArticle`, params).then(res => res.data)
};
//2.7.3	预警分析柱状图
export const getMonitorAnalysis_warningAnalysis = params => {
  return axios.post(`${baseUrl}/monitor/analysis/qryWarningAnalysis`, params).then(res => res.data)
};
//2.7.4	媒体分布饼图
export const getMonitorAnalysis_mediaDistribution = params => {
  return axios.post(`${baseUrl}/monitor/analysis/qryMediaDistribution`, params).then(res => res.data)
};
//2.7.5	发布热区地图
export const getMonitorAnalysis_hotRegion = params => {
  return axios.post(`${baseUrl}/monitor/analysis/qryHotRegion`, params).then(res => res.data)
};
//2.7.6	来源排行柱状图
export const getMonitorAnalysis_sourceRank = params => {
  return axios.post(`${baseUrl}/monitor/analysis/qrySiteRank`, params).then(res => res.data)
};
//2.7.7	情感指数折线图
export const getMonitorAnalysis_emotionTrend = params => {
  return axios.post(`${baseUrl}/monitor/analysis/qryEmotionIndex`, params).then(res => res.data)
};
//2.7.8	词云分布
export const getMonitorAnalysis_wordCloud = params => {
  return axios.post(`${baseUrl}/monitor/analysis/qryWordCloud`, params).then(res => res.data)
};

/**************************************用户中心********************************************/
//用户中心获取个人信息/plan/save
export const getUserInfo = params => {
  return axios.get(`${baseUrl}/user/info`).then(res => res.data)
}
//用户中心修改个人信息
export const modifyUserInfo = params => {
  return axios.post(`${baseUrl}/user/update`, params).then(res => res.data)
}
//获取监测方案列表
export const getPlanList = params => {
  return axios.post(`${baseUrl}/monitor/pagePlan`, params).then(res => res.data)
}
//停止监测方案
export const stopPlan = params => {
  return axios.get(`${baseUrl}/monitor/stopPlan`, params).then(res => res.data)
}
//简报中心列表
export const getBulletinList = params => {
  return axios.post(`${baseUrl}/report/index`, params ).then(res => res.data)
}
//简报中心删除
export const deleteBulletinList = params => {
  return axios.post(`${baseUrl}/report/delete`, params ).then(res => res.data)
}
//简报中心批量删除
export const deleteAllBulletinList = params => {
  return axios.post(`${baseUrl}/report/delete`, params).then(res => res.data)
}
//简报中心查看
export const viewBulletinList = params => {
  return axios.post(`${baseUrl}/report/view`, params ).then(res => res.data)

}
//文章详情
export const detail = params => {
  return axios.get(`${baseUrl}/monitor/detail`, params).then(res => res.data)
}
