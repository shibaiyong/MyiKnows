<template>
  <div>
    <div class="top-header">
      <iTop/>
      <iHeader/>
    </div>
    <articleDetailsContent class="content rzl_bc_undercoat" />
    <IFooter/>
  </div>


</template>

<script>
  import iTop from '@/components/common/Top'
  import iHeader from '@/components/common/Header'
  import titleLabel from '@/components/common/TitleLabel'
  import articleDetailsContent from '@/components/details/ArticleDetailsContent'
  import dataUtil from '../../assets/js/dataUtlis'
  import IFooter from '@/components/common/Footer';

  export default {
    name: "article-details",
    components: {iTop, iHeader, titleLabel, dataUtil, articleDetailsContent, IFooter},
    data: function () {
      return {
        items: [],
        labelData: [],
        correlationNewsData: [],
      }
    },
    methods: {
      a: function (index) {
      }
    },
    mounted() {
      this.labelData = dataUtil.getLabelData()
      this.items = dataUtil.getTabItems()
      this.correlationNewsData = dataUtil.getCorrelationNewsData()
    }
  }
</script>

<style scoped>
  .content {
    padding: 20px 80px 40px;
    min-width: 1440px;
    box-sizing: border-box;
  }
</style>
