$(function () {
    let layer = layui.layer
    let form = layui.form
    // 获取文章类别
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: 'http://api-breakingnews-web.itheima.net/my/article/cates',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function (res) {
                // 模板渲染
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    let indexAdd = null
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            title: '添加文章分类',
            type: 1,
            area: '500px',
            content: $('#dialog-add').html()
        });
    })

    // 通过代理的形式为form-add表单绑定submit事件。因为此时该表单并未在页面上
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: 'http://api-breakingnews-web.itheima.net/my/article/addcates',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.close(indexAdd)
                    // console.log(1);
                    return layer.msg('添加文章类别失败！')
                }
                initArtCateList()
                layer.msg('添加文章类别成功！')
                layer.close(indexAdd)
            }
        })
    })

    // 同样通过代理来实现点击事件
    let indexEdit = null
    // 给编辑按钮添加点击事件
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            title: '编辑文章分类',
            type: 1,
            area: '500px',
            content: $('#dialog-edit').html()
        });
        // 获取对应书籍的id值
        let id = $(this).attr('data-Id')
        // 发起请求获取对应的数据
        $.ajax({
            type: 'GET',
            url: 'http://api-breakingnews-web.itheima.net/my/article/cates/' + id,
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('啊哦')
                }
                // console.log(res);
                // 表单验证可以快速渲染
                form.val('form-edit', res.data)
            }
        })
    })
    // 通过代理的形式为form-edit表单绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: 'http://api-breakingnews-web.itheima.net/my/article/updatecate',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.close(indexEdit)
                    return layer.msg('修改图书信息失败！')
                }
                layer.msg('修改图书信息成功！')
                initArtCateList()
                layer.close(indexEdit)
            }
        })
    })
    // 通过代理的形式为删除按钮绑定点击事件
    $('body').on('click', '#btn-delete', function () {
        let id = $(this).attr('data-Id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: 'http://api-breakingnews-web.itheima.net/my/article/deletecate/' + id,
                headers: {
                    Authorization: localStorage.getItem('token') || ''
                },
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除图书信息失败！')
                    }
                    layer.msg('删除图书信息成功！')
                    initArtCateList()
                }
            })
            layer.close(index);
        });
    })
})