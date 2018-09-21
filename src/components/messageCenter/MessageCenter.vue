<template>
  <div>
    <div class="top-header">
      <iTop/>
      <iHeader/>
    </div>
    <messageCenterContent class=" rzl_bc_undercoat rzl-contarner" />
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

</style>
