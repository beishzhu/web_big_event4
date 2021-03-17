$(function() {
    getuserInfo()
})

// 发送请求获取用户信息
function getuserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            console.log(res);
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败')
            renderAvatar(res.data)
        },
        // 不轮请求成功还是失败 都会执行这个方法
        // complete: function(res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.清除token
        //         localStorage.removeItem('token')
        //             // 2.跳转到登录页面
        //         location.href = 'login.html'
        //     }
        // }
    })
}

// 渲染用户头像和名称
function renderAvatar(data) {
    // 渲染左侧用户昵称nickname
    var name = data.nickname || data.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 渲染用户头像
        // 1. 如果有头像就渲染头像图片
    if (data.user_pic !== null) {
        $('.layui-nav-img').attr('src', data.user_pic).show();
        $('.test-avatar').hide()
    } else {
        // 2. 如果没有就渲染一个默认头像
        var first = name[0].toUpperCase() //将第一个字母转换为大写
        $('.layui-nav-img').hide();
        $('.test-avatar').html(first).show()
    }
}

// 退出功能
$('#btnlogout').on('click', function() {
    var layer = layui.layer
    layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function(index) {
        // 1.清除本地token
        localStorage.removeItem('token')
            // 2.跳转到登录页
        location.href = 'login.html'
        layer.close(index);
    });
})