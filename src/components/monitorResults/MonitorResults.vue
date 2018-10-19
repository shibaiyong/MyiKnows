<template>
  <div class="topNews rzl_fc_darkgray " >
    <div class="top-header">
      <ITop></ITop>
      <IHeader></IHeader>
    </div>
    <div class="rzl-contarner rzl_bc_undercoat">
      <div class="blank_1"></div>
      <MonitorResultsContent ></MonitorResultsContent>
    </div>
    <IFooter></IFooter>
    <span v-show="show" @click="returnToTopFn" class="f-db backTop">
      <img src="../../assets/up.png"/>
    </span>
  </div>
</template>

<script>
  // 公共组件引入统一采用I开头
  import ITop from '@/components/common/Top';
  import IHeader from '@/components/common/Header';
  import IFooter from '@/components/common/Footer';
  import MonitorResultsContent from './MonitorResultsContent';
  import iKnowsUtil from '@/assets/js/iknowsUtil';
  export default {
    name: "MonitorResults",
    components: {ITop, IHeader, IFooter, MonitorResultsContent},
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
        let el = this.$el.parentNode;
        el.scrollTop = 0;
        if (!(el instanceof HTMLElement)) return
        let scrollFn = () => {
          let top = el.scrollTop >> 0
          if (top > 500){
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
  .blank_1{
    height: 20px;
  }
  .backTop{
    height: 40px;
    text-align: center;
    width: 40px;
    padding: 10px;
    box-sizing: border-box;
    position: fixed;
    bottom: 180px;
    right: 60px;
    border-radius: 50%;
    background: rgba(91, 91, 91, 0.5);
  }
  .backTop img{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
</style>

