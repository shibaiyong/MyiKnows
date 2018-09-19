import axios from 'axios';

// 开发环境
let baseUrl = 'http://10.50.1.191:8088';
// 测试环境
// let　baseUrl = '';


export const getDemoList = params => {
  return axios.post(`${baseUrl}/homeList.json`, params).then(res => res.data)
}

