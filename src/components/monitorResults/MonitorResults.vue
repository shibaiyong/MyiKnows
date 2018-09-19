<template>
  <div class="topNews" >
    <div class="top-header">
      <ITop></ITop>
      <IHeader  @onClickListener="" :items="items"></IHeader>
    </div>
    <MonitorResultsContent ></MonitorResultsContent>
    <IFooter></IFooter>
  </div>
</template>

<script>
  // 公共组件引入统一采用I开头
  import ITop from '@/components/common/Top';
  import IHeader from '@/components/common/Header';
  import IFooter from '@/components/common/Footer';
  import MonitorResultsContent from './MonitorResultsContent';
  export default {
    name: "MonitorResults",
    components: {ITop, IHeader, IFooter, MonitorResultsContent},
    data() {
      return {
        items:["首页","舆情头条","监测中心","简报中心"]
      }
    },
    methods:{

    },
    mounted(){
    }
  }
</script>

<style scoped>

</style>

