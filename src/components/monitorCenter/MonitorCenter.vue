<template>
  <div class="body-box">
    <div class="top-header">
      <iTop/>
      <iHeader/>
    </div>
    <monitorCenterContent :parentHeight="height" class=" rzl_bc_undercoat rzl-contarner content"
                          id="monitorContentBox"/>
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
    data() {
      return {
        height: 0,
      }
    },
    mounted() {
      this.height = document.getElementById("monitorContentBox").offsetHeight
    }
  }
</script>

<style scoped>
  .body-box {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
  }

  .content {
    flex: 1;
  }
</style>
