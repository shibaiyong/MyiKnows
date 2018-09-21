<template>
  <div>
    <div class="top-header">
      <iTop/>
      <iHeader/>
    </div>
    <monitorCenterContent class=" rzl_bc_undercoat rzl-contarner" />
    <IFooter/>
  </div>
</template>

<script>
  import iTop from '@/components/common/Top'
  import iHeader from '@/components/common/Header'
  import titleLabel from '@/components/common/TitleLabel'
  import monitorCenterContent from '@/components/monitorCenter/MonitorCenterContent'
  import dataUtil from '../../assets/js/dataUtlis'
  import IFooter from '@/components/common/Footer';

  export default {
    name: "monitor-center",
    components: {iTop, iHeader, titleLabel, dataUtil, monitorCenterContent, IFooter},

  }
</script>

<style scoped>

</style>
