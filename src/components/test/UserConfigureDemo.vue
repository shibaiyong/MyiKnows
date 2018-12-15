<template>
  <div class="user_configure_demo">
    <UserConfigure :show="true" @save-configure-success="saveConfigureSuccess"></UserConfigure>
  </div>
</template>

<script>
  import UserConfigure from '../common/UserConfigure'

  export default {
    name: "user-configure-demo",
    components: {UserConfigure},

    methods:{
      saveConfigureSuccess(){
        this.$message.success(`保存成功`);

      }
    }

  }
</script>

<style scoped>

  .user_configure_demo {
    height: 500px;
    background-color: #ffffff;
  }
</style>
