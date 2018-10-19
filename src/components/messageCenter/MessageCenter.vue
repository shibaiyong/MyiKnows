<template>
  <div class="body-box">
    <div class="top-header">
      <iTop/>
      <iHeader/>
    </div>
    <messageCenterContent  :parentHeight="height"  id="messageContentBox" class=" rzl_bc_undercoat rzl-contarner content"/>
    <IFooter class="footer"/>
    
  </div>

</template>

<script>
  import iTop from '@/components/common/Top'
  import iHeader from '@/components/common/Header'
  import titleLabel from '@/components/common/TitleLabel'
  import messageCenterContent from '@/components/messageCenter/MessageCenterContent'
  import dataUtil from '../../assets/js/dataUtlis'
  import IFooter from '@/components/common/Footer'
  import { getLastMessage } from '@/assets/js/api.js'

  export default {
    name: "message-center",
    components: {iTop, iHeader, titleLabel, dataUtil, messageCenterContent, IFooter},
    data() {
      return {
        height: 0,
        lastMessage:[],
        isShow:false,
        totalTimer:null,
        number:''
      }
    },
    created(){
      getLastMessage().then( res => {
        if(res.code == '200'){
          this.lastMessage = res.data
          let len = res.data.length
          this.number = len
          if(len != 0){
            this.isShow = true
          }else{
            this.isShow = false
          }
          this.timeOutShow()
        }
      })
    },
    methods:{
      getLastMessage(){
        let that = this
        this.totalTimer = setInterval(function(){
          getLastMessage().then( res => {
            if(res.code == '200'){
              this.lastMessage = res.data;
              let len = res.data.length
              this.number = len
              if(len != 0){
                this.isShow = true
              }else{
                this.isShow = false
              }
              that.timeOutShow()
            }
          })
        },300*1000)
        
      },
      timeOutShow(){
        let that = this
        setTimeout(function(){
          that.isShow = true
        },5000)
      }
    },
    
    mounted() {
      this.height = document.getElementById("messageContentBox").offsetHeight
      this.getLastMessage()
    },
    beforeDestroy(){
      clearInterval( this.totalTimer )
    }

  }
</script>

<style scoped>
  .body-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100%;
  }

  .content {
    flex: 1;
  }
  .lastMessageBox h3{
    font-size: 20px;
    font-weight:bold;
    background:#2D2B4C;
    line-height: 50px;
    padding-left:15px;
    box-sizing: border-box
  }

  .lastMessageBox{
    width:300px;
    height:180px;
    position: absolute;
    bottom:0;
    right:2px;
    box-sizing: border-box;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0px 0px 4px 2px #eee;
    color:white;
    background:white
  }
  
  .lastMessageBox ul{
    background:white;
    font-family: '黑体';
    height: 100%;
    color:#444
  }
  .lastMessageBox li{
    width:100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding:10px 15px;
    box-sizing: border-box
  }
  .tip{
    text-align: center;
    margin-top:14px;
  }
</style>
