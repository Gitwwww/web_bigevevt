$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    // 定义一个查询的参数对象
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据
        cate_id: '', //文章分类的Id
        state: '' //文章的发布状态
    }
    initTable()
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            type: 'GET',
            url: 'http://api-breakingnews-web.itheima.net/my/article/list',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                console.log(res);
                console.log(res.data);
                // 模板渲染
                let htmlStr = template('tpl-artTable', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    // 时间过滤器
    template.defaults.imports.dataFormat = function (data) { // data 作形参
        const dt = new Date(data)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    // 定义补零的方法
    function padZero(data) {
        return data > 9 ? data : '0' + data
    }

    initCate()
    //所有分类的初始化
    function initCate() {
        $.ajax({
            type: 'GET',
            url: 'http://api-breakingnews-web.itheima.net/my/article/cates',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败!')
                }
                // 模板渲染
                // 此时并没有成功渲染出来（因为我们是动态拼接，所以出不来）
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 重新渲染就可以了
                form.render()
            }
        })
    }
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中cate_id和state的值并重新赋值
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        // 根据最新的筛选条件，重新渲染
        initTable()
    })

    // 渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //指定容器
            count: total, // 总数居条数，initTable方法中已经返回了total
            limit: q.pagesize,
            curr: q.pagenum,//设置默认被选中的分页
            limits: [2, 3, 4, 5],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 触发jump回调有两种方法：
            // 1、点击页码会触发
            // 2、调用 laypage.render 会触发
            jump: function (obj, first) {
                //  obj包含了当前分页的所有参数
                q.pagenum = obj.curr //把最新的查询页码值赋值给页码q
                q.pagesize = obj.limit //把最新的条目数赋值给pagesize(切换条目也会触发jump)
                // initTable()//此时把initTable放这里会直接导致死循环 原因： initTable和renderPage一直在互相调用
                if (!first) {
                    initTable()
                }
            }
        })
    }
    $('tbody').on('click', '#btn-delete', function () {
        let id = $(this).attr('data-Id')
        // 获取页面上删除按钮的个数,以便后续的换页
        let len = $('#btn-delete').length
        layer.confirm('确定删除该文章?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: 'http://api-breakingnews-web.itheima.net/my/article/delete/' + id,
                headers: {
                    Authorization: localStorage.getItem('token') || ''
                },
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章列表失败!')
                    }
                    layer.msg('删除文章列表成功!')
                    if (len === 1) {
                        // 此时 len === 1 ，则删除之后要进行换页
                        // 换页之前还要判断页码是否是第一页 ， 只有非第一页可以换页
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });

    })
})