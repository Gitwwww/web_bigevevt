$(function () {
    $('#link_reg').on('click', function () {
        $('.reg_box').show()
        $('.login_box').hide()
    })
    $('#link_login').on('click', function () {
        $('.reg_box').hide()
        $('.login_box').show()
    })
    // 只要导入了layui.js就会有layui对象
    // layer同上
    let form = layui.form
    let layer = layui.layer
    // 规定密码填写规则
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ]
        // 确认密码栏
        , repass: function (value) { //value形参是repassword的值
            let pwd = $('.reg_box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        let data = { username: $('.reg_box [name=username]').val(), password: $('.reg_box [name=password]').val() }
        $.post('http://www.liulongbin.top:3007/api/reguser', data, function (res) {
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message);
            }
            layer.msg(res.message);
            $('#link_login').click()
        })
    })
    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault()
        $.ajax({
            url: 'http://www.liulongbin.top:3007/api/login',
            method: 'POST',
            // 利用jquery的serialize方法快速获取表单的值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('登录成功！')
                // 将登录成功获得的token字符串保存到localStorage中
                localStorage.setItem('token', res.token)
                location.href = './index.html'
            }
        })
    })
})