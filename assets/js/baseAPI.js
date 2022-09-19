$.ajaxPrefilter((options) => {
    // options.url = 'http://地址' + options.url;

    // // 配置ajax请求头 当请求地址为/my的时候添加请求头
    // if (options.url.indexOf('/my/') != -1) {
    //     options.headers = {
    //         Authorization: localStorage.getItem('token') || ''
    //     }
    // }

    // 无论请求成功还是失败，最终调用complete回调
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message == '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = './login.html';
        }
    }
})