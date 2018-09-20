<template>
  <div class="page">
    <div class="top-header">
      <ITop></ITop>
      <iHeader @onClickListener="a" :items="items"></iHeader>
    </div>
    <div class="rzl-contarner .rzl_bc_1">
      <div class="min-content">
        <router-view></router-view>
      </div>
    </div>
    <IFooter></IFooter>
  </div>
</template>

<script>
  // 公共组件引入统一采用I开头
  import ITop from '@/components/common/Top';
  import IHeader from '@/components/common/Header';
  import IFooter from '@/components/common/Footer';
  export default {
    name: "page",
    components: {
      ITop,
      IHeader,
      IFooter,
    },
    data() {
      return {

      }
    },
    methods: {

    },
    mounted() {
      console.log(111111111111)
    }
  }
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  min-height: 1000px;
  background-color: #eee;
}
.min-content{
  height: 100%;
  min-height: 900px;
  background-color: slateblue;
  overflow-x: hidden;
}
</style>
