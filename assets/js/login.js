// 点击切换注册登录
$(function () {
  $('.login-box a').on('click' , function() {
    $('.reg-box').show()
    $('.login-box').hide()
  })

  $('.reg-box a').on('click' , function() {
    $('.login-box').show()
    $('.reg-box').hide()
  })
})

// 自定义表单验证属性
$(function () {
  var form = layui.form
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    repwd:function(value) {
      var pwd = $('.reg-box [name=password]').val()
      if (pwd != value) {
        return '两次密码不一致'
      }
    }
  })
})

// 为登录和注册按钮添加ajax请求
$(function () {
  var layer = layui.layer
  // 注册模块
  $('#form_reg').on('submit' , function(e){
    e.preventDefault()
    $.post(
      '/api/reguser', 
      {username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()}, function(res) {
        if (res.status!=0) {
          return layer.msg(res.message)
        }
        layer.msg('注册成功！')
        $('#form_reg .on-right').click()
    })
  })

  // 登录模块
  $('#from_login').on('submit' , function(e) {
    e.preventDefault()
    $.ajax({
      url:'/api/login',
      method: 'post',
      // 快速获取表单元素
      data: $(this).serialize(),
      success: function(res) {
        if (res.status != 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登陆成功！')
        // 将token值存到localStorage中
        localStorage.setItem('token',res.token)
        location.href='/index.html'
      }

    })
  })
})