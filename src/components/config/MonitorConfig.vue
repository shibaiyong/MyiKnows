<template>
  <div>
    <div class="top-header">
      <ITop></ITop>
      <IHeader :items="items"></IHeader>
    </div>
    <MonitorConfigContent></MonitorConfigContent>
    <IFooter></IFooter>
  </div>
</template>
<script>

import ITop from '@/components/common/Top';
import IHeader from '@/components/common/Header';
import IFooter from '@/components/common/Footer';
import MonitorConfigContent from './monitorConfigContent';

export default {
  name: 'i-monitorConfigContent',
  components: {ITop, IHeader, IFooter, MonitorConfigContent},
  data () {
    return {
      monitorTypeList: []
    }
  },
  methods: {
    // 切换监测类型
    changeMonitorType (type){

    }
  },
  created() {
    
  },
}
</script>
<style scoped>

</style>
