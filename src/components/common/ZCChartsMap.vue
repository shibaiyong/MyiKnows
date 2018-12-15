<template>
  <div class="zc_charts_content" :id="'zc_charts_content_'+id">

    <div :id="'zc_charts_map'+id"
         class="zc_charts_map"
         ref="zc_charts_map">
    </div>

    <div class="zc_charts_empty" :id="id">
      <span class="noData">暂无相关数据</span>
      <span class="isLoading"><i class="el-icon-loading"></i>  数据加载中</span>
    </div>

  </div>

</template>

<script>
  // import echarts from 'echarts'
  import china from 'echarts/map/js/china';

  export default {
    name: "zc_charts_map",
    props: {
      id: {type: String, require: true},
      data: {type: Array, require: true},
      label: {type: String, require: true},
      prop: {type: String, require: true},
    },

    data() {

      return {
        colors: ['#1DD1EF', '#46DD31', '#F5DB21', '#FF9241', '#FB5959', '#8B51E6'],
        eChartsObj: null,
        provincesData: [
          {name: '北京'}, {name: '天津'}, {name: '上海'}, {name: '重庆'}, {name: '河北'}, {name: '河南'},
          {name: '云南'}, {name: '辽宁'}, {name: '黑龙江'}, {name: '湖南'}, {name: '安徽'}, {name: '山东'}, {name: '新疆'},
          {name: '江苏',}, {name: '浙江'}, {name: '江西'}, {name: '湖北'}, {name: '广西'}, {name: '甘肃'}, {name: '山西'},
          {name: '内蒙古'}, {name: '陕西'}, {name: '吉林'}, {name: '福建'}, {name: '贵州'}, {name: '广东'}, {name: '青海'},
          {name: '西藏'}, {name: '四川'}, {name: '宁夏'}, {name: '海南'}, {name: '台湾'}, {name: '香港'}, {name: '澳门'},
          {name: '南海诸岛'}
        ],
        max: 0,
        mapData: []
      }

    },

    watch: {

      data(val, oldVal) {
        let el = document.getElementById(this.id);
        let noData = el.getElementsByClassName('noData')[0];
        let isLoading = el.getElementsByClassName('isLoading')[0];

        if(val.length){
          noData.style.display = 'none';
          isLoading.style.display = 'block';
          this.initMapChart();
        }else{
          noData.style.display = 'block';
          isLoading.style.display = 'none';
        }

      }
    },
    methods: {


      /*加载系列列表*/
      setupData() {

        let result = [], thiz = this;

        thiz.provincesData.forEach(function (item) {
          thiz.data.forEach(function (data) {
            let provinceName = thiz.cutProvinceName(data[thiz.label])

            if (provinceName == item.name) {

              thiz.max = Math.max(thiz.max, data[thiz.prop]);

              result.push({name: provinceName, value: data[thiz.prop]})
            } else {
              result.push({name: item.name})
            }
          })

        })

        this.mapData = result;
        return result;
      },

      setupOptions() {
        return {

          tooltip: {
            show: true,
            backgroundColor: '#fff',
            textStyle: {
              color: '#555',
              fontSize: 14,
            },
            extraCssText: 'box-shadow: 1px 1px 10px 2px #F5F5F5;line-height:25px;text-align: left;',

            formatter(params) {
              if (params.name === '南海诸岛') {
                return
              }
              return params.name + '&nbsp:&nbsp' + (params.value ? params.value : '-')
            }
          },
          geo: {
            // left:'5%',
            // right:'5%',
            show: true,
            map: 'china',
            roam: false,
            layoutCenter: ['50%', '50%'],
            itemStyle: {
              areaColor: '#dddddd',
              borderColor: '#fff',
              borderWidth: 1,
              shadowBlur: 0
            },
            regions: [{
              name: '南海诸岛',
              value: 0,
              itemStyle: {
                opacity: 0
              },
              emphasis: {
                itemStyle: {
                  opacity: 0
                },

              }
            }],
            label: {show: false,},
            emphasis: {label: {show: false}}
          },
          visualMap: {
            type: 'continuous',
            orient: 'horizontal',
            inverse: true,
            min: 0,
            max: this.max,
            itemHeight: 100,
            left: 10,
            bottom: 30,
            text: ['高', '低'],
            inRange: {
              color: ['#E4E9FE', '#3B87F5']
            }

          },
          series: [
            {
              type: 'map',
              geoIndex: 0,
              data: this.mapData
            }
          ],
        }
      },

      initMapChart() {

        let content = document.getElementById('zc_charts_content_' + this.id);

        let empty = document.getElementById(this.id);

        let map = document.getElementById('zc_charts_map' + this.id);

        if (this.data.length) {

          this.setupData();
          empty.style.display = 'none';

          let mapChart = echarts.init(map);

          mapChart.setOption(this.setupOptions());

          this.eChartsObj = mapChart;

          /*监听屏幕拖拽*/
          window.addEventListener("resize", function () {

            mapChart.resize();

          });

        } else {

          empty.style.display = 'block';
          empty.style.lineHeight = content.offsetHeight + 'px';

        }
      },


      cutProvinceName(name) {
        let newName = name;
        if (name.indexOf('省') > 0) {
          newName = name.substring(0, name.indexOf('省'))
        } else if (name.indexOf('市') > 0) {
          newName = name.substring(0, name.indexOf('市'))
        }else if (name.indexOf('宁夏') != -1 ){
          newName = '宁夏'
        }else if (name.indexOf('广西') != -1 ){
          newName = '广西'
        }else if (name.indexOf('新疆') != -1 ){
          newName = '新疆'
        }else if(name.indexOf('自治区') != -1){
          newName = name.replace('自治区','');
        }
        return newName
      }

    },

    mounted() {

      this.initMapChart();

    },

  }
</script>

<style scoped>

  .zc_charts_content {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .zc_charts_map, .zc_charts_empty {
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
