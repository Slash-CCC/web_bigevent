// 注意：每次调用 $.get() $.post() 或 $.ajax() 时会先调用
// ajaxPrefilter() 这个函数
// 在这个函数中，可以拿到我们ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  // 在真正发起ajax请求之前先拼接请求的路径
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url

  // 统一为有权限的接口设置 header 请求头
  if (options.url.indexOf('/my/') !== -1){
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
      }
  }


  // 统一挂载 complete 回调函数
  options.complete = function (res) {
      // 在complete回调函数中可以使用 res.responseJSON 拿到服务器响应回来的数据
      if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        // 强制清空token
        localStorage.removeItem('token')
        // 强制跳转至登录页
        location.href = '/login.html'
      }
    }
 
})