<template>

  <div class="charts_line_test">

    <div class="test_content" v-if="tableData.length || category.length">
      <zcTable id="444"
               :data="tableData"
               :category="category"
               :isSelect="true"
               :operations="operations"
               @refresh-data="refreshdata"
               @click-table-cell="clickTableCell"
               @select-data="selectData">
      </zcTable>
    </div>

    <div v-else>没有更过数据</div>


  </div>


</template>
<script>

  import zcTable from '../common/ZCTable.vue'

  export default {
    name: 'test',
    components: {zcTable},
    data() {
      return {
        tableData: [],
        category: [],
        operations: []
      }
    },
    methods: {

      refreshdata(val) {

        alert(val);
      },

      clickTableCell(rowIndex, columnIndex) {
        alert(`a==${rowIndex},b==${columnIndex}`)
      },

      selectData(a) {
        console.log(a);
      }
    },

    mounted() {

      let thiz = this;

      setTimeout(function () {

        let res =
          {
            number: 1,
            totalPages: 422,
            totalElements: 4219,
            elementsNo: 0,
            limit: 10,
            content: [
              {
                unionId: "4_1809101131_1496837",
                inx: 1,
                articleId: "1809101131_1496837",
                platformId: "4d83be1d1bad4451bf2b0ad9ce4162be",
                platformName: "网易新闻_APP",
                platformTypeId: "e57fb6722d9c4734a36c83798146a35c",
                platformTypeName: "APP",
                title: "IS武装或对西欧发动袭击?英军增派部队进驻阿富汗",
                transNum: 0,
                commentNum: 0,
                clickNum: 0,
                thumbsNum: 0,
                pageRank: 8,
                publishTime: "2018-09-10 14:27",
                author: null
              },
              {
                unionId: "4_1809101131_1490475",
                inx: 2,
                articleId: "1809101131_1490475",
                platformId: "4d83be1d1bad4451bf2b0ad9ce4162be",
                platformName: "网易新闻_APP",
                platformTypeId: "e57fb6722d9c4734a36c83798146a35c",
                platformTypeName: "APP",
                title: "针对中俄高超音速武器？美研发滑翔破坏者拦截器",
                transNum: 0,
                commentNum: 0,
                clickNum: 0,
                thumbsNum: 0,
                pageRank: 8,
                publishTime: "2018-09-10 14:27",
                author: null
              },
              {
                unionId: "4_1809101131_1493881",
                inx: 3,
                articleId: "1809101131_1493881",
                platformId: "4d83be1d1bad4451bf2b0ad9ce4162be",
                platformName: "网易新闻_APP",
                platformTypeId: "e57fb6722d9c4734a36c83798146a35c",
                platformTypeName: "APP",
                title: "小伙网上买克隆出租车拉活 运营仨月被刑拘",
                transNum: 0,
                commentNum: 0,
                clickNum: 0,
                thumbsNum: 0,
                pageRank: 8,
                publishTime: "2018-09-10 14:24",
                author: null
              },
              {
                unionId: "4_1809101131_1547862",
                inx: 4,
                articleId: "1809101131_1547862",
                platformId: "4d83be1d1bad4451bf2b0ad9ce4162be",
                platformName: "网易新闻_APP",
                platformTypeId: "e57fb6722d9c4734a36c83798146a35c",
                platformTypeName: "APP",
                title: "世界急救日：上海两大火车站安装AED",
                transNum: 0,
                commentNum: 0,
                clickNum: 0,
                thumbsNum: 0,
                pageRank: 8,
                publishTime: "2018-09-10 14:52",
                author: null
              },
              {
                unionId: "4_1809101131_1503169",
                inx: 5,
                articleId: "1809101131_1503169",
                platformId: "4d83be1d1bad4451bf2b0ad9ce4162be",
                platformName: "网易新闻_APP",
                platformTypeId: "e57fb6722d9c4734a36c83798146a35c",
                platformTypeName: "APP",
                title: "板块内部分化 文化传媒龙头股价值凸显",
                transNum: 0,
                commentNum: 0,
                clickNum: 0,
                thumbsNum: 0,
                pageRank: 8,
                publishTime: "2018-09-10 14:24",
                author: null
              },
              {
                unionId: "4_1809101131_1529505",
                inx: 6,
                articleId: "1809101131_1529505",
                platformId: "4d83be1d1bad4451bf2b0ad9ce4162be",
                platformName: "网易新闻_APP",
                platformTypeId: "e57fb6722d9c4734a36c83798146a35c",
                platformTypeName: "APP",
                title: "下班有大雨！广州市启动强对流4级应急响应！",
                transNum: 0,
                commentNum: 0,
                clickNum: 0,
                thumbsNum: 0,
                pageRank: 8,
                publishTime: "2018-09-10 14:52",
                author: null
              },
              {
                unionId: "4_1809101131_1529315",
                inx: 7,
                articleId: "1809101131_1529315",
                platformId: "4d83be1d1bad4451bf2b0ad9ce4162be",
                platformName: "网易新闻_APP",
                platformTypeId: "e57fb6722d9c4734a36c83798146a35c",
                platformTypeName: "APP",
                title: "暴雨来袭！部分路段水浸没过膝盖 你下班被困住了吗",
                transNum: 0,
                commentNum: 0,
                clickNum: 0,
                thumbsNum: 0,
                pageRank: 8,
                publishTime: "2018-09-10 14:55",
                author: null
              },
              {
                unionId: "4_1809101131_1544062",
                inx: 8,
                articleId: "1809101131_1544062",
                platformId: "4d83be1d1bad4451bf2b0ad9ce4162be",
                platformName: "网易新闻_APP",
                platformTypeId: "e57fb6722d9c4734a36c83798146a35c",
                platformTypeName: "APP",
                title: "华东理工在沪高校中首设微专业 鼓励学生个性发展",
                transNum: 0,
                commentNum: 0,
                clickNum: 0,
                thumbsNum: 0,
                pageRank: 8,
                publishTime: "2018-09-10 14:52",
                author: null
              },
              {
                unionId: "4_1809101131_1529171",
                inx: 9,
                articleId: "1809101131_1529171",
                platformId: "4d83be1d1bad4451bf2b0ad9ce4162be",
                platformName: "网易新闻_APP",
                platformTypeId: "e57fb6722d9c4734a36c83798146a35c",
                platformTypeName: "APP",
                title: "街坊别惋惜！上下九陶陶居最快半年后重新开店",
                transNum: 0,
                commentNum: 0,
                clickNum: 0,
                thumbsNum: 0,
                pageRank: 8,
                publishTime: "2018-09-10 14:47",
                author: null
              },
              {
                unionId: "4_1809101131_1494341",
                inx: 10,
                articleId: "1809101131_1494341",
                platformId: "4d83be1d1bad4451bf2b0ad9ce4162be",
                platformName: "网易新闻_APP",
                platformTypeId: "e57fb6722d9c4734a36c83798146a35c",
                platformTypeName: "APP",
                title: "外媒：海航将出售大量海外资产 估值超100亿美元",
                transNum: 0,
                commentNum: 0,
                clickNum: 0,
                thumbsNum: 0,
                pageRank: 8,
                publishTime: "2018-09-10 14:29",
                author: null
              },
              {
                unionId: "4_1809101131_1493881",
                inx: 11,
                articleId: "1809101131_1493881",
                platformId: "4d83be1d1bad4451bf2b0ad9ce4162be",
                platformName: "网易新闻_APP",
                platformTypeId: "e57fb6722d9c4734a36c83798146a35c",
                platformTypeName: "APP",
                title: "小伙网上买克隆出租车拉活 运营仨月被刑拘",
                transNum: 0,
                commentNum: 0,
                clickNum: 0,
                thumbsNum: 0,
                pageRank: 8,
                publishTime: "2018-09-10 14:24",
                author: null
              },
            ]
          };

        thiz.tableData = res.content;
        // thiz.tableData = [];

        thiz.category = [
          {prop: 'inx', label: '序号', width: 50,},
          {
            prop: 'platformName',
            label: '平台',
            width: 100,
            itemsStyle: [
              {index: 3, style: {color: '#ff0000'}}
            ]
          },
          {
            prop: 'title',
            label: '文章标题',
            style: {textAlign: 'left'},
            headerStyle: {textAlign: 'left'},
            showHover: true
          },
          {prop: 'transNum', label: '转载数', width: 100},
          {prop: 'commentNum', label: '评论数', width: 100},
          {prop: 'clickNum', label: '阅读数', width: 100},
          {prop: 'thumbsNum', label: '点赞数', width: 100},
          {prop: 'publishTime', label: '发布时间', width: 150},
          {prop: 'author', label: '作者', width: 100},
          {prop: 'pageRank', label: '传播力', width: 100},
        ];


        thiz.operations = ['修改', '删除']
      }, 1000);

    }
  }
</script>
<style scoped>

  .test_content {
    /*border: 1px solid #e2e3e4;*/
    width: 100%;
    background-color: #fff;
    /*height: 300px;*/

  }

</style>
