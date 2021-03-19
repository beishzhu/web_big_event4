$(function() {
    var layer = layui.layer
    var form = layui.form
        // 获取文章列表
    $.ajax({
        method: "GET",
        url: '/my/article/cates',
        success: function(res) {
            if (res.status !== 0) return layer.msg(res.message)
            var strHtml = template('tpl-cate', res)
            $("[name=cate_id]").html(strHtml)

            // form.render() 一定要记得调用这个方法渲染页面
            form.render()
        }
    })

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4.上传图片按钮默认隐藏
    $('#file').hide()
        // 5.选择封面按钮 模拟促发点击上传图片按钮
    $("#selectBtn").on('click', function() {
        $('#file').click();
    })

    // 6.选择封面后的 change事件
    $('#file').on('change', function(e) {
        console.log(e);
        // 获取用户选择的文件
        var filelist = e.target.files
        if (filelist === 0) return
            //拿到用户选择的文件 将文件转换为路径
        var newImgURL = URL.createObjectURL(filelist[0])
            // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })




    // 状态
    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 发布文章 绑定submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault() //阻止表单默认提交行为
            // 基于form表单快速创建 formData对象
        var fd = new FormData($(this)[0])
        fd.append('state', art_state) //将发布状态追加到fd中
            //  fd.forEach(function(k, v) { console.log(k, v); })
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将裁剪的图片追加到fd中
                fd.append('cover_img', blob)
                    // 发送ajax请求
                publiceArticle(fd)
            })

    })

    function publiceArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交的 FormData格式的数据 必须传递这两个参数
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg(res.message)
                location.href = '../articles/article_list.html'
            }

        })
    }
})