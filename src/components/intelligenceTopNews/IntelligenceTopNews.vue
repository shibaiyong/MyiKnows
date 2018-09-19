<template>
  <div class="topNews" id="top">
    <div class="top-header">
      <ITop></ITop>
      <IHeader  @onClickListener="" :items="items"></IHeader>
    </div>
    <TopNewsContent ></TopNewsContent>
    <span v-show="show" @click="returnToTopFn" class="f-db backTop">
      <img src="../../assets/backtop.png"/>
    </span>
    <IFooter></IFooter>
  </div>
</template>

<script>
  // 公共组件引入统一采用I开头
  import ITop from '@/components/common/Top';
  import IHeader from '@/components/common/Header';
  import IFooter from '@/components/common/Footer';
  import TopNewsContent from './IntelligenceTopNewsContent';
  import iKnowsUtil from '@/assets/js/iknowsUtil';
  export default {
    name: "IntelligenceTopNews",
    components: {ITop, IHeader, IFooter, TopNewsContent},
    data() {
      return {
        items:["首页","舆情头条","监测中心","简报中心"],
        show: false,
        clean: () => {}
      }
    },
    methods:{
      //返回顶部
      returnToTopFn() {
        let el = this.$el.parentNode
        let st = el.scrollTop >> 0
        iKnowsUtil.backTop({y: st}, {y: 0}, 500, function({y}, hand){
          el.scrollTop = y
          if (0 === y) cancelAnimationFrame(hand)
        })
      },
      //监听scrollTop
      listen() {
        let el = this.$el.parentNode
        if (!(el instanceof HTMLElement)) return
        let scrollFn = () => {
          let top = el.scrollTop >> 0
          console.log(top)
          if (top > 100){
            this.show = true
          }else {
            this.show = false
          }
        }
        el.addEventListener('scroll', scrollFn)
        return () => {
          el.removeEventListener('scroll', scrollFn)
        }
      }
    },
    mounted(){
      this.clean = this.listen()
    },
    beforeDestroy() {
      this.clean()
    }
  }
</script>

<style scoped>
  .backTop{
    width: 40px;
    height: 40px;
    position: fixed;
    right: 5%;
    bottom: 20%;
    cursor: pointer;
  }
</style>
