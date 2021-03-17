// 每次发送ajax请求前会先调用这个函数，可以用来拼接请求路径
$.ajaxPrefilter(function(options) {
    // console.log(options.url);
    options.url = 'http://ajax.frontend.itheima.net' + options.url
        // console.log(options.url);

    // 统一给所有/my/路径配置请求头
    options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
        // 不轮请求成功还是失败 都会执行这个方法
    options.complete = function(res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.清除token
            localStorage.removeItem('token')
                // 2.跳转到登录页面
            location.href = 'login.html'
        }
    }
})