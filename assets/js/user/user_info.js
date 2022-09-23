$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function (value) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'cnm' || value === 'rnm') {
                alert('用户名不能为敏感词');
                return true;
            }
        }
    })
    changeUserInfo()

    function changeUserInfo() {
        $.ajax({
            type: 'GET',
            url: 'http://www.liulongbin.top:3007/my/userinfo',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res.data);
                // 表单快速赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 实现重置功能
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        // 恢复到最初的模样
        changeUserInfo()
    })

    // 修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: 'http://www.liulongbin.top:3007/my/userinfo',
            headers: {
                Authorization: localStorage.getItem('token') || ''
            },
            // 快速获取表单的值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改信息失败！')
                }
                layui.layer.msg('修改信息成功！')
                // 调用父页面中的方法,重新渲染用户的头像和用户的信息
                // 在子页面中调用父页面的函数
                window.parent.getUserInfo()
            }
        })
    })
})
