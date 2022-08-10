$(function () {
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (data) {
    const dt = new Date(data)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m +'-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零函数
  function padZero (n) {
    return n > 9 ? n : '0' + n
  }


  // 定义查询对象 q ，将来请求数据时要将其发送到服务器
  var q = {
    pagenum: 1,
    pagesize: 2,
    cate_id:'',
    state: ''
  }

  initTable()
  initCate()

  // 获取文章列表的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function(res) { 
        if(res.status !== 0){
          return layer.msg('获取文章列表失败！')
        }
        // 使用模板引擎渲染页面数据
        var htmlStr = template('tpl-table' , res)
        $('tbody').html(htmlStr)

        // 渲染分页的方法
        renderPage(res.total)
      }
    })
  }


  // 初始化文章分类的方法
  function initCate () {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if(res.status !== 0) {
          return layer.msg ('获取分类数据失败！')
        }
        // 用模板引擎渲染分类数据
        var htmlStr = template('tpl-cate' , res)
        $('[name=cate_id]').html(htmlStr)
        form.render()
      }
    })
  }

  // 为筛选绑定 submit 事件
  $('#form-search').on('submit' , function(e) {
    e.preventDefault()
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    q.cate_id = cate_id
    q.state = state
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用 laypage.render() 方法渲染分页结构
    laypage.render({
      elem: 'pageBox',  /* 分页容器的id */
      count: total,  /* 总数据条数 */
      limit: q.pagesize,  /* 每页显示几条数据 */
      curr: q.pagenum, /* 设置默认选中的分页 */
      layout: ['count','limit','prev','page','next','skip'],
      limits: [2,3,5,10],
      jump: function (obj , first) {
        // console.log(obj.curr);
        // 把最新的页码值给 q 这个查询参数对象中
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        console.log(first);
        if (!first) {
          initTable()
        }
      }
    })
  }


  // 为删除按钮添加点击事件
  $('tbody').on('click','.btn-delete',function () {
    var len = $('.btn-delete').length

    var id = $(this).attr('data-id')
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if(res.status !== 0) {
            return layer.msg('删除失败！')
          }
          layer.msg('删除成功！')

          // 当数据删除后应该判断这一页还有没有数据
          // 如果没有数据应该将页码数-1再调用initTable
          if(len === 1) {
            // 如果len等于1就等于删完后页面上就没有剩余数据了
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      
      layer.close(index);
    });
  })
})