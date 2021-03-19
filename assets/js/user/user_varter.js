$(function() {
    var layer = layui.layer
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

    // 上传图片
    $('#file').hide()
    $('#uploadvarter').on('click', function() {
        $('#file').click()
            // console.log(1);
    })

    // 选择图片change事件
    $("#file").on('change', function(e) {
        // console.log(e);
        // 获取用户选择的文件
        var filelist = e.target.files
            // console.log(filelist);
        if (filelist.length === 0) return layer.msg('请选择文件! ') //这个提示要先上传过一次图片才可以出现
            // 1.拿到用户选择的文件
        var file = filelist[0]
            // 2.将文件转换为路径
        var imgURL = URL.createObjectURL(file)
            // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //点击确定 更新图片头像
    $('#btnUpload').on('click', function() {
        // 1. 要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 2.调用接口把图片上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                window.parent.getuserInfo();
            }
        })
    })
})