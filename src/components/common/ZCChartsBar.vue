<template>
  <div class="zc_charts_content" :id="'zc_charts_content_'+id">

    <div :id="'zc_charts_bar'+id"
         class="zc_charts_bar"
         ref="zc_charts_bar">
    </div>

    <div :id="id" class="zc_charts_empty">没有更多柱状图数据</div>

  </div>

</template>

<script>
  import echarts from 'echarts'
  import iKnowsUtil from '@/assets/js/iknowsUtil';
  export default {
    name: "z-c-charts-bar",
    props:{
      data: {type: Array, require: true},
      category: {type: Array, require: true},
      axis: {type: String, require: true},
      id:{type:String,require:true},
    },

    data(){

      return {
        colors: ['#1DD1EF', '#46DD31', '#F5DB21', '#FF9241', '#FB5959', '#8B51E6'],
        eChartsObj: null,
        contentWidth:0
      }

    },

    watch:{

      data(val,oldVal){
        this.initBarChart();
      }
    },
    methods:{

      /*加载x轴横坐标数据*/
      setupXAxisData() {

        let XAxis = [], thiz = this;

        thiz.data.forEach(function (item) {
          XAxis.push(item[thiz.axis])
        });

        return XAxis;

      },

      /*加载系列列表*/
      setupSeries() {

        let series = [], thiz = this;

        thiz.category.forEach(function (categoryItem,categoryIndex) {

          let data = [];
          thiz.data.forEach(function (dataItem) {
            data.push(dataItem[categoryItem.prop])
          });

          series.push({
            type: 'bar',
            id:'bar'+categoryIndex,
            name: categoryItem.label,
            data: data,
            cursor: 'default',
            stack:thiz.category.length>0?'one':'null',
            barWidth:thiz.category.length>0?'40%':'30%',
            barMaxWidth:35,
            // emphasis: {
            //   itemStyle:{
            //     barBorderWidth: 1,
            //     shadowBlur: 10,
            //     shadowOffsetX: 0,
            //     shadowOffsetY: 0,
            //     shadowColor: 'rgba(0,0,0,0.5)'
            //   }
            // }

          });

        });

        return series;
      },

      setupOptions(){
        return {
          /*图例*/
          legend: {
            show: this.category.length>1?true:false,
            orient: 'horizontal',
            top: 'top',
            right: 0,
            icon: 'rect',
            itemWidth: 10,
            itemHeight:10,
            padding:0
          },
          /*坐标系*/
          grid: {
            show: false,
            top: this.category.length>0?30:0,
            bottom: 50,
            left: this.category.length>0?40:0,
            right: 0,          
          },
          /*提示框组件*/
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#CDCDCD',
                width: 0
              },
            },
            padding: [10, 20, 10, 20],
            backgroundColor: '#fff',
            textStyle: {
              color: '#555',
              fontSize: 14,
            },
            formatter(params) {

              let result = '';
              if(params.length >1){
                params.forEach(function (item, index) {
                  result = result + item.marker + '&nbsp' + item.seriesName + '&nbsp:&nbsp' + iKnowsUtil.handleNum(item.data) + '&nbsp篇';
                  if (index !== params.length - 1) {
                    result += '<br>'
                  }
                });
              }else{
                result = result + params[0].name + '&nbsp:&nbsp' + iKnowsUtil.handleNum(params[0].data) + '&nbsp篇'
              }

              return result;
            },
            extraCssText: 'box-shadow: 1px 1px 10px 2px #F5F5F5;line-height:25px;text-align: left;'
          }, 
          xAxis: {
            type: 'category',
            show: true,
            boundaryGap: true,           
            axisLine: {
              lineStyle: {
                color: '#CDCDCD', width: 2
              }
            },
            axisTick: {show: false},
            axisLabel: {
              color: '#979797',
              margin: 15,
              interval: 0, 
              formatter : function(params){
                var newParamsName = "";// 最终拼接成的字符串
                var paramsNameNumber = params.length;// 实际标签的个数
                var provideNumber = 8;// 每行能显示的字的个数
                var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                // 条件等同于rowNumber>1
                if (paramsNameNumber > provideNumber) {
                  /** 循环每一行,p表示行 */
                  for (var p = 0; p < rowNumber; p++) {
                    var tempStr = "";// 表示每一次截取的字符串
                    var start = p * provideNumber;// 开始截取的位置
                    var end = start + provideNumber;// 结束截取的位置
                    // 此处特殊处理最后一行的索引值
                    if (p == rowNumber - 1) {
                      // 最后一次不换行
                      tempStr = params.substring(start, paramsNameNumber);
                    } else {
                      // 每一次拼接字符串并换行
                      tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr;// 最终拼成的字符串
                  }

                } else {
                  // 将旧标签的值赋给新标签
                  newParamsName = params;
                }
                //将最终的字符串返回
                return newParamsName
              }

            },
            data: this.setupXAxisData()
          },

          yAxis: {
            type: 'value',
            show: true,
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {
              show:this.category.length>0?true:false,
              color: '#979797',
              fontSize: 12,
              margin: 0
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
              }
            },

          },

          series: this.setupSeries(),

          color: this.category.length>1?['#1DD1EF', '#46DD31', '#F5DB21', '#FF9241', '#FB5959', '#8B51E6']:['#3B87F5']

        }
      },

      initBarChart(){

        let content = document.getElementById('zc_charts_content_'+this.id);

        let empty = document.getElementById(this.id);

        let bar = document.getElementById('zc_charts_bar'+this.id);

        if(this.data.length){

          empty.style.display = 'none';

          let barChart = echarts.init(bar);

          barChart.setOption(this.setupOptions());

          this.eChartsObj = barChart;

          /*监听屏幕拖拽*/
          window.addEventListener("resize", function () {

            barChart.resize();

          });

        }else {

          empty.style.display = 'block';
          empty.style.lineHeight = content.offsetHeight + 'px';
          
        }
      }

    },

    mounted(){

      this.initBarChart();

    },


  }
</script>

<style scoped>

  .zc_charts_content {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .zc_charts_bar,.zc_charts_empty {
    position: absolute;
    background-color: #fff;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
  .zc_charts_empty {
    display: none;
    text-align: center;
    font-size: 14px;
    color:#606266 ;
  }
</style>
