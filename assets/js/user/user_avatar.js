$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    // 为文件选择绑定change事件
    $('#file').on('change', function (e) {
        // console.log(e);
        let files = e.target.files
        // console.log(files);
        if (files.length === 0) {
            return layui.layer.msg('请选择图片！')
        }
        let file = files[0]
        // 获取图片的url
        let imgUrl = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgUrl)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    $('#btnUpload').on('click', function () {
        //拿到裁剪后的图片
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: 'POST',
            url: 'http://www.liulongbin.top:3007/my/update/avatar',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('上传头像失败！')
                }
                layui.layer.msg('上传头像成功！')
                window.parent.getUserInfo()
            }
        })
    })

})