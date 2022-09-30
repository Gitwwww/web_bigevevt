$(function () {
    let form = layui.form

    // 初始化富文本编辑器
    initEditor()
    // 获取文章类别
    initCate()
    function initCate() {
        $.ajax({
            type: 'GET',
            url: 'http://api-breakingnews-web.itheima.net/my/article/cates',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章类别失败！')
                }
                // console.log(res);
                let htmlStr = template('tpl_name', res)
                $('[name=cate_id]').html(htmlStr)
                // 调用form.render方法来重新渲染
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
    $('#btnChooseImage').on('click', function () {
        $('#cover').click()
    })
    //建通cover的change事件，获取用户选择的文件列表
    $('#cover').on('change', function (e) {
        // console.log(e);
        let files = e.target.files
        // console.log(files);
        // 如果没有选择 就返回
        if (files.length === 0) {
            return
        }
        let file = files[0]
        let newImageUrl = URL.createObjectURL(file)
        // console.log(newImageUrl);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImageUrl)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    // 定义初始文章的发布状态
    let art_state = '已发布'
    // 为存为草稿绑定点击事件
    $('#btnSave').on('click', function () {
        art_state = '草稿'
    })
    $('#form_pub').on('submit', function (e) {
        //1、阻止默认提交行为
        e.preventDefault()
        //2.基于form表单 快速创建一个FormData对象
        let fd = new FormData($(this)[0])
        //3.追加文章的发布状态
        fd.append('state', art_state)
        // fd.forEach(function (v, k) {
        //     console.log(k, v);
        // })

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                $.ajax({
                    type: 'POST',
                    url: 'http://api-breakingnews-web.itheima.net/my/article/add',
                    headers: {
                        Authorization: localStorage.getItem('token') || ''
                    },
                    data: fd,
                    // 不修改 Content-Type 属性，使用 FormData 默认的 Content-Type 值
                    contentType: false,
                    // 不对 FormData 中的数据进行 url 编码，而是将 FormData 数据原样发送到服务器
                    processData: false,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layui.layer.msg('发布文章失败！')
                        }
                        layui.layer.msg('发布文章成功！')
                        console.log('发布文章成功！');
                        location.href = './art_list.html'
                    }
                })
            })

    })
})