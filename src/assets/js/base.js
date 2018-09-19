// 挂载到vue的方法
exports.install = function (Vue, options){
  Vue.directive('title', {
    inserted: function (el, binding) {
      document.title = 'iKnows-' + binding.value
    }
  });
}