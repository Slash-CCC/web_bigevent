// 注意：每次调用 $.get() $.post() 或 $.ajax() 时会先调用
// ajaxPrefilter() 这个函数
// 在这个函数中，可以拿到我们ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  // 在真正发起ajax请求之前先拼接请求的路径
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url
  console.log(options.url);
})