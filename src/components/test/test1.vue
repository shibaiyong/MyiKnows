<template>

  <!--<div class="test" v-if="lineData.length">-->
  <div class="test_content" v-if="lineData.length">
    <zcLine :data="lineData" axis="create_time" :category="category"></zcLine>
  </div>
  <div v-else>
    没有更过数据
  </div>


  <!--</div>-->
  <!--<div style="width: 100%;">-->
  <!--<div style="display: flex;justify-content: center;width: calc(100% - 50px);margin: 0 auto;">-->

  <!--<div style="width: 100px;height: 200px;background-color: royalblue;margin-right: 10px"></div>-->
  <!--<div style="width: 100px;height: 200px;background-color: salmon;"></div>-->
  <!--<div style="width: 100%;height: 200px;background-color: teal;"></div>-->

  <!--</div>-->

  <!--</div>-->


</template>
<script>

  import zcLine from '../common/ZCChartsLine'

  export default {
    name: 'test',
    components: {zcLine},
    data() {
      return {
        lineData: [],
        category: [],
      }
    },
    methods: {},

    mounted() {
      let thiz = this;
      setTimeout(function () {
        thiz.lineData = [
          {
            "comprehensive_num": 0,
            "read_num": 1,
            "trans_num": 2,
            "comment_num": 3,
            "click_num":3,
            "create_time": "01/01"
          },
          {
            "comprehensive_num": 3,
            "read_num": 2,
            "trans_num": 3,
            "comment_num": 4,
            "click_num":9,
            "create_time": "01/02"
          },
          {
            "comprehensive_num": 8,
            "read_num": 3,
            "trans_num": 4,
            "comment_num": 5,
            "click_num":6,
            "create_time": "01/03"
          },
          {
            "comprehensive_num": 2,
            "read_num": 4,
            "trans_num": 5,
            "comment_num": 6,
            "click_num":2,
            "create_time": "01/04"
          },
          {
            "comprehensive_num": 4,
            "read_num": 2,
            "trans_num": 3,
            "comment_num": 4,
            "click_num":7,
            "create_time": "01/05"
          },
          {
            "comprehensive_num": 3,
            "read_num": 6,
            "trans_num": 7,
            "comment_num": 8,
            "click_num":3,
            "create_time": "01/06"
          },
          {
            "comprehensive_num": 2,
            "read_num": 7,
            "trans_num": 8,
            "click_num":10,
            "comment_num": 9,
            "create_time": "01/07"
          },
        ];
        thiz.category = [
          {prop: 'trans_num', label: '网站'},
          {prop: 'comment_num', label: '微信'},
          {prop: 'read_num', label: '微博'},
          {prop: 'comprehensive_num', label: 'APP'},
          {prop: 'click_num', label: '数字报'},
        ]
      }, 1000);

    }
  }
</script>
<style scoped>

  .test {
    background-color: #fff;
    position: relative;
  }

  .test_content {
    border: 1px solid #e2e3e4;
    width: 100%;
    background-color: #fff;
    height: 400px;

  }

</style>
