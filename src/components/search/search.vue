<template>
    <div class="search">
        <div class="top-header">
            <ITop></ITop>
            <IHeader  :items="items" ></IHeader>
        </div>
        <Isearch  :TopNews='mes' :isActivee='mess'></Isearch>
        <IFooter></IFooter>
    </div>
</template>

<script>
import ITop from '@/components/common/Top';
import IHeader from '@/components/common/Header';
import IFooter from '@/components/common/Footer';
import Isearch from './searchcontent'
export default {
    name: "search",
    components: {ITop, IHeader, IFooter,Isearch},
    data() {
    return {
      items:["首页","舆情头条","监测中心","简报中心"],
      mes:'',//搜索内容
      mess:0//搜索tab
    }
  },
  mounted(){
  var alertLevel=[
            {
                name:'全部',
                alertLevel:1
            },{
                name:'网媒',
                alertLevel:6
            },{
                name:'微信',
                alertLevel:8
            },{
                name:'微博',
                alertLevel:7
            },{
                name:'APP',
                alertLevel:9
            },{
                name:'全部',
                alertLevel:1
            }
        ],tabb;
        alertLevel.map(v=>{
          if(v.name===this.$route.query.tab){tabb = v.alertLevel}
        })
      
      this.mes = this.$route.query.message;
      this.mess = tabb
  }
}
</script>

