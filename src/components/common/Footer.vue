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
        <p>Copyright©2018.UEC Group Co.,Ltd.京ICP备14049550号-7</p>
    </div>
    <div class="lastMessageBox" v-show="isShow">
      <h3>
        <span>最新消息</span>
        <span class="configure_close font16" @click="closeBtn()"><i data-v-37a846a7="" class="el-icon-close"></i></span>
      </h3>
      <ul>
        <!--<li class="tip" v-html="'您有新的预警消息:<span class='+'red'+'>'+number+'条</span>'"></li>-->
        <li @click="goPlanList(lastMessage.planId)">
          <!--方案名称：您有3条预警消息！-->
          <!--<span class='red title'>{{item.name}}</span>有新的预警消息<span class='red'>{{item.num}}条</span>-->
          <span class='red'>{{lastMessage.planName}}</span>:有<span class='red'>{{lastMessage.count}}条</span>预警消息！
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

//{{'您有新的'+number+'条预警消息'}}
import { getLastMessage,url } from '@/assets/js/api.js'
export default {
  name: "i-footer",
  data() {
    return {
      lastMessage:[],
      isShow:false,
      totalTimer:null,
      number:'',
      messageList:[],
    };
  },
    methods:{
      // 获取预警列表
      getLastMessage(){
        let that = this;
        this.totalTimer = setInterval(function(){
          getLastMessage().then( res => {
            if(res.code == '200'){
              if (res.data != ''){
                that.messageList = res.data;
                that.listShow();
              }
            }
          })
        },180*1000)

      },
      //关闭弹窗
      closeBtn(){
        this.isShow = false;
      },
      //跳转方案列表
      goPlanList(id){
        let userName = this.$iknowsUtil.getUserName();
        window.open("/center/monitorresults/"+id+"/"+userName);
      },
      //自动关闭
      timeOutShow(thiz){
        setTimeout(function(){
          thiz.isShow = false
        },3000)
      },
      //webSocket长连接
      webSocket(){
        let ws;
        let wsPath = url;
        let userName = this.$iknowsUtil.getUserName();
        var thiz = this;
        var time;
        let  token = localStorage.getItem('iKnows'+userName+'Token');
        if(window.WebSocket){
          wsPath +="/websocket/h5?token=" + token;
          wsPath = wsPath.replace("http","ws");
          ws = new WebSocket(wsPath);
        }else{
          // 不支持WebSocket
          this.getLastMessage();
        }
        //发送心跳
        ws.onopen = function () {
          ws.send("iKnows");
          time = setInterval(function(){
            ws.send("iKnows");
          },30*1000)
        };
        //接收数据
        ws.onmessage = function (event) {
          if (event.data != '' && event.data !='iKnows received at server' ){
            thiz.messageList = JSON.parse(event.data);
            console.log( thiz.messageList);
            thiz.$options.methods.listShow( thiz.messageList,thiz);
          }

        };
        //关闭链接停止发送心跳
        ws.onclose = function (event) {
          // console.log('关闭')
          clearInterval(time);
        };
        // 路由跳转时结束websocket链接
        this.over = () => {
          ws.close();
        }
      },
      // 列表轮询
      listShow: function (v,thiz) {
        var list = v;
        console.log('-------------------');
        var  messageBox = list;
        // thiz.lastMessage = messageBox[0];
        // thiz.isShow = true;
        var time = setInterval(function () {
          thiz.isShow = false;
          if (messageBox.length > 0){
            thiz.isShow = true;
            thiz.lastMessage = messageBox[0];
            list =messageBox.shift();
            thiz.$options.methods.timeOutShow(thiz)
          }else {
            clearInterval(time);
            thiz.isShow = false
          }
        },4000);
      },
    },
    created() {
      this.webSocket();
    },
    mounted() {
      let userName = this.$iknowsUtil.getUserName();
      let token = localStorage.getItem('iKnows'+userName+'Token');
      // if(!!token){
      //   this.getLastMessage()
      // };
    },

    beforeDestroy(){
      clearInterval( this.totalTimer );
      this.over()
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
    /*height: 100%;*/
    color:#444;
    margin-top: 20px;
    width: 100%;
    height: 75px;
    overflow: hidden;
  }
  .lastMessageBox li{
    width:100%;
    padding:20px 15px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .lastMessageBox li .title{
    display: inline-block;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

  }
  .tip{
    text-align: center;
    margin-top:14px;
  }
.configure_close{
  width: 36px;
  height: 36px;
  border-radius: 50%;
  /*background:rgba(51, 51, 51, 0.35);*/
  float: right;
  cursor: pointer;
  font-size: 25px;
  text-align: center;
  line-height: 36px;
  color: #ffffff;
  margin-top: 8px;
  margin-right: 16px;
}
</style>
