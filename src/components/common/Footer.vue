<template>
  <div class="footer rzl_bc_darkBlue rzl_fc_white">
    <div class="font16">
      <div class="ueclogo">
        <a target="_blank" href="http://www.ronglian.com"><img  src="../../../static/img/uec.png"/></a>
      </div>
      <div class="otherdesc">
        <ul>
          <li><a href="javascript:void(0);">反馈邮件</a></li>
          <li><a href="javascript:void(0);">服务声明</a></li>
          <li><a href="javascript:void(0);">iNLP核心技术展示</a></li>
        </ul>
      </div>
      <div class="uectech">
        <ul>
          <li>
            <img src="../../../static/img/tech.jpg"/>
          </li>
          <li>
            <div class="uec-tech-top">
            <p>技术咨询：</p>
            <p>座机&nbsp;010-62602000-2032&nbsp;</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="uecbusiness">
      <ul>
          <li>
            <img src="../../../static/img/business.jpg">
          </li>
          <li>
            <div class="uec-tech-top">
            <p>商务咨询：</p>
            <p>座机&nbsp;010-62602000-2018&nbsp;</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer-tech font12">
        <p><a target="_blank" href="http://www.ronglian.com">北京荣之联科技股份有限公司</a>(地址：北京市朝阳区酒仙桥北路甲10号院106号楼荣之联大厦)</p>
        <p>Copyright©2018.UEC Group Co.,Ltd.京ICP备14049550号</p>
    </div>
    <div class="lastMessageBox" v-show="isShow">
      <h3>最新消息</h3>
      <ul>
        <li class="tip" v-html="'您有新的预警消息:<span class='+'red'+'>'+number+'条</span>'"></li>
      </ul>
    </div>
  </div>
</template>
<script>
//{{'您有新的'+number+'条预警消息'}}
import { getLastMessage } from '@/assets/js/api.js'
export default {
  name: "i-footer",
  data() {
    return {
      lastMessage:[],
      isShow:false,
      totalTimer:null,
      number:''
    };
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
          that.isShow = false
        },5000)
      }
    },

    mounted() {
      this.getLastMessage()
    },
    beforeDestroy(){
      clearInterval( this.totalTimer )
    }
};
</script>
<style scoped type="css">
.footer {
  height: 200px;
  display: block;
}
.footer .ueclogo {
  margin-left: 18%;
  width: 10%;
}
.footer .ueclogo img {
  width: 140px;
  height: 80px;
  margin-top: 30px;
}
.footer .otherdesc {
  padding-left: 32%;
  margin-top: -80px;
  width: 10%;

}
.footer .otherdesc a{
  cursor:default
}

.footer .otherdesc ul li {
  padding-bottom: 10px;
}

.footer .uectech {
  margin-left: 45%;
  margin-top: -80px;
}

.footer .uec-tech-top{
  padding-top: 18px;
}
.footer .uectech img {
  width: 80px;
  height: 80px;
}
.footer .uectech ul li {
  float: left;
  margin-left: 10px;
}
.footer .uectech ul li p {
    padding-bottom: 10px;
}
.footer .uecbusiness {
  margin-left: 65%;
}
.footer .uecbusiness img {
  width: 80px;
  height: 80px;
}
.footer .uecbusiness ul li {
  float: left;
  margin-left: 10px;
}
.footer .uecbusiness ul li p {
  padding-bottom: 10px;
}
.footer-tech {
  float: left;
  padding-top: 30px;
  text-align: center;
  width: 100%;
}
.footer a {
  color: #ffffff;
}
.footer p{
  color: #ffffff;
}

.hidden{
  visibility: hidden;
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
    position: fixed;
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
