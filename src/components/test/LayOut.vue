<template>
  <!-- 定比例布局示例 -->
<div class="demo-wrapper">
  <div class="box1">
    <p class="p1">p1宽高比：4:3</p>
  </div>
  <div class="box2">
    <p class="p2">p2宽高比：4:3</p>
  </div>
</div>
</template>
<script>
export default {
  name: 'i-layout',
  data () {
    return {

    }
  }
}
</script>
<style scoped type="css">
/*原理：将该元素的padding-top或padding-bottom设置成百分比，此时该元素的left、right、top、bottom都
  会以父元素的width为参照物，此时需要将该元素的height设置为0，容器内的元素均采用绝对定位方式，否则元素
  内容会被挤出容器(造成内容溢出)
*/
.demo-wrapper{
  width: 100%;
  height: 100%;
}
/*左侧容器：占50%宽度*/
.box1{
  width: 50%;
  background-color: rgb(110, 107, 107);
  position: relative;
  float: left;
}
/*右侧容器：占50%宽度*/
.box2{
  width: 50%;
  background-color: green;
  position: relative;
  float: right;
}
/*4:3：计算方式：父元素宽度*p1的宽度100%*高度的取值(3/4) 算出：该元素的height设置为0*/
.box1>.p1{
width: 100%;
height: 0;
padding-top: 75%;
background-color: red;
position: absolute;
text-align: center;
}
/*4:3：计算方式：父元素宽度*p2的宽度100%*高度的取值(3/4) 算出：该元素的height设置为0*/
.box2>.p2{
  position: absolute;
  width: 100%;
  height: 0;
  padding-top: 75%;
  background-color: yellow;
}
</style>