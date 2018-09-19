<template>

  <div class="charts_line_test">

    <div class="test_content">
      <zcMap id="555" :data="mapData" label="create_time" prop="read_num"></zcMap>
    </div>

  </div>


</template>
<script>

  import zcMap from '../common/ZCChartsMap.vue'

  export default {
    name: 'test',
    components: {zcMap},
    data() {
      return {
        mapData: [],
      }
    },
    methods: {},

    mounted() {

      let thiz = this;

      setTimeout(function () {

        thiz.mapData = [
          {
            "comprehensive_num": 0,
            "read_num": 335,
            "trans_num": 2,
            "comment_num": 3,
            "click_num": 3,
            "create_time": "河北"
          },
          {
            "comprehensive_num": 3,
            "read_num": 310,
            "trans_num": 3,
            "comment_num": 4,
            "click_num": 9,
            "create_time": "北京"
          },
          {
            "comprehensive_num": 8,
            "read_num": 274,
            "trans_num": 4,
            "comment_num": 5,
            "click_num": 6,
            "create_time": "广东"
          },
          {
            "comprehensive_num": 2,
            "read_num": 235,
            "trans_num": 5,
            "comment_num": 6,
            "click_num": 2,
            "create_time": "山西"
          },
          {
            "comprehensive_num": 4,
            "read_num": 400,
            "trans_num": 3,
            "comment_num": 4,
            "click_num": 7,
            "create_time": "黑龙江"
          },
          {
            "comprehensive_num": 3,
            "read_num": 2,
            "trans_num": 7,
            "comment_num": 8,
            "click_num": 3,
            "create_time": "云南"
          },
        ];
      }, 1000);

    }
  }
</script>
<style scoped>

  .test_content {
    border: 1px solid #e2e3e4;
    width: 500px;
    background-color: #fff;
    height: 500px;

  }

</style>
