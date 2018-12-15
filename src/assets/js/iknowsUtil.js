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
    var date = new Date(dateTime);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (minutes.length == 1) {
      minutes = "0" + minutes
    }
    return checkTime(year) + "-" + checkTime(month) + "-" + checkTime(day) + " " + checkTime(hours) + ":" + checkTime(minutes)
    // 补0
    function checkTime(time) {
      if (time < 10) {
        time = "0" + time;
      }
      return time;
    }
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
  setCookie: function (name, deadTime, value) {//设置cookie

    let currentTime = new Date();
    let endTime = new Date(currentTime.getTime() + deadTime * 24 * 3600 * 1000);
    document.cookie = name + "=" + JSON.stringify(value) + ";expires=" + endTime.toGMTString();
  },

  getCookie: function (key) {//获取cookie

    if (document.cookie) {//如果cookie存在就获取
      var str = document.cookie;
      var arr = str.split("; ");
      for (var i = 0; i < arr.length; i++) {
        var item = arr[i].split("=");
        if (item[0] == key) {
          return JSON.parse(item[1]);//将结果转成对象返回
        }
      }
      return {};// 如果cookie存在，但是不存在key的值
    }
    return {};//如果cookie不存在  返回一个空对象
  },

  deleteCookie: function (key) {
    var date = new Date();
    date.setTime(date.getTime() - 1);
    var delValue = this.getCookie(key);
    if (!!delValue) {
      document.cookie = key + '=' + delValue + ';expires=' + date.toGMTString();
    }
  },
  //返回顶部
  backTop: function (initObj, targetObj, time, callback) {
    let _frame = null;
    function animate(_time) {
      _frame = requestAnimationFrame(animate);
      Tween.update(_time)
    }
    _frame = requestAnimationFrame(animate);
    let tween = new Tween.Tween(initObj)
      .to(targetObj, time)
      .easing(Tween.Easing.Cubic.Out)
      .onUpdate(function () {
        callback(initObj, _frame);
      })
      .start()
  },
  //数字千分位格式化
  toThousands: function (num) {

    if (num == null || num == undefined) return "";
    var flag = false;
    var indexDot = num.toString().indexOf('.');
    var dot;
    if (indexDot > 0) {
      dot = num.toString().substring(indexDot);
      num = num.toString().substring(0, indexDot);
    }
    var result = '', counter = 0;
    var reg = /^\-/;
    var reg1 = /\(/g;
    num = (num || 0).toString();
    if (reg1.test(num)) {
      num = num.replace(reg1, '');
      flag = true;
    } else {
      flag = false;
    }
    var num1 = num;
    num = num.replace(reg, '');
    for (var i = num.length - 1; i >= 0; i--) {
      counter++;
      result = num.charAt(i) + result;
      if (!(counter % 3) && i != 0) {
        result = ',' + result;
      }
    }
    if (num1 < 0) {
      result = "-" + result
    }
    if (indexDot > 0) {
      result = result + dot;
    }
    if (flag == true) {
      result = '(' + result;
    }
    return result;
  },
  getQueryObjectByUrl: function () {
    var url = window.location.href;
    var obj = {
      pathname: window.location.pathname,
      getUrl: function () {
        var i = 0;
        var result = '';
        for (prop in this) {
          if (prop === 'getUrl' || prop === "pathname") {
            continue;
          }
          if (i == 0)
            result += '?' + prop + '=' + this[prop];
          else
            result += '&' + prop + '=' + this[prop];
          i++;
        }
        result = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + this.pathname + result;
        return result;
      }
    };
    if (url.indexOf("?") == -1)
      return obj;
    var search = url.substring(url.indexOf("?"));
    if (!search || search === '')
      return obj;
    var keyValueArray = search.substring(1).split('&');
    keyValueArray.forEach(function (item, i) {
      var keyAndValue = item.split('=');
      var key = keyAndValue[0];
      var value = keyAndValue[1];
      if (typeof (value) !== 'undefined' && value !== null && value !== '')
        obj[key] = decodeURIComponent(value);
    });
    return obj;
  },
  getUserName (){    
    let pathName = window.location.pathname;    
    let userName = '';    
    if(pathName.indexOf('login') == -1 ){      
      let list = pathName.split('/') || [];      
      if(list && list.length > 0){        
        userName = list[list.length-1] || '';      
      }    
    }    
    return userName;  
  },
};
export default iknowsUtil;
