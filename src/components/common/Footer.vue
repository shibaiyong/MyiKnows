<template>
  <div class="footer rzl_bc_darkBlue rzl_fc_white">
    <div class="font16">
      <div class="ueclogo">
        <a><img  src="../../../static/img/uec.png"/></a>
      </div>
      <div class="otherdesc">
        <ul>
        <li><a href="">服务声明</a></li>
        <li><a href="">iNLP核心技术展示</a></li>
        <li><a href="">反馈邮件</a></li>
        </ul>
      </div>
      <div class="uectech">
        <ul>
          <li>
            <img src="../../../static/img/tech.jpg">
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
        <p>Copyright@2018.UEC Group Co.,Ltd.京ICP备14049550号</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "i-footer",
  data() {
    return {};
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
</style>