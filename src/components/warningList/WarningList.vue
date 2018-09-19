<template>
  <div class="topNews" >
    <div class="top-header">
      <ITop></ITop>
      <IHeader  @onClickListener="" :items="items"></IHeader>
    </div>
    <WarningListContent ></WarningListContent>
    <IFooter></IFooter>
  </div>
</template>

<script>
  // 公共组件引入统一采用I开头
  import ITop from '@/components/common/Top';
  import IHeader from '@/components/common/Header';
  import IFooter from '@/components/common/Footer';
  import WarningListContent from './WarningListContent';
  export default {
    name: "WaringList",
    components: {ITop, IHeader, IFooter, WarningListContent},
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
