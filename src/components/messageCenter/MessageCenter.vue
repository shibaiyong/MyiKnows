<template>
  <div>
    <div class="top-header">
      <iTop/>
      <iHeader/>
    </div>
    <messageCenterContent class="content rzl_bc_undercoat" />
    <IFooter/>
  </div>

</template>

<script>
  import iTop from '@/components/common/Top'
  import iHeader from '@/components/common/Header'
  import titleLabel from '@/components/common/TitleLabel'
  import messageCenterContent from '@/components/messageCenter/MessageCenterContent'
  import dataUtil from '../../assets/js/dataUtlis'
  import IFooter from '@/components/common/Footer';

  export default {
    name: "message-center",
    components: {iTop, iHeader, titleLabel, dataUtil, messageCenterContent, IFooter},

  }
</script>

<style scoped>
  .content {
    padding: 20px 80px 40px;
    min-width: 1440px;
    box-sizing: border-box;
  }
</style>
