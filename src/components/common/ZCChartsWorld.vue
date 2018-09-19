<template>
  <div class="zc_charts_content" id="zc_charts_content">

    <div id="zc_charts_world"
         class="zc_charts_world"
         ref="zc_charts_world">
    </div>

    <div class="zc_charts_empty" :id="id">没有更多词云信息数据</div>

  </div>
</template>

<script>

  import echarts from 'echarts'
  import '../../../static/js/echarts-wordcloud'

  export default {
    name: "z-c-charts-world",
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

        this.initWorldCloudChart()

      }
    },
    methods:{

      getRandomColor(){

        return 'rgb(' + [
          Math.round(Math.random() * 160),
          Math.round(Math.random() * 160),
          Math.round(Math.random() * 160)
        ].join(',') + ')';
      },


      setupData(){
        let result = [],thiz = this;
        this.data.forEach(function (item) {

          result.push({
            value: item[thiz.prop],
            name: item[thiz.label],
            // textStyle:{normal:{color:thiz.getRandomColor()}}
          })
        });

        return result;
      },

      setupSeries(){

        let series = {
          type:'wordCloud',
          gridSize: 20,
          sizeRange: [12, 50],
          rotationRange: [0, 0],
          shape: 'circle',
          textStyle:{
            normal:{
              color(){
                return 'rgb(' + [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160)
                ].join(',') + ')';
              },
            }
          },
          data:this.setupData()
        };

        return series;
      },


      setupOptions(){
        return {
          tooltip:{
            show:true,
            padding: [5, 10, 5, 10],
            backgroundColor: '#fff',
            textStyle: {
              color: '#555',
              fontSize: 14,
            },
            formatter:'{b}&nbsp:&nbsp{c}',
            // formatter(params){
            //   console.log(params)
            // },
            extraCssText: 'box-shadow: 1px 1px 10px 2px #F5F5F5;line-height:25px;text-align: left;'
          },
          series: this.setupSeries(),

        }
      },

      initWorldCloudChart() {

        let content = document.getElementById('zc_charts_content');

        let empty = document.getElementById(this.id);

        let worldCloud = document.getElementById('zc_charts_world');

        if (this.data.length) {

          empty.style.display = 'none';

          let worldCloudChart = echarts.init(worldCloud);

          worldCloudChart.setOption(this.setupOptions());

          this.eChartsObj = worldCloudChart;

          /*监听屏幕拖拽*/
          window.addEventListener("resize", function () {

            worldCloudChart.resize();

          });

        }else{

          empty.style.display = 'block';
          empty.style.lineHeight = content.offsetHeight + 'px';

        }

      }

    },
    mounted(){
      this.initWorldCloudChart()
    }
  }
</script>

<style scoped>

  .zc_charts_content {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .zc_charts_world, .zc_charts_empty {
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
  }
</style>
