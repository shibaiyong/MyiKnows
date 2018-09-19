<template>

  <div class="charts_line_test">

    <div class="test_content">
      <zcBar :data="barData" axis="create_time" :category="category"></zcBar>
    </div>


  </div>


</template>
<script>

  import zcBar from '../common/ZCChartsBar.vue'

  export default {
    name: 'test',
    components: {zcBar},
    data() {
      return {
        barData: [],
        category: [],
      }
    },
    methods: {},

    mounted() {

      let thiz = this;

      setTimeout(function () {

        thiz.barData =
          [
            {
              "comprehensive_num": 0,
              "read_num": 1,
              "trans_num": 2,
              "comment_num": 3,
              "click_num": 3,
              "create_time": "01/01"
            },
            {
              "comprehensive_num": 3,
              "read_num": 2,
              "trans_num": 3,
              "comment_num": 4,
              "click_num": 9,
              "create_time": "01/02"
            },
            {
              "comprehensive_num": 8,
              "read_num": 3,
              "trans_num": 4,
              "comment_num": 5,
              "click_num": 6,
              "create_time": "01/03"
            },
            {
              "comprehensive_num": 2,
              "read_num": 4,
              "trans_num": 5,
              "comment_num": 6,
              "click_num": 2,
              "create_time": "01/04"
            },
            {
              "comprehensive_num": 4,
              "read_num": 2,
              "trans_num": 3,
              "comment_num": 4,
              "click_num": 7,
              "create_time": "01/05"
            },
            {
              "comprehensive_num": 3,
              "read_num": 6,
              "trans_num": 7,
              "comment_num": 8,
              "click_num": 3,
              "create_time": "01/06"
            },
            {
              "comprehensive_num": 2,
              "read_num": 7,
              "trans_num": 8,
              "click_num": 10,
              "comment_num": 9,
              "create_time": "01/07"
            },
            {
              "comprehensive_num": 0,
              "read_num": 1,
              "trans_num": 2,
              "comment_num": 3,
              "click_num": 3,
              "create_time": "01/01"
            },
            {
              "comprehensive_num": 3,
              "read_num": 2,
              "trans_num": 3,
              "comment_num": 4,
              "click_num": 9,
              "create_time": "01/02"
            },
            {
              "comprehensive_num": 8,
              "read_num": 3,
              "trans_num": 4,
              "comment_num": 5,
              "click_num": 6,
              "create_time": "01/03"
            },
            {
              "comprehensive_num": 2,
              "read_num": 4,
              "trans_num": 5,
              "comment_num": 6,
              "click_num": 2,
              "create_time": "01/04"
            },
            {
              "comprehensive_num": 4,
              "read_num": 2,
              "trans_num": 3,
              "comment_num": 4,
              "click_num": 7,
              "create_time": "01/05"
            },
            {
              "comprehensive_num": 3,
              "read_num": 6,
              "trans_num": 7,
              "comment_num": 8,
              "click_num": 3,
              "create_time": "01/06"
            },
            {
              "comprehensive_num": 2,
              "read_num": 7,
              "trans_num": 8,
              "click_num": 10,
              "comment_num": 9,
              "create_time": "01/07"
            },
          ];

        thiz.category = [
          {prop: 'trans_num', label: '正常'},
          {prop: 'comment_num', label: '一般'},
          {prop: 'read_num', label: '轻微'},
          {prop: 'comprehensive_num', label: '较大'},
          {prop: 'click_num', label: '重大'},
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
