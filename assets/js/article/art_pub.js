$(function () {
  var layer = layui.layer
  var form = layui.form

  initCate()

  // 初始化富文本编辑器
  initEditor()


  // 定义加载文章分类的方法
  function initCate () {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !==0) {
          return layer.msg('初始化文章分类失败！')
        }
        // 调用模板引擎渲染分类菜单
        var htmlStr = template('tpl-cate' , res)
        $('[name=cate_id]').html(htmlStr)
        // 一定要记得调用 form.render() 方法渲染表单
        form.render()
      }
    })
  }

   // 1. 初始化图片裁剪器
   var $image = $('#image')
  
   // 2. 裁剪选项
   var options = {
     aspectRatio: 400 / 280,
     preview: '.img-preview'
   }
   
   // 3. 初始化裁剪区域
   $image.cropper(options)

  //  为选择封面按钮绑定点击事件
  $('#btnChooseImage').on('click' , function () {
    $('#coverFile').click()
  })

  // 监听coverFile的change事件
  $('#coverFile').on('change' , function (e) {
    var file = e.target.files[0]
    if(file.length === 0) {
      return 
    }
    var newImgURL = URL.createObjectURL(file)
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
  })

  // 定义文章状态
  var art_state = '已发布'

  // 为存为草稿绑定点击事件
  $('#btnSave2').on('click' , function () {
    art_state = '草稿'
  })

  // 为表单绑定submit事件
  $('#form-pub').on('submit' , function (e) {
    e.preventDefault()
    // 基于form表单创建一个FormData对象
    var fd = new FormData($(this)[0])

    fd.append('state' , art_state)
    
    $image
    .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
      width: 400,
      height: 280
    })
    .toBlob(function(blob) {       
      // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      fd.append('cover_img' , blob)
      // 调用发表文章的方法
      publishArticle(fd)
    })
  })

  // 发布文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      // 如果向服务器提交的是 formdata 属性的数据则必须加以下配置
      contentType: false,
      processData: false,
      success: function (res) {
        if(res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        location.href = '/article/art_list.html'
      }
    })
  }
})