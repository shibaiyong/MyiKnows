<template>
  <div>
    <div class="top-header">
      <iTop/>
      <iHeader @onClickListener="a"
               :items="items"
      />
    </div>
    <div class="rzl-contarner">
      <router-view/>
    </div>
    <IFooter class="footer"></IFooter>
  </div>
</template>

<script>
  import iTop from '@/components/common/Top'
  import iHeader from '@/components/common/Header'
  import IFooter from '@/components/common/Footer';
  import Router from 'vue-router'

  export default {
    name: "test2",
    components: {iTop, iHeader, IFooter, Router},
    data: function () {
      return {
        items: ["首页", "舆情头条", "监测中心", "简报中心"],
        a: () => {
        }
      }
    },
    mounted: function () {
      console.log(1);
      var thiz = this;
      this.a = function (index) {
        if (index == 0) {
          thiz.$router.push("/test/A");
        }
        if (index == 2) {
          thiz.$router.push("/est/C");
        }
        if (index == 1) {
          thiz.$router.push("/test/B");
        }
      }
    },
  }
</script>

<style scoped>

</style>
