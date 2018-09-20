<template>
  <div>
    <div class="top-header">
      <iTop/>
      <iHeader/>
    </div>
    <articleDetailsContent class=" rzl_bc_undercoat rzl-contarner"/>
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
  }
</script>

<style scoped>

</style>
