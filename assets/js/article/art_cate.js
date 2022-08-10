$(function () {
  var layer = layui.layer
  var form = layui.form
  initArtCateList()

  // 获取文章分类列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        // console.log(res);
        var htmlStr = template('tpl-table' , res)
        $('tbody').html(htmlStr)
      }
    })
  }


  // 为添加类别按钮添加点击事件
  var indexAdd = null
  $('#btnAddCate').on('click' , function () {
    indexAdd = layer.open({
      // 设置弹出层类型
      type: 1,
      // 设置宽高
      area: ['500px' , '250px'],
      title: '添加文件分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过事件委托为 form-add 添加submit事件
  $('body').on('submit' , '#form-add' , function(e) {
    e.preventDefault()
    $.ajax ({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        initArtCateList()
        layer.msg('新增分类成功！')
        // 根据索引关闭弹出层
        layer.close(indexAdd)
      }
    })
  })

  // 为编辑按钮添加点击事件
  var indexEdit = null
  $('tbody').on('click' , '.btn-edit' ,function() {
    // 弹出层
    indexEdit = layer.open({
      // 设置弹出层类型
      type: 1,
      // 设置宽高
      area: ['500px' , '250px'],
      title: '修改文件分类',
      content: $('#dialog-edit').html()
    })

    // console.log(indexEdit);
    var id = $(this).attr('data-id')
    // console.log(id);
    $.ajax ({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit' , res.data)
      }
    })
  })


  // 为修改表单绑定 submit 事件
  $('body').on('submit' , '#form-edit' , function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url:'/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！')
        }
        layer.msg('更新分类数据成功！')
        layer.close(indexEdit)
        initArtCateList()
      }
    })
  })

  // 为删除按钮绑定点击事件
  $('tbody').on('click' , '.btn-delete' , function () {
    var id = $(this).attr('data-id')
    // 提示是否删除
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败！')
          }
          layer.msg('删除成功！')
          layer.close(index)
          initArtCateList()
        }
      })
    })
  })
})