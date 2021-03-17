$(function() {
    var form = layui.form
    var layer = layui.layer
        // 添加密码校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码长度必须6到12位，且不能出现空格'],
        newPwd: function(value) {
            if (value === $('[name="oldPwd"]').val()) return '新密码与原密码不能相同'
        },
        rePwd: function(value) {
            if (value !== $('[name="newPwd"]').val()) return '新密码和确认密码不一致 !'
        }
    })

    // 提交修改密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                    // 清空表单内容  先转换为dom对象
                $('.layui-form')[0].reset()
            }
        })
    })
})