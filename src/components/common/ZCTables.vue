<template>
  <div id="zc_tables">

  </div>
</template>

<script>
  export default {
    name: "zc-tables",
    props:{
      data:{type:Array, require: true},
      columnData:{type: Array, require: true},
      options:{type: Object, require: true}
    }
  }
</script>

<style scoped>

  #zc_tables{
    background-color: #fff;
  }

</style>
