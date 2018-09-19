<template>
  <div class="title-label">
    <i class="rzl_bc_lightBlue"/>
    <span class="rzl_bc_lightBlue rzl_fc_white font16">{{title}}</span>
    <i class="rzl_bc_lightBlue"/>
  </div>
</template>

<script>
  export default {
    name: "title-label",
    props: ["title"]
  }
</script>

<style scoped>
  .title-label {
    font-size: 0px;
    display: inline-block;
  }

  .title-label span {
    vertical-align: middle;
    background: #1D2088;
    padding: 6px 8px;
    height: 18px;
    display: inline-block;
    line-height: 18px;
    margin-left: 4px;
    margin-right: 4px;
  }

  .title-label i {
    vertical-align: middle;
    background: #1D2088;
    display: inline-block;
    height: 30px;
    width: 4px;
  }


</style>
