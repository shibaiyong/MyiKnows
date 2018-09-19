<template>

  <div class="charts_line_test">

    <div class="test_content">
      <zcWorld id="666" :data="worldData" label="create_time" prop="read_num"></zcWorld>
    </div>

  </div>


</template>
<script>

  import zcWorld from '../common/ZCChartsWorld.vue'

  export default {
    name: 'test',
    components: {zcWorld},
    data() {
      return {
        worldData: [],
      }
    },
    methods: {},

    mounted() {

      let thiz = this;

      setTimeout(function () {

        thiz.worldData = [
          {
            "comprehensive_num": 0,
            "read_num": 335,
            "trans_num": 2,
            "comment_num": 3,
            "click_num": 3,
            "create_time": "网站"
          },
          {
            "comprehensive_num": 3,
            "read_num": 310,
            "trans_num": 3,
            "comment_num": 4,
            "click_num": 9,
            "create_time": "微信"
          },
          {
            "comprehensive_num": 8,
            "read_num": 274,
            "trans_num": 4,
            "comment_num": 5,
            "click_num": 6,
            "create_time": "微博"
          },
          {
            "comprehensive_num": 2,
            "read_num": 235,
            "trans_num": 5,
            "comment_num": 6,
            "click_num": 2,
            "create_time": "APP"
          },
          {
            "comprehensive_num": 4,
            "read_num": 400,
            "trans_num": 3,
            "comment_num": 4,
            "click_num": 7,
            "create_time": "报刊"
          },
          {
            "comprehensive_num": 3,
            "read_num": 168,
            "trans_num": 7,
            "comment_num": 8,
            "click_num": 3,
            "create_time": "论坛"
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
