<template>
  <div class="timeLine" id="timeLine" ref="timeLine">
    <!--自定义图例-->
    <div class="timeLine_legend clearfix" v-if="legendData.length">
      <div class="legend_item" v-for="item in legendData">
    <span class="legend_mark"
          :style="{backgroundColor:item.itemStyle.color,borderColor:item.itemStyle.borderColor?item.itemStyle.borderColor:item.itemStyle.color}"></span>
        <span>{{item.name}}</span>
      </div>
    </div>

    <!--时间线图主体-->
    <div class="timeLine_content">
      <div class="timeLine_chart" id="timeLinechart" ref="timeLine_chart" @mousedown="mouseDown($event)"></div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  let baseWidth = 100;
  let baseHeight = 30;
  let baseMargin = 50;
  export default {
    name: "time-line",
    props: {
      data: {type: Array / Object, require: false},
      options: {type: Object, require: false}
    },
    data() {
      return {
        /*图标对象*/
        eChartsObj: null,
        /*颜色库*/
        colorLibrary: [
          {backgroundColor: '#C23531', name: '网站', code: 1}, /*网站*/
          {backgroundColor: '#6BC231', name: '微信', code: 2}, /*微信*/
          {backgroundColor: '#C29131', name: '微博', code: 3}, /*微博*/
          {backgroundColor: '#31C2BA', name: 'APP', code: 4}, /*APP*/
          {backgroundColor: '#787878', name: '其他', code: 5}, /*其他*/
        ],
        /*自定义图例数据*/
        legendData: [],


        /*X轴刻度数据*/
        XAxisData: [],
        /*x轴每个格子表示的时间长度*/
        eachInterval: 0,
        /*Y轴刻度数据*/
        YAxisData: [],
        maxYAxisData: 0,

        /*测试数据*/
        testData: {}
      }
    },
    watch: {
      data(val, oldVal) {
        this.eChartsObj.setOption(this.setupOptions());
      },
    },
    methods: {

      /**********************关系图逻辑处理********************************/
      /*获取X轴时间范围长度*/
      getXAxisRange() {

        // 计算最早时间和最晚时间
        let categories = this.testData.categories;
        let min = null, max = null;
        //遍历出当前最大值和最小值
        categories.forEach(function (item, index) {
          let time = item.time;
          if (index === 0) {
            min = time;
            max = time;
          }
          //记录当前最大值
          max = time > max ? time : max;
          //记录当前最小值
          min = time < min ? time : min;
        });

        //根据最大最小,计算当前时间跨度
        let totalIntervals = max - min;
        let totalHours = totalIntervals / 3600 + 1;
        let eachInterval = 0;


        /*24小时以内1格1小时 24-48小时内1格2小时 48到72小时内1格4小时 72到120小时内1格6小时 120小时以上1格12小时*/
        if (totalHours <= 24) {
          eachInterval = 3600;
        } else if (totalHours > 24 && totalHours <= 48) {
          eachInterval = 3600 * 2;
        } else if (totalHours > 48 && totalHours <= 72) {
          eachInterval = 3600 * 4;
        } else if (totalHours > 72 && totalHours <= 120) {
          eachInterval = 3600 * 6;
        } else {
          eachInterval = 3600 * 12;
        }

        //记录当前当个格子表示的时间长度
        this.eachInterval = eachInterval;

        //对当前时间跨度按照当个时间长度进行分组
        let XAxisData = [];
        for (let i = 0; i < totalIntervals / eachInterval + 1; i++) {
          XAxisData.push(min + eachInterval * i);
        }

        //记录当前x轴数据
        this.XAxisData = XAxisData;

        return XAxisData
      },

      /*获取Y轴数据*/
      getYAxisRange() {

        let thiz = this;
        let YAxisData = [];

        //为y轴数据建立组的层次,即横轴多少就分多少组
        this.XAxisData.forEach(function () {
          YAxisData.push([]);
        });

        //通过遍历,对每一个数据进行分组放置
        this.testData.categories.forEach(function (item, index) {
          thiz.XAxisData.forEach(function (xItem, xIndex) {
            if (item.time - xItem >= 0 && item.time - xItem <= thiz.eachInterval) {
              YAxisData[xIndex].push(item);
            }
          })
        });

        //当前y轴里,组内数据最多的数量
        let maxYAxisData = 0;
        YAxisData.forEach(function (item) {
          maxYAxisData = item.length > maxYAxisData ? item.length : maxYAxisData;
        });

        //记录y轴分组数据结果
        this.YAxisData = YAxisData;
        //记录当前y轴最高点组的length
        this.maxYAxisData = maxYAxisData;

        return YAxisData;
      },

      /*监听鼠标拖动*/
      mouseDown(event) {

        let thiz = this;
        let timeLinechart = document.getElementById('timeLinechart');

        let disX = event.clientX - timeLinechart.offsetLeft;
        let disY = event.clientY - timeLinechart.offsetTop;

        document.onmousemove = function (event) {
          let l = event.clientX - disX;
          let t = event.clientY - disY;

          if (l < 0 && l >= -timeLinechart.offsetWidth + timeLinechart.parentElement.offsetWidth) {
            timeLinechart.style.left = l + 'px';
          }
          if (t < 0 && t >= -timeLinechart.offsetHeight + timeLinechart.parentElement.offsetHeight) {
            timeLinechart.style.top = t + 'px';
          }
        };

        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
        };
        return false;//兼容firefox
      },


      /************************关系图参数配置********************/
      /*节点间的关系数据*/
      setupLinks() {
        let result = [];

        this.testData.links.forEach(function (item, index) {
          result.push({source: item.source, target: item.target})
        });
        return result;
      },


      /*关系图的节点数据列表*/
      setupData() {

        let thiz = this;

        let result = [];
        this.testData.categories.forEach(function (item, index) {
          let x = null, y = null;
          for (let i = 0; i < thiz.XAxisData.length; i++) {
            let XAxis = thiz.XAxisData[i];
          }


          //计算当前数据所属x轴的坐标index
          let valueX = null;
          thiz.XAxisData.forEach(function (xitem, xindex) {

            let date = new Date(item.time * 1000),
              M = date.getMonth() + 1,
              D = date.getDate(),
              h = date.getHours(),
              m = date.getMinutes();
            /*显示样式 例如:08-20 12*/
            let aaa = M + '-' + D + ' ' + (h < 10 ? ('0' + h) : h) + ':' + (m < 10 ? ('0' + m) : m);

            if (item.time - xitem >= 0 && item.time - xitem <= thiz.eachInterval) {
              valueX = xindex;
            }
          });


          //计算当前数据所属y轴的坐标index
          let valueY = null;
          thiz.YAxisData.forEach(function (yItem, yIndex) {
            yItem.forEach(function (data, dataIndex) {
              if (item.name === data.name && item.id === data.id) {
                valueY = dataIndex;
              }
            })
          });

          //重新生成data数据

          let dataItem = {
            name: item.name,
            showName: item.id,
            category: item.category,
            value: [valueX * baseWidth + baseWidth / 2, valueY * baseHeight + baseHeight / 2],
            transTime: item.time
          };

          if(item.isTenant){
            dataItem.itemStyle = {
              color:'#fff',
              borderColor:'#000',
              borderWidth:1
            };
            dataItem.label = {
              color:'#000'
            }
          }
          result.push(dataItem);

        });

        return result;
      },


      /*节点分类的类目*/
      setupCategories() {

        let thiz = this;
        let categoryArr = [];

        this.testData.categories.forEach(function (item) {
          /*判断是否包含该项*/
          if (categoryArr.indexOf(item.category) < 0) {
            categoryArr.push(item.category)
          }
        });


        let result = [];
        categoryArr.forEach(function (category) {

          thiz.colorLibrary.forEach(function (colorItem) {

            if (colorItem.name === category) {
              result.push({
                name: colorItem.name,
                label: colorItem.name,
                itemStyle: {color: colorItem.backgroundColor}
              })
            }
          })
        });

        //增加当前"租户"样式
        result.push({
          name: '租户',
          label: '租户',
          itemStyle: {color: '#fff',borderColor:'#000'}
        });

        /*记录图例数据*/
        this.legendData = result;
        return result;
      },


      /*系列列表*/
      setupSeries() {
        return [
          {
            type: 'graph',
            coordinateSystem: 'cartesian2d', /*该系列使用的坐标系*/
            hoverAnimation: true,
            layout: 'none', /*采用x y 确定位置*/
            draggable: false, /*节点是否可拖拽*/
            focusNodeAdjacency: true, /*高亮突出节点及邻节点*/
            symbol: 'path://M0,18.5 L0,18.5 L0,18.5 C-1.25125444e-15,8.28273213 8.28273213,1.87688166e-15 18.5,0 L80.5,0 L80.5,-1.77635684e-14 C90.7172679,-1.96404501e-14 99,8.28273213 99,18.5 L99,18.5 L99,18.5 C99,28.7172679 90.7172679,37 80.5,37 L18.5,37 L18.5,37 C8.28273213,37 1.25125444e-15,28.7172679 0,18.5 Z',
            symbolSize: [baseWidth * 0.8, baseWidth * 0.8],
            symbolKeepAspect: true,//保持该图形的长宽比
            edgeSymbol: ['none', 'arrow'], /*边两端的标记类型*/
            edgeSymbolSize: 10, /*边两端的标记大小*/
            itemStyle: {
              color: "#2d8cf0",
              borderWidth: 0
            },
            lineStyle: {
              color: '#999',
              width: 1,
              curveness: 0.1
            },
            label: {
              show: true,
              color: '#fff',
              position: 'inside',
              fontStyle: 'normal',
              fontWeight: 'bold',
              verticalAlign: 'middle',
              align: 'center',
              formatter(params) {
                let name = params.data.showName;

                if (name.length > 6) {
                  name = params.data.showName.substr(0, 6) + '...'
                }

                let date = new Date(params.data.transTime * 1000),
                  M = date.getMonth() + 1,
                  D = date.getDate(),
                  h = date.getHours(),
                  m = date.getMinutes();
                /*显示样式 例如:08-20 12*/
                let time = M + '-' + D + ' ' + (h < 10 ? ('0' + h) : h) + ':' + (m < 10 ? ('0' + m) : m);

                return name + '\n' + time
              }
            },
            categories: this.setupCategories(), /*节点分类的类目*/
            data: this.setupData(), /*关系图的节点数据列表*/
            links: this.setupLinks(), /*节点间的关系数据*/
            top: baseMargin,
            left: baseMargin,
            right: baseMargin,
            bottom: baseMargin,
            animation:false
          }
        ]
      },


      /*设置配置项*/
      setupOptions() {
        return {
          //背景颜色
          backgroundColor: '#f2f2f2',
          //图例参数
          legend: {
            show: false,
            left: baseMargin,
            top: baseMargin / 2,
            align: 'left'
          },
          //直角坐标系网格
          grid: {
            show: false,
            top: baseMargin,
            left: baseMargin * 2,
            right: baseMargin * 2,
            bottom: baseMargin,
          },
          //直角坐标系X轴
          xAxis: [
            //数值x轴
            {
              show: false,
              type: 'value',
              //最小间隔大小
              minInterval: 1,
              //强制分割间隙
              interval: baseWidth,
              min: 0,
              max: baseWidth * (this.XAxisData.length - 1),
              scale: false,
              axisLabel: {
                show: true,
                color: '#ff0000'
              },
              axisTick: {
                alignWithLabel: true,
                lineStyle: {
                  color: '#ff0000'
                }
              }
            },
            //类别x轴
            {
              show: true,
              type: 'category',
              position: 'bottom',
              boundaryGap: false,
              //强制设置间隔大小
              interval: 100,
              //坐标轴的分割段数
              splitNumber: this.XAxisData.length,
              data: this.getXAxisRange(),
              axisLabel: {
                formatter(value, index) {
                  let date = new Date(value * 1000),
                    M = date.getMonth() + 1,
                    D = date.getDate(),
                    h = date.getHours();
                  /*显示样式 例如:08-20 12*/
                  return M + '-' + D + ' ' + (h < 10 ? ('0' + h) : h);
                }
              }
            }
          ],
          //直角坐标系Y轴
          yAxis: {
            show: false,
            type: 'value',
            interval: baseHeight,
            min: 0,
            max: baseHeight * this.maxYAxisData,
            scale: false,
          },

          //系列列表数组
          series: this.setupSeries(),

        }
      },


    },
    mounted() {

      let line = document.getElementById('timeLinechart');

      line.style.width = this.XAxisData.length * baseWidth + 2 * baseMargin + 'px';
      line.style.height = this.testData.categories.length * baseHeight + 2 * baseMargin + 'px';

      line.style.left = 0;
      line.style.bottom = 0;

      //创建折线图控件
      let graphChart = echarts.init(line);

      //折线图渲染
      graphChart.setOption(this.setupOptions());
      this.eChartsObj = graphChart;

      window.addEventListener("resize", function () {
        graphChart.resize();
      });


    },
    created() {

      // this.testData = {
      //   links: [
      //     {source: "2018-08-15 16:44:00", target: "红山网2018-08-15 00:00:00"},
      //       {source: "2018-08-15 16:44:00", target: "山东省海阳市党建网2018-08-15 00:00:00"},
      //       {source: "2018-08-15 16:44:00", target: "华龙网2018-08-15 00:00:00"},
      //       {source: "2018-08-15 16:44:00", target: "飞天新传媒2018-08-15 00:00:00"},
      //       {source: "2018-8-15 16:44:00", target: "青海网络广播电视台2018-08-15 00:00:00"},
      //       {source: "2018-08-15 16:44:00", target: "内蒙古电视台2018-08-15 00:00:00"},
      //       {source: "2018-08-15 16:44:00", target: "科尔沁左翼后旗人民政府2018-08-15 00:00:00"},
      //       {source: "2018-08-15 16:44:00", target: "红山网2018-08-15 00:00:00"},
      //       {source: "2018-08-15 16:44:00", target: "齐鲁网2018-08-15 07:40:00"},
      //       {source: "临溟旗帜2018-08-15 16:44:00", target: "临溟旗帜2018-08-15 13:22:30"},
      //       {source: "平凉宣讲2018-08-15 16:44:00", target: "平凉宣讲2018-08-15 15:59:31"},
      //       {source: "温情萨尔图2018-08-15 16:44:00", target: "温情萨尔图2018-08-15 16:21:04"},
      //       {source: "党建网微平台2018-08-15 16:44:00", target: "2018-08-15 16:39:18"},
      //       {source: "2018-08-15 16:44:00", target: "2018-08-15 16:39:18"},
      //       {source: "2018-08-15 16:44:00", target: "中国西藏网2018-08-15 16:40:00"},
      //       {source: "2018-08-15 16:44:00", target: "中国西藏网2018-08-15 16:40:00"},
      //       {source: "党建网微平台2018-08-15 16:44:00", target: "环球网头条2018-08-15 16:42:00"},
      //       {source: "2018-08-15 16:44:00", target: "南报网2018-08-15 16:42:00"},
      //       {source: "2018-08-15 16:44:00", target: "海口晚报网2018-08-15 16:43:11"},
      //       {source: "党建网2018-08-15 16:44:00", target: "2018-08-15 16:43:17"},
      //       {source: "2018-08-15 16:44:00", target: "中国抚州网2018-08-15 16:45:00"},
      //       {source: "2018-08-15 16:44:00", target: "京报网2018-08-15 16:47:27"},
      //       {source: "新华通讯社2018-08-15 16:44:00", target: "凤凰新闻2018-08-15 16:48:00"},
      //       {source: "2018-08-15 16:44:00", target: "凤凰网2018-08-15 16:48:47"},
      //       {source: "2018-08-15 16:44:00", target: "金羊网2018-08-15 16:51:00"},
      //       {source: "搜狐新闻2018-08-15 16:44:00", target: "搜狐头条2018-08-15 16:51:00"},
      //       {source: "2018-08-15 16:44:00", target: "光明网2018-08-15 16:52:00"},
      //       {source: "党建网微平台2018-08-15 16:44:00", target: "网易-首页-新闻（要闻）2018-08-15 16:53:41"},
      //       {source: "2018-08-15 16:44:00", target: "广佛都市网2018-08-15 16:57:00"},
      //       {source: "舆情2018-08-15 16:44:00", target: "上观新闻2018-08-15 17:01:00"},
      //       {source: "党建网微平台2018-08-15 16:44:00", target: "中国网头条2018-08-15 17:01:24"},
      //       {source: "2018-08-15 16:44:00", target: "中国访谈网2018-08-15 17:03:44"},
      //       {source: "2018-08-15 16:44:00", target: "吉林电视网2018-08-15 17:08:15"},
      //       {source: "2018-08-15 16:44:00", target: "中国日报网2018-08-15 17:11:38"},
      //       {source: "2018-08-15 16:44:00", target: "中国山东网2018-08-15 17:11:57"},
      //       {source: "2018-08-15 16:44:00", target: "澎湃2018-08-15 17:13:00"},
      //       {source: "澎湃新闻网2018-08-15 16:44:00", target: "凤凰网2018-08-15 17:13:57"},
      //       {source: "2018-08-15 16:44:00", target: "张家口新闻网2018-08-15 17:14:48"},
      //       {source: "2018-08-15 16:44:00", target: "今日湖北网2018-08-15 17:24:09"},
      //       {source: "2018-08-15 16:44:00", target: "老友网2018-08-15 17:27:13"},
      //       {source: "2018-08-15 16:44:00", target: "南方网2018-08-15 17:32:00"},
      //       {source: "平凉市公安局2018-08-15 16:44:00", target: "平凉市公安局2018-08-15 17:39:03"},
      //       {source: "2018-08-15 16:44:00", target: "南通网2018-08-15 17:39:30"},
      //       {source: "2018-08-15 16:44:00", target: "央广网2018-08-15 17:43:00"},
      //       {source: "党建网微平台2018-08-15 16:44:00", target: "红网2018-08-15 17:51:10"},
      //       {source: "2018-08-15 16:44:00", target: "北方网2018-08-15 17:51:10"},
      //       {source: "2018-08-15 16:44:00", target: "新华报业网2018-08-15 17:51:12"},
      //       {source: "2018-08-15 16:44:00", target: "扬子晚报网2018-08-15 17:51:15"},
      //       {source: "2018-08-15 16:44:00", target: "央视网-滚动新闻2018-08-15 18:05:00"},
      //       {source: "2018-08-15 16:44:00", target: "扬子晚报网2018-08-15 18:15:36"},
      //       {source: "2018-08-15 16:44:00", target: "文汇报2018-08-15 19:07:54"},
      //       {source: "2018-08-15 16:44:00", target: "观察者网2018-08-15 19:13:10"},
      //       {source: "2018-08-15 16:44:00", target: "无锡新传媒2018-08-15 20:14:48"},
      //       {source: "2018-08-15 16:44:00", target: "鄂尔多斯党建网2018-08-15 20:39:34"},
      //       {source: "2018-08-15 16:44:00", target: "南通网2018-08-15 22:01:47"},
      //       {source: "新浪新闻综合2018-08-15 16:44:00", target: "新浪新闻2018-08-15 22:02:19"},
      //       {source: "2018-08-15 16:44:00", target: "中国农业发展银行2018-08-16 00:29:01"},
      //       {source: "2018-08-15 16:44:00", target: "新余新闻网2018-08-16 01:55:25"},
      //       {source: "2018-08-15 16:44:00", target: "德宏州纪委州监委网站2018-08-16 09:37:07"},
      //       {source: "2018-08-15 16:44:00", target: "山西共青团2018-08-16 10:44:11"},
      //       {source: "2018-08-15 16:44:00", target: "邢台政府新闻网2018-08-16 16:15:41"},
      //       {source: "珠海市卫计局党建之声2018-08-15 16:44:00", target: "珠海市卫计局党建之声2018-08-16 16:58:37"},
      //       {source: "泰山热力2018-08-15 16:44:00", target: "泰山热力2018-08-16 17:07:00"},
      //       {source: "绥江警方2018-08-15 16:44:00", target: "绥江警方2018-08-16 17:35:17"},
      //       {source: "双柏警方2018-08-15 16:44:00", target: "双柏警方2018-08-16 17:47:26"},
      //       {source: "彩虹映天山2018-08-15 16:44:00", target: "彩虹映天山2018-08-16 19:19:30"},
      //       {source: "2018-08-15 16:44:00", target: "盈江县纪委县监委网站2018-08-16 20:34:12"},
      //       {source: "2018-08-15 16:44:00", target: "中国阳泉2018-08-16 22:28:37"},
      //       {source: "2018-08-15 16:44:00", target: "北方网新闻频道2018-08-17 00:21:34"},
      //       {source: "求是网2018-08-15 16:44:00", target: "凤凰网2018-08-17 22:03:52"},
      //       {source: "淮电微风2018-08-15 16:44:00", target: "淮电微风2018-08-17 22:04:59"},
      //       {source: "2018-08-15 16:44:00", target: "大河网2018-08-17 23:40:19"},
      //       {source: "2018-08-15 16:44:00", target: "中国唐尧网2018-08-18 15:17:00"},
      //       {source: "阿拉尔富丽达零距离2018-08-15 16:44:00", target: "阿拉尔富丽达零距离2018-08-19 10:38:07"},
      //       {source: "2018-08-15 16:44:00", target: "最高人民检察院2018-08-22 13:22:24"},
      //       {source: "延安干部培训学院2018-08-15 16:44:00", target: "延安干部培训学院2018-08-22 18:01:18"},
      //       {source: "2018-08-15 16:44:00", target: "inews2018-08-15 16:44:00"}
      //   ],
      //
      //   categories: [
      //     {name: "红山网2018-08-15 00:00:00", id: "红山网", time: 1534322640, category: '网站'},
      //     {name: "新余新闻网2018-08-16 01:55:25", id: "新余新闻网", time: 1534322640, category: '微信'},
      //     {name: "山西共青团2018-08-16 10:44:11", id: "山西共青团", time: 1534322640, category: '微博'},
      //     {name: "珠海市卫计局党建之声2018-08-15 16:44:00", id: "珠海市卫计局党建之声", time: 1534409917, category: 'APP'},
      //     {name: "大河网2018-08-17 23:40:19", id: "大河网", time: 1534322640, category: '网站'},
      //     {name: "澎湃新闻网2018-08-15 16:44:00", id: "澎湃新闻网", time: 1534324437, category: '其他'},
      //     {name: "党建网微平台2018-08-15 16:44:00", id: "党建网微平台", time: 1534326670, category: '其他'},
      //     {name: "中国日报网2018-08-15 17:11:38", id: "中国日报网", time: 1534322640, category: '网站'},
      //     {name: "舆情2018-08-15 16:44:00", id: "舆情", time: 1534323660, category: '其他'},
      //     {name: "临溟旗帜2018-08-15 16:44:00", id: "临溟旗帜", time: 1534310550, category: '其他'},
      //     {name: "德宏州纪委州监委网站2018-08-16 09:37:07", id: "德宏州纪委州监委网站", time: 1534322640, category: '网站'},
      //     {name: "南报网2018-08-15 16:42:00", id: "南报网", time: 1534322640, category: '网站'},
      //     {name: "中国网头条2018-08-15 17:01:24", id: "中国网头条", time: 1534322640, category: '网站'},
      //     {name: "绥江警方2018-08-16 17:35:17", id: "绥江警方", time: 1534322640, category: '微信'},
      //     {name: "华龙网2018-08-15 00:00:00", id: "华龙网", time: 1534322640, category: '网站'},
      //     {name: "鄂尔多斯党建网2018-08-15 20:39:34", id: "鄂尔多斯党建网", time: 1534322640, category: '网站'},
      //     {name: "凤凰网2018-08-17 22:03:52", id: "凤凰网", time: 1534322640, category: '网站'},
      //     {name: "平凉宣讲2018-08-15 16:44:00", id: "平凉宣讲", time: 1534319971, category: '其他'},
      //     {name: "淮电微风2018-08-15 16:44:00", id: "淮电微风", time: 1534514699, category: '其他'},
      //     {name: "海口晚报网2018-08-15 16:43:11", id: "海口晚报网", time: 1534322640, category: '网站'},
      //     {name: "中国农业发展银行2018-08-16 00:29:01", id: "中国农业发展银行", time: 1534322640, category: '网站'},
      //     {name: "彩虹映天山2018-08-15 16:44:00", id: "彩虹映天山", time: 1534418370, category: '其他'},
      //     {name: "中国山东网2018-08-15 17:11:57", id: "中国山东网", time: 1534322640, category: '网站'},
      //     {name: "延安干部培训学院2018-08-22 18:01:18", id: "延安干部培训学院", time: 1534322640, category: '微信'},
      //     {name: "新华报业网2018-08-15 17:51:12", id: "新华报业网", time: 1534322640, category: '网站'},
      //     {name: "文汇报2018-08-15 19:07:54", id: "文汇报", time: 1534322640, category: '网站'},
      //     {name: "北方网新闻频道2018-08-17 00:21:34", id: "北方网新闻频道", time: 1534322640, category: '网站'},
      //     {name: "广佛都市网2018-08-15 16:57:00", id: "广佛都市网", time: 1534322640, category: '网站'},
      //     {name: "今日湖北网2018-08-15 17:24:09", id: "今日湖北网", time: 1534322640, category: '网站'},
      //     {name: "中国访谈网2018-08-15 17:03:44", id: "中国访谈网", time: 1534322640, category: '网站'},
      //     {name: "扬子晚报网2018-08-15 18:15:36", id: "扬子晚报网", time: 1534322640, category: '网站'},
      //     {name: "中国唐尧网2018-08-18 15:17:00", id: "中国唐尧网", time: 1534322640, category: '网站'},
      //     {name: "张家口新闻网2018-08-15 17:14:48", id: "张家口新闻网", time: 1534322640, category: '网站'},
      //     {name: "新浪新闻综合2018-08-15 16:44:00", id: "新浪新闻综合", time: 1534341739, category: '其他'},
      //     {name: "2018-08-15 16:43:17", id: "", time: 1534322640, category: '网站'},
      //     {name: "inews2018-08-15 16:44:00", id: "inews", time: 1534322640, category: '其他', isTenant: true,},
      //     {name: "延安干部培训学院2018-08-15 16:44:00", id: "延安干部培训学院", time: 1534932078, category: '其他'},
      //     {name: "澎湃2018-08-15 17:13:00", id: "澎湃", time: 1534322640, category: '网站'},
      //     {name: "科尔沁左翼后旗人民政府2018-08-15 00:00:00", id: "科尔沁左翼后旗人民政府", time: 1534322640, category: '网站'},
      //     {name: "邢台政府新闻网2018-08-16 16:15:41", id: "邢台政府新闻网", time: 1534322640, category: '网站'},
      //     {name: "阿拉尔富丽达零距离2018-08-19 10:38:07", id: "阿拉尔富丽达零距离", time: 1534322640, category: '微信'},
      //     {name: "北方网2018-08-15 17:51:10", id: "北方网", time: 1534322640, category: '网站'},
      //     {name: "京报网2018-08-15 16:47:27", id: "京报网", time: 1534322640, category: '网站'},
      //     {name: "淮电微风2018-08-17 22:04:59", id: "淮电微风", time: 1534322640, category: '微信'},
      //     {name: "青海网络广播电视台2018-08-15 00:00:00", id: "青海网络广播电视台", time: 1534322640, category: '网站'},
      //     {name: "中国阳泉2018-08-16 22:28:37", id: "中国阳泉", time: 1534322640, category: '网站'},
      //     {name: "双柏警方2018-08-15 16:44:00", id: "双柏警方", time: 1534412846, category: '其他'},
      //     {name: "无锡新传媒2018-08-15 20:14:48", id: "无锡新传媒", time: 1534322640, category: '网站'},
      //     {name: "新浪新闻2018-08-15 22:02:19", id: "新浪新闻", time: 1534322640, category: '微博'},
      //     {name: "齐鲁网2018-08-15 07:40:00", id: "齐鲁网", time: 1534322640, category: '网站'},
      //     {name: "彩虹映天山2018-08-16 19:19:30", id: "彩虹映天山", time: 1534322640, category: '微信'},
      //     {name: "央视网-滚动新闻2018-08-15 18:05:00", id: "央视网-滚动新闻", time: 1534322640, category: '网站'},
      //     {name: "盈江县纪委县监委网站2018-08-16 20:34:12", id: "盈江县纪委县监委网站", time: 1534322640, category: '网站'},
      //     {name: "光明网2018-08-15 16:52:00", id: "光明网", time: 1534322640, category: '网站'},
      //     {name: "温情萨尔图2018-08-15 16:44:00", id: "温情萨尔图", time: 1534321264, category: '其他'},
      //     {name: "平凉市公安局2018-08-15 16:44:00", id: "平凉市公安局", time: 1534325943, category: '其他'},
      //     {name: "凤凰新闻2018-08-15 16:48:00", id: "凤凰新闻", time: 1534322640, category: '微博'},
      //     {name: "绥江警方2018-08-15 16:44:00", id: "绥江警方", time: 1534412117, category: '其他'},
      //     {name: "最高人民检察院2018-08-22 13:22:24", id: "最高人民检察院", time: 1534322640, category: '网站'},
      //     {name: "泰山热力2018-08-16 17:07:00", id: "泰山热力", time: 1534322640, category: '微信'},
      //     {name: "温情萨尔图2018-08-15 16:21:04", id: "温情萨尔图", time: 1534322640, category: '微信'},
      //     {name: "内蒙古电视台2018-08-15 00:00:00", id: "内蒙古电视台", time: 1534322640, category: '网站'},
      //     {name: "搜狐新闻2018-08-15 16:44:00", id: "搜狐新闻", time: 1534323060, category: '其他'},
      //     {name: "南通网2018-08-15 22:01:47", id: "南通网", time: 1534322640, category: '网站'},
      //     {name: "南通网2018-08-15 17:39:3", id: "南通网", time: 1534322640, category: '网站'},
      //     {name: "央广网2018-08-15 17:43:00", id: "央广网", time: 1534322640, category: '网站'},
      //     {name: "环球网头条2018-08-15 16:42:00", id: "环球网头条", time: 1534322640, category: '网站'},
      //     {name: "凤凰网2018-08-15 16:48:47", id: "凤凰网", time: 1534322640, category: '网站'},
      //     {name: "凤凰网2018-08-15 17:13:57", id: "凤凰网", time: 1534322640, category: '网站'},
      //     {name: "新华通讯社2018-08-15 16:44:00", id: "新华通讯社", time: 1534322880, category: '其他'},
      //     {name: "珠海市卫计局党建之声2018-08-16 16:58:37", id: "珠海市卫计局党建之声", time: 1534322640, category: '微信'},
      //     {name: "南方网2018-08-15 17:32:00", id: "南方网", time: 1534322640, category: '网站'},
      //     {name: "观察者网2018-08-15 19:13:10", id: "观察者网", time: 1534322640, category: '网站'},
      //     {name: "红网2018-08-15 17:51:10", id: "红网", time: 1534322640, category: '网站'},
      //     {name: "求是网2018-08-15 16:44:00", id: "求是网", time: 1534514632, category: '其他'},
      //     {name: "临溟旗帜2018-08-15 13:22:30", id: "临溟旗帜", time: 1534322640, category: '微信'},
      //     {name: "金羊网2018-08-15 16:51:00", id: "金羊网", time: 1534322640, category: '网站'},
      //     {name: "网易-首页-新闻（要闻）2018-08-15 16:53:41", id: "网易-首页-新闻（要闻）", time: 1534322640, category: '网站'},
      //     {name: "2018-08-15 16:39:18", id: "", time: 1534322640, category: '网站'},
      //     {name: "中国抚州网2018-08-15 16:45:00", id: "中国抚州网", time: 1534322640, category: '网站'},
      //     {name: "平凉宣讲2018-08-15 15:59:31", id: "平凉宣讲", time: 1534322640, category: '微信'},
      //     {name: "阿拉尔富丽达零距离2018-08-15 16:44:00", id: "阿拉尔富丽达零距离", time: 1534646287, category: '其他'},
      //     {name: "党建网2018-08-15 16:44:00", id: "党建网", time: 1534322597, category: '其他'},
      //     {name: "老友网2018-08-15 17:27:13", id: "老友网", time: 1534322640, category: '网站'},
      //     {name: "平凉市公安局2018-08-15 17:39:03", id: "平凉市公安局", time: 1534322640, category: '微信'},
      //     {name: "泰山热力2018-08-15 16:44:00", id: "泰山热力", time: 1534410420, category: '其他'},
      //     {name: "双柏警方2018-08-16 17:47:26", id: "双柏警方", time: 1534322640, category: '微信'},
      //     {name: "中国西藏网2018-08-15 16:40:00", id: "中国西藏网", time: 1534322640, category: '网站'},
      //     {name: "飞天新传媒2018-08-15 00:00:00", id: "飞天新传媒", time: 1534322640, category: '网站'},
      //     {name: "上观新闻2018-08-15 17:01:00", id: "上观新闻", time: 1534322640, category: '微博'},
      //     {name: "吉林电视网2018-08-15 17:08:15", id: "吉林电视网", time: 1534322640, category: '网站'},
      //     {name: "扬子晚报网2018-08-15 17:51:15", id: "扬子晚报网", time: 1534322640, category: '网站'},
      //     {name: "搜狐头条2018-08-15 16:51:00", id: "搜狐头条", time: 1534322640, category: '网站'},
      //     {name: "山东省海阳市党建网2018-08-15 00:00:00", id: "山东省海阳市党建网", time: 1534322640, category: '网站'},
      //     {name: "2018-08-15 16:44:00", id: "", time: 1534322640, category: '其他'}
      //   ],
      // };

      this.testData = this.data;

      this.getXAxisRange();
      this.getYAxisRange();
    }
  }

</script>

<style scoped>

  .timeLine_content {
    overflow: hidden;
  }

  /*自定义图例*/
  .timeLine_legend {
    background-color: #f2f2f2;
    color: #666;
    font-size: 17px;
    padding: 0 20px;
  }

  .legend_item {
    float: left;
    line-height: 50px;
    margin-right: 10px;
  }

  .legend_item .legend_mark {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 5px;
    font-size: 0;
    border-width: 1px;
    border-style: solid;
  }

  .timeLine_content {
    position: relative;
    padding-bottom: calc(100% * 6 / 16);
  }

  .timeLine_chart {
    position: absolute;
    height: 100%;
  }
</style>
