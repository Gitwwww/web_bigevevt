$(function () {
    getUserInfo()
    // 实现退出功能
    $('#btnLoginOut').on('click', function () {
        layer.confirm('确定要退出嘛?', { icon: 3, title: '提示' }, function (index) {
            //1、清除本地缓存
            localStorage.removeItem('token')
            //2、跳转到首页
            location.href = './login.html'
            layer.close(index);
        });
    })
})
//获取用户信息的方法
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: 'http://api-breakingnews-web.itheima.net/my/userinfo',
        // 请求头配置对象
        // 小写！！！ 排错了好久
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            renderAvatar(res.data)
        },
        // 控制用户访问权限
        // 不论成功或者失败，最终都会调用complete回调函数
        // complete: function (res) {
        //     console.log(res);
        //     // 身份认证失败
        //     if (res.responseJSON.status === 1||res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token')
        //             location.href = './login.html'
        //     }
        // }
    })
}
// 渲染头像
function renderAvatar(user) {
    // 一般优先使用nickname
    let name = user.nickname || user.username
    // 设置欢迎文本
    $('.welcome').text(name)
    // 设置头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}
