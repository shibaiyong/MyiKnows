<template>
  <div class="home" >
    <div class="top-header">
      <ITop></ITop>
      <IHeader  :items="items"></IHeader>
    </div>
    <HomeContent></HomeContent>
    <IFooter></IFooter>
  </div>
</template>

<script>
// 公共组件引入统一采用I开头
import ITop from '@/components/common/Top';
import IHeader from '@/components/common/Header';
import IFooter from '@/components/common/Footer';
import HomeContent from './HomeContent';
export default {
  name: "home_page",
  components: {ITop, IHeader, IFooter, HomeContent},
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
  .home{
    width: 100%;
    height: 100%;
    min-height: 1000px;
  }
</style>
