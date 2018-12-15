<template>
<div class="userview">
    <div class="top-header">
      <ITop></ITop>
      <IHeader v-bind:items="items"></IHeader>
    </div>
    <div class="rzl-contarner rzl_bc_undercoat wrapcontent">
    <IUserViewContent></IUserViewContent>
    </div>
    <IFoot></IFoot>
</div>
</template>
<script>
import ITop from "@/components/common/Top.vue";
import IHeader from '@/components/common/Header.vue';
import IUserViewContent from "@/components/user/UserViewContent.vue";
import IFoot from "@/components/common/Footer.vue";
export default {
    name:"userview",
    components:{ITop,IHeader,IUserViewContent,IFoot},
    data(){
        return {
            items:['首页','舆情头条','检测中心','简报中心']
        };
    }
}
</script>
<style scoped type="css">
.userview{
    height: 100%;
}
.userview .wrapcontent{
    
    padding-top: 20px;
    padding-bottom: 20px;
}
</style>


