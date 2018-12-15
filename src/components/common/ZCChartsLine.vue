<template>

  <div class="zc_charts_content" :id="'zc_charts_content_'+id">

    <div :id="'zc_charts_line'+id"
         class="zc_charts_line"
         ref="zc_charts_line">
    </div>

    <div :id="id" class="zc_charts_empty">
      <!--<span v-else><i class="el-icon-loading"></i>  数据加载中</span>-->
      <span class="noData">暂无相关数据</span>
      <span class="isLoading"><i class="el-icon-loading"></i>  数据加载中</span>

    </div>

  </div>

</template>

<script>

  // import echarts from 'echarts'
  import iKnowsUtil from '@/assets/js/iknowsUtil';
  export default {
    name: "z-c-charts-line",
    props: {

      data: {type: Array, require: true},
      category: {type: Array, require: true},
      axis: {type: String, require: true},
      id:{type:String,require:true},

    },

    data() {
      return {
        colors: ['#1DD1EF', '#46DD31', '#F5DB21', '#FF9241', '#FB5959', '#8B51E6'],
        eChartsObj: null,
        idName:null
      }
    },
    watch:{

      data(val, oldVal) {

        let el = document.getElementById(this.id);
        let noData = el.getElementsByClassName('noData')[0];
        let isLoading = el.getElementsByClassName('isLoading')[0];

        if(val.length){
          noData.style.display = 'none';
          isLoading.style.display = 'block';
          this.initLineChart()
        }else{
          noData.style.display = 'block';
          isLoading.style.display = 'none';
        }
      }

    },

    methods: {

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
            type: 'line',
            id:'line'+categoryIndex,
            name: categoryItem.label,
            showSymbol:true,
            symbol: 'emptyCircle',
            symbolSize: 8,
            animation: false,
            data: data,
            cursor: 'default',
            /*平滑曲线*/
            smooth: true,
            hoverAnimation:true,
            legendHoverLink:true,
            emphasis:{
              itemStyle:{
                color:thiz.colors[categoryIndex],
                borderColor:thiz.colors[categoryIndex]
              }
            }
          });

        });

        return series;
      },


      /*加载参数*/
      setupOptions() {
        return {
          /*图例*/
          legend: {
            show: this.category.length>0?true:false,
            orient: 'horizontal',
            top: 0,
            right: 20,
            icon: 'circle',
            itemWidth: 10,
            padding:0
          },
          /*坐标系*/
          grid: {
            show: false,
            top: this.category.length>0?40:5,
            bottom: 30,
            left: this.category.length>0?54:20,
            right: 20
          },
          /*提示框组件*/
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#CDCDCD',
                width: 1
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
              params.forEach(function (item, index) {
                if (item.data < 1){
                  result = result + item.marker + '&nbsp' + item.seriesName + '&nbsp:&nbsp' + item.data;
                } else{
                  result = result + item.marker + '&nbsp' + item.seriesName + '&nbsp:&nbsp' + iKnowsUtil.handleNum(item.data) + '&nbsp篇';
                }

                if (index !== params.length - 1) {
                  result += '<br>'
                }
              });
              return result;
            },
            extraCssText: 'box-shadow: 1px 1px 10px 2px #F5F5F5;line-height:25px;text-align: left;'
          },

          xAxis: {
            type: 'category',
            show: true,
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#CDCDCD', width: 2
              }
            },
            axisTick: {show: false},
            axisLabel: {
              color: '#979797',
              margin: 15
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
              margin: 2,
              formatter: function (value, index) {
                if (value >= 10000 && value < 100000000) {
                  value = value / 10000 + "万";
                } else if (value >= 100000000) {
                  value = value / 100000000 + "亿";
                }
                return value;
              }
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
              }
            },
            scale: true,
          },

          series: this.setupSeries(),

          color: this.category.length>1?['#1DD1EF', '#46DD31', '#F5DB21', '#FF9241', '#FB5959', '#8B51E6']:['#3B87F5']
        }
      },

      initLineChart(){

        let content = document.getElementById('zc_charts_content_'+this.id);


        let empty = document.getElementById(this.id);

        let line = document.getElementById('zc_charts_line'+this.id);

        if(this.data.length){

          empty.style.display = 'none';

          let lineChart = echarts.init(line);

          lineChart.setOption(this.setupOptions());

          this.eChartsObj = lineChart;

          /*监听屏幕拖拽*/
          window.addEventListener("resize", function () {

            lineChart.resize();

          });

        }else{

          empty.style.display = 'block';
          empty.style.lineHeight = content.offsetHeight + 'px';

        }
      }

    },


    mounted() {

     this.initLineChart()

    },
    created(){
      // console.log(this.data);

    },
    beforeCreate(){


    }
  }
</script>

<style scoped>
  canvas:hover{
    background: #000;
  }
  .zc_charts_content {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .zc_charts_line,.zc_charts_empty {
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

  .noData{
    display: none;
  }
</style>
