$(function () {
  var form = layui.form
  var layer = layui.layer

  form.verify ({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1~6个字符之间！'
      }
    }
  })


  initUserInfo()

  // 初始化用户信息
  function initUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    success: function(res) {
      if (res.status !== 0) {
        return layer.msg('获取用户信息失败！')
      }
      console.log(res);
      // 调用 form.val() 快速为表单赋值
      form.val('formUserInfo', res.data)
    }
  })
  }

  // 重置表单数据
  $('#btnReset').on('click' , function(e) {
    e.preventDefault()
    initUserInfo()
  })

  // 提交修改
  $('.layui-form').on('submit' , function (e) {
    e.preventDefault()
    $.ajax ({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('提交数据失败！')
        }
        layer.msg('更新数据成功！')
        // 调用父元素页面中的方法，重新渲染用户头像和用户信息
        window.parent.getUserInfo()
      }
    })
  })
})