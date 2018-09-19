<template>
  <div class="header" id="iHeader">
    <div class="header-list font20">
      <div class="list-item" v-for="(item, index) in items">
        <span @click="handleClick(index)">{{item}}</span>
      </div>
    </div>
    <div class="list-scrollbar" id="listScrollbar">&nbsp;</div>
  </div>
</template>

<script>
  /**
   * 使用方式
   * 1 引入header组件 import iHeader from '@/components/common/IHeader'
   * 2 声明   components: {iHeader},
   * 3 在html中引用   <iHeader
   *                          @onClickListener="a"
   *                          :items="items"/>
   * 4 参数说明
   *  items：标题数组 类型 string数组
   *    例：items:["首页","舆情头条","监测中心","简报中心"] 必传
   *  @onClickListener ：点击事件监听，会返回被点击按钮的index 非比传
   *    例：function a(index){
   *          alert(index)
   *     }
   * */
  export default {
    name: "i-header",
    // props: ["items"],
    watch: {
      items() {
        this.initScrollbarPosition();
      }
    },
    data: function () {
      return {
        index: 0,
        scrollbar: null,
        animationing: false,
        items: ["首页", "舆情头条", "监测中心", "简报中心"]
      }
    },
    methods: {
      init: function () {
        this.scrollbar = document.getElementById("listScrollbar")
        var index = -1;
        var path = this.$route.path
        switch (path) {
          case "/":
            index = 0
            break
          case "/intelligencetopnews":
            index = 1
            break
          case "/monitorcenter":
            index = 2
            break
          case "/bulletincenter":
            index = 3
            break
        }
        this.index = index;
        this.initScrollbarPosition();
      },
      initScrollbarPosition: function () {
        if (this.index == -1) {
          return
        }
        this.scrollbar.style.left = (100 / this.items.length / 2) * (this.index * 2 + 1) + "%"
        this.scrollbar.style.visibility = "visible"
      },
      handleClick(index) {
        if (index == this.index) {
          return
        }
        // if (this.animationing) {
        //   return
        // }
        // var lastIndex = this.index;
        // this.index = index;
        // this.executeAnim(lastIndex);
        // this.$emit("onClickListener", [index]);
        switch (index) {
          case 0:
            this.$router.push("/")
            break
          case 1:
            this.$router.push("/intelligencetopnews")
            break
          case 2:
            this.$router.push("/monitorcenter")
            break
          case 3:
            this.$router.push("/bulletincenter")
            break
        }
      },
      executeAnim: function (lastIndex) {
        if (this.animationing) {
          return
        }
        this.animationing = true
        var nowLeft = (100 / this.items.length / 2) * (lastIndex * 2 + 1);
        var targetLeft = (100 / this.items.length / 2) * (this.index * 2 + 1);
        var count = 0;
        var i = (targetLeft - nowLeft) / 30;
        var thiz = this;
        var intervalCode = setInterval(function () {
          if (count < 30) {
            thiz.scrollbar.style.left = (nowLeft + count * i) + "%"
          } else {
            thiz.scrollbar.style.left = targetLeft + "%"
            thiz.animationing = false
            clearInterval(intervalCode);
          }
          count++;
        }, 5);
      }
    },
    mounted: function () {
      this.init()
    },
    created(){
      console.log("created")
    },
    destroyed(){
      console.log("destroyed")
    }
  }
</script>

<style scoped>
  .header {
    box-sizing: border-box;
    width: 100%;
    min-width: 1440px;
    position: relative;
  }

  .header .header-list {
    position: relative;
    background: #2D2B4C;
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: row;
  }

  .header .list-item {
    /*font-family:FZLTTHK--GBK1-0;*/
    height: 60px;
    line-height: 60px;
    color: #FFFFFF;
    text-align: center;
    flex: 1;
  }

  .header .list-scrollbar {
    margin-left: -50px;
    visibility: hidden;
    position: absolute;
    display: inline-block;
    top: 46px;
    left: 0px;
    background: #1DD1EF;
    height: 8px;
    width: 100px;
    border-radius: 4px;
  }

  .header .list-item span {
    cursor: pointer;
    padding: 15px;
  }
</style>
