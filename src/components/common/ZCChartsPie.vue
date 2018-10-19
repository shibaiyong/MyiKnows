<template>
  <div class="zc_charts_content" :id="'zc_charts_content_'+id">

    <div :id="'zc_charts_pie'+id"
         class="zc_charts_pie"
         ref="zc_charts_pie">
    </div>

    <div class="zc_charts_empty" :id="id">没有更多饼图数据</div>

  </div>

</template>

<script>
  import echarts from 'echarts'

  export default {
    name: "z-c-charts-pie",

    props: {
      data: {type: Array, require: true},
      label: {type: String, require: true},
      prop: {type: String, require: true},
      id:{type:String,require:true},
    },

    data() {

      return {
        colors: ['#1DD1EF', '#46DD31', '#F5DB21', '#FF9241', '#FB5959', '#8B51E6'],
        eChartsObj: null,
      }

    },
    watch: {
      data(val, oldVal) {

        this.initPieChart()

      }
    },
    methods: {

      setupSeries() {

        let data = [], thiz = this;


        thiz.data.forEach(function (dataItem) {
          data.push({value: dataItem[thiz.prop], name: dataItem[thiz.label]})
        });


        let series = [
          {
            type: 'pie',
            id:'pie',
            center: ['50%', '50%'],
            legendHoverLink: false,
            hoverAnimation: false,
            startAngle: 180,
            roseType: 'radius',
            label: {
              show: true,
              color: '#555',
              formatter: '{b}: {d}%'
            },
            cursor: 'default',
            data: data.sort(function (a, b) {
              return b.value - a.value;
            }),
          }
        ];

        return series;
      },

      setupOptions() {
        return {
          /*图例*/
          legend: {
            show: false,
          },
          tooltip: {
            show: false
          },
          series: this.setupSeries(),

          color: this.colors

        }
      },

      initPieChart() {

        let content = document.getElementById('zc_charts_content_'+this.id);

        let empty = document.getElementById(this.id);

        let pie = document.getElementById('zc_charts_pie'+this.id);

        if (this.data.length) {

          empty.style.display = 'none';

          let pieChart = echarts.init(pie);

          pieChart.setOption(this.setupOptions());

          this.eChartsObj = pieChart;

          /*监听屏幕拖拽*/
          window.addEventListener("resize", function () {

            pieChart.resize();

          });

        }else{

          empty.style.display = 'block';
          empty.style.lineHeight = content.offsetHeight + 'px';

        }

      }
    },
    mounted(){
      this.initPieChart()
    }


  }

</script>

<style scoped>
  .zc_charts_content {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .zc_charts_pie, .zc_charts_empty {
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
