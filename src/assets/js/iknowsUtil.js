/*
* iknowsUtil为工具类对外暴露的工具名称
*/
import Tween from './Tween.js'; //返回顶部所需依赖
var iknowsUtil = {
  // 去除首尾两端的空格
  trim: function (str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
  },
  // 去除所有的空格
  trimAll: function (str) {
    return str.replace(/\s+/g, '');
  },
  /*
  * 参数：dateTime: 如：1534321129000
  * 返回格式: yyyy-mm-dd hh:mm:ss 如: 2018-09-10 12:25:40
  */
  dataFormat: function (dateTime) {
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (minutes.length == 1) {
      minutes = "0" + minutes
    }
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes
  },
  // 对Date的扩展，将 Date 转化为指定格式的String
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  format: function (fmt) { //author: meizz
    let o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },

  // 处理传入的数据：如果数据大于1万则处理为xxx万
  handleNum: function (num) {
    var str = 0
    if (num > 10000) {
      str = (num / 10000).toFixed(2)
      while (str.substr(str.length - 1, str.length) == "0") {
        str = str.substr(0, str.length - 1)
      }
      if (str.substr(str.length - 1, str.length) == ".") {
        str = str.substr(0, str.length - 1)
      }
      str = str + "万"
    } else {
      str = num
    }
    return str
  },
  setCookie:function(name, deadTime, value){//设置cookie

    let currentTime = new Date();
    let endTime = new Date(currentTime.getTime() + deadTime * 24 * 3600 * 1000);
    document.cookie = name + "=" + JSON.stringify(value) +";expires=" + endTime.toGMTString();
  },
  
  getCookie:function(key){//获取cookie

    if( document.cookie ){//如果cookie存在就获取
      var str = document.cookie;
      var arr = str.split("; ");
      for(var i = 0 ; i < arr.length ; i++){
        var item = arr[i].split("=");
        if( item[0] == key){
          return JSON.parse( item[1] );//将结果转成对象返回
        }
      }
      return {};// 如果cookie存在，但是不存在key的值  
    }
    return {};//如果cookie不存在  返回一个空对象
  },
  //返回顶部
  backTop: function(initObj, targetObj, time, callback){
      let _frame = null;
      function animate(_time) {
        _frame = requestAnimationFrame(animate);
        Tween.update(_time)
      }
      _frame = requestAnimationFrame(animate);
      let tween = new Tween.Tween(initObj)
        .to(targetObj, time)
        .easing(Tween.Easing.Cubic.Out)
        .onUpdate(function() {
          callback(initObj, _frame);
        })
        .start()
    }

};
export default iknowsUtil;
