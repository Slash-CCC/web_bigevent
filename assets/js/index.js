$(function () {
  // 调用 getUserInfo 获取用户信息
  getUserInfo()


  var layer = layui.layer

  // 点击按钮实现退出功能
  $('#btnLogout').on('click' , function () {
    // 提示是否退出
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
      // 清空本地存储中的token
      localStorage.removeItem('token')
      // 跳转到登录页
      location.href = '/login.html'

      // 关闭弹出框
      layer.close(index);
    });
  })
})

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url:'/my/userinfo',
    // 请求头配置对象
    // headers:{
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function(res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！')
      }
      // 调用 renderAvatar 渲染用户头像
      renderAvatar(res.data)
    },
    // complete: function (res) {
    //   // 在complete回调函数中可以使用 res.responseJSON 拿到服务器响应回来的数据
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     // 强制清空token
    //     localStorage.removeItem('token')
    //     // 强制跳转至登录页
    //     location.href = '/login.html'
    //   }
    // }
  })
}

// 渲染头像
function renderAvatar(user) {
  // 获取用户名称
  var name = user.nickname || user.username
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 按需渲染头像
  if (user.user_pic !== null) {
    $('.layui-nav-img').attr('src' , user.user_pic).show()
    $('.text-avatar').hide()
  }
  else {
    $('.layui-nav-img').hide()
    // 将第一个字大写提出来
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}