// 挂载到vue的方法
exports.install = function (Vue, options){
  Vue.directive('title', {
    inserted: function (el, binding) {
      document.title = 'iKnows-' + binding.value
    }
  });
  Vue.prototype.$mConfirm = function (content, buttonText) {
    let app = this.$parent;
    while (1) {
      if (app.$parent) {
        app = app.$parent
      } else {
        break
      }
    }
    app = app.$children[0];
   return app.confirm(content, buttonText)
  };

  Vue.prototype.$mAlert = function (content, buttonText, confirmCallback) {
    let app = this.$parent;
    while (1) {
      if (app.$parent) {
        app = app.$parent
      } else {
        break
      }
    }
    app = app.$children[0];
    app.alert(content, buttonText, confirmCallback)
  };
}
