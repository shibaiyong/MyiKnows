<template>
  <div class="topNews" id="top" ref='documentHeight'>
    <div class="top-header" ref='topHeight'>
      <ITop></ITop>
      <IHeader  @onClickListener="" :navIndex=2></IHeader>
    </div>
    <TopNewsContent :parentHeight="height"></TopNewsContent>
    <div v-show="show" @click="returnToTopFn" class="f-db backTop">
      <img src="../../assets/up.png"/>
    </div>
    <div  ref='bottomHeight'>
      <IFooter ></IFooter>
    </div>
  </div>
</template>

<script>
  // 公共组件引入统一采用I开头
  import ITop from '@/components/common/Top';
  import IHeader from '@/components/common/Header';
  import IFooter from '@/components/common/Footer';
  import TopNewsContent from '@/components/intelligenceTopNews/IntelligenceTopNewsContent';
  import iKnowsUtil from '@/assets/js/iknowsUtil';
  export default {
    name: "intelligenceTopNews",
    components: {ITop, IHeader, IFooter, TopNewsContent},
    data() {
      return {
        items:["首页","舆情头条","监测中心","简报中心"],
        show: false,
        clean: () => {},
        height: 0,
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
      },
      //获取高度
      ajustHeight(){
        // let topHeight = this.$refs.topHeight.offsetHeight
        // let bottomHeight = this.$refs.bottomHeight.offsetHeight
        // let documentHeight = this.$refs.documentHeight.offsetHeight
        //
        // this.height  = documentHeight - topHeight - bottomHeight;
        // this.height = this.height < 600 ? 600 : this.height;
      }
    },
    mounted(){
      this.clean = this.listen();
      this.ajustHeight()
    },
    beforeDestroy() {
      this.clean()
    }
  }
</script>

<style scoped>
  .backTop{
    height: 40px;
    text-align: center;
    width: 40px;
    padding: 10px;
    box-sizing: border-box;
    position: fixed;
    bottom: 180px;
    /*-ms-right: 16px;*/
    right: 16px;

    border-radius: 50%;
    background: rgba(91, 91, 91, 0.5);
  }
  .backTop img{
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
</style>
