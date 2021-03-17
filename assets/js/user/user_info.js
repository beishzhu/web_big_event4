$(function() {
    // 表单验证
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) return '用户昵称长度为1 ~ 6 个字符之间'
        }
    });
    inituserInfo()


    // 初始化表单用户信息
    function inituserInfo() {
        // 发送请求获取用户信息
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取用户信息失败')
                console.log(res);
                // 快速渲染表单内容 使用layui 提供的方式
                form.val("userinfo", res.data)
            }

        })
    }

    // 重置功能
    $('#btnReset').on('click', function(e) {
        // 阻止表单默认的行为
        e.preventDefault()
            // 重新调用初始化表单方法
        inituserInfo()
    })


    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
            // 发起 ajax 数据请求
            // console.log($(this).serialize());
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                    // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                    // console.log(window.parent);
                window.parent.getuserInfo();
            }
        })
    })
})