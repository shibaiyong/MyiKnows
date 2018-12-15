<template>
  <div class="body-box">
    <div class="top-header">
        <iTop></iTop>
        <iHeader :navIndex=3></iHeader>
      </div>
    <monitorCenterContent :parentHeight="height" :type="type" id="monitorContentBox" class="rzl_bc_undercoat  content"/>
    <!-- <router-view class="rzl_bc_undercoat rzl-contarner content" :type="type" id="monitorContentBox"></router-view>                       -->
    <IFooter></IFooter>
  </div>
</template>

<script>
  import iTop from '@/components/common/Top'
  import iHeader from '@/components/common/Header'
  import titleLabel from '@/components/common/TitleLabel'
  import monitorCenterContent from '@/components/monitorCenter/MonitorCenterContent'
  import dataUtil from '@/assets/js/dataUtlis'
  import IFooter from '@/components/common/Footer';

  export default {
    name: "monitor-center",
    components: {iTop, iHeader, titleLabel, dataUtil, monitorCenterContent, IFooter},
    data() {
      return {
        height: 0,
        type: '',
      }
    },
    watch: {
      $route: {
        handler: function(val, oldVal){
          this.type = this.$route.params.type;
        },
        // 深度观察监听
        deep: true
      },
      type(newVal,oldVal){
        this.type = newVal;
      }
    },
    mounted() {
      // this.height = document.getElementById("monitorContentBox").offsetHeight;
      this.type = this.$route.params.type;
    }
  }
</script>

<style scoped>
  .body-box {
    /* display: flex; */
    justify-content: space-between;
    flex-direction: column;
    height: 100%;
  }

  .content {
    flex: 1;
  }
</style>
