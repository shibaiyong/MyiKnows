<template>
      <div class="calenderWrapper">
        <div class="inputCalender">
            <input type="text" placeholder="请选择日期" v-model="displayIntoText" @click="openCalenders" @change="backShowDate"/>
        </div>
        <div class="calenderContainer" v-show="closeCalender">
            <div class="title">

                <a href="javascript:void(0);" class="prev" @click="changeMonth('prve')">&#x3C;</a>

                <span>{{title}}</span>
                
                <a href="javascript:void(0);" class="next" @click="changeMonth('next')">&#x3E;</a>
            </div>
            <ul>
                <li><span>日</span></li>
                <li><span>一</span></li>
                <li><span>二</span></li>
                <li><span>三</span></li>
                <li><span>四</span></li>
                <li><span>五</span></li>
                <li><span>六</span></li>
                <!--<li><span>日</span></li>-->
            </ul>
            <ul class="dateTable">
                <li v-for="item in showDate">
                    <span v-if="item.month == item.currentMonth" :class="[item.now, item.day==clickDay?'clickActive':'']" @click="displayDate(item.displayIntoText, item.day)">{{item.day}}</span>
                    <span v-else class='disableClick'>{{item.day}}</span>
                </li>
            </ul>
        </div>
    </div>  
</template>
<script>
// import TreeContent from "@/components/common/TreeContent"

export default {
  name: "calender",
  props:{
    format:{
      type:String,
      default:'yyyy-MM-dd'
    },
    formatValue:{
      type:String,
      default:'yyyy-MM-dd'
    },
    defaultValue:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      title: "",
      showDate: [],
      nowMonth: "",
      nowYear: "",
      displayIntoText: "",
      clickDay: "",
      closeCalender: false
    };
  },
  updated() {},
  beforeCreate: function() {
    // this.$options.components.TreeContent = () => import("@/components/common/TreeContent")
  },
  created() {
    this.initeNowDate();
    this.displayIntoText=this.defaultValue;
  },
  methods: {
    initeNowDate() {
      this.nowMonth = new Date().getMonth();
      this.nowYear = new Date().getFullYear();
    },
    changeMonth(type) {
      this.nowMonth = type == "next" ? ++this.nowMonth : --this.nowMonth;
      this.createdCalender(this.nowYear, this.nowMonth);
    },
    //根据日期的改变生成日历。
    createdCalender(year, month) {
      this.clickDay = '';//月份变化时去掉点击效果。
      var currentDate = new Date(year, month, 1);
      var currentYear = currentDate.getFullYear();
      var currentMonth = currentDate.getMonth();
      var currentDay = currentDate.getDay();
      var now = "";
      this.title = currentYear + "年" + (currentMonth + 1) + "月";
      var n = 1 - currentDay;
      //确定上个月有几天展示出来。
      n = n == 1 ? -6 : n;
      currentDate.setDate(n);
      var willCreatDate = [];
      for (var i = 0; i < 42; i++) {
        var day = currentDate.getDate();
        var month = currentDate.getMonth();
        if (
          new Date().getFullYear() == currentYear &&
          new Date().getMonth() == currentMonth &&
          new Date().getDate() == day
        ) {
          now = "active";
        } else {
          now = "";
        }
        willCreatDate.push({
          day: day,
          month: month,
          currentMonth: currentMonth,
          displayIntoText:
            currentYear +
            "-" +
            (month + 1 > 9 ? month + 1 : "0" + (month + 1)) +
            "-" +
            (day > 9 ? day : "0" + day),
          now: now
        });
        currentDate.setDate(day + 1);
      }
      this.showDate = willCreatDate;
    },
    openCalenders() {
      this.closeCalender = true;
    },

    //通过日历列表选择日期后，对样式的操作
    displayDate(text, day) {
      var displayIntoText = text;
      var displayIntoTextValue = text;
      if(this.format != 'yyyy-MM-dd'){
        displayIntoText = this.dateFormat(text, 'format');
      }
      if(this.formatValue != 'yyyy-MM-dd'){
        displayIntoTextValue = this.dateFormat(text, 'formatValue');
      }
      this.clickDay = day; //给选中的日期加效果。
      this.displayIntoText = displayIntoText; //改变标题日期的显示。

      this.$emit('input', displayIntoTextValue);//向外传出的值

      this.closeCalender = false; //选完日期后，关闭日历。
    },
    //将输入框中的日期回显到新生成的日历中,显示传过来的默认值。
    backShowDate() {
      var inputDateValue = this.displayIntoText;
      
      var regex = /(\d{4})\D*(\d{1,})\D*(\d{1,})/;
      //检测手动输入的日期格式是否正确
      if (!regex.test(inputDateValue)) {
        return false;
      }
      //利用正则提取取年、月、日。
      regex.exec(inputDateValue);
      var year = RegExp.$1 * 1;
      var month = RegExp.$2 * 1;
      var date = RegExp.$3 * 1;
      //重新计算年、月、日。
      var currentDate = new Date(year, month - 1, date);
      year = currentDate.getFullYear();
      month = currentDate.getMonth();
      date = currentDate.getDate();

      //改变起始年份和月份
      this.nowYear = year;
      this.nowMonth = month;

      inputDateValue =
        year +
        "-" +
        (month + 1 > 9 ? month + 1 : "0" + (month + 1)) +
        "-" +
        (date > 9 ? date : "0" + date);
      //inputDateValue = this.dateFormat( year, month, date );
      //根据输入的日期重新生成日历
      this.createdCalender(year, month);
      //重新渲染日历的文本显示、效果展示
      this.displayDate(inputDateValue, date);
      regex = "";
    },
    dateFormat( value, type ) {
      var displayIntoText = value.replace("-", "/");
      var currentDate = new Date(displayIntoText);
      var year = currentDate.getFullYear();
      var month = currentDate.getMonth();
      var date = currentDate.getDate();
      var o = {
        "M+": month + 1, // month
        "d+": date // day
      };

      var format = type == 'format' ? this.format : this.formatValue;
      if (/(y+)/.test(format)) {
        format = format.replace( RegExp.$1, (year + "").substr(4 - RegExp.$1.length) );
      }

      for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace( RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
      return format;
    },
    showDefaultDate(){

    }
  },
  mounted() {
    this.createdCalender(this.nowYear, this.nowMonth);
    //将传过来的默认值显示出来
    this.backShowDate();
    //console.log(this.showDate)
  }
};
</script>
<style scoped>
.inputCalender input {
  padding-left: 10px;
  margin: 0;
  height: 30px;
  border: 1px solid #ddd;
  /* 防止出现内阴影 */
  border-radius: 3px;
  outline: none;
  outline: 0px;
}
ul {
  overflow: hidden;
}
ul,
ul li {
  list-style: none;
}
ul li {
  float: left;
  width: 14%;
}
ul li span {
  display: inline-block;
  width: 100%;
  padding: 5px 0;
  text-align: center;
  cursor: pointer;
  border-radius: 50%;
}
.calenderWrapper {
  width: 230px;
  margin: 0 auto;
}
.calenderContainer .title {
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* padding:0 4%; */
  box-sizing: border-box;
}
.calenderContainer .title a {
  display: inline-block;
  text-decoration: none;
  padding: 10px;
  background: #ddd;
  border-radius: 4px;
}

.calenderContainer {
  border: 1px solid #ddd;
}
.active {
  background: #a100e9;
  color: white;
}
.clickActive {
  background: rgba(161, 0, 233, 0.5);
}
.disableClick {
  color: #ddd;
}
</style>
