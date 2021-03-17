$(function() {
    var layer = layui.layer
    var from = layui.form
    getArticleLists()

    // 渲染文章列表
    function getArticleLists() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layer.msg(res.message);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 添加文章分类按钮
    var indexAdd = null;
    $('#btnAdd').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#addArticleListDialog').html()
        });
    })

    //通过代理形式为表单绑定 submit事件 因为表单内容是动态添加的，只能使用种方式
    $('body').on('submit', '#checkAdd', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault()
            // 向服务器发送添加分类文章
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                getArticleLists()
                layer.msg(res.message)
                    // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    });

    //通过代理形式为表单绑定事件 编辑文章列表
    // 编辑文章分类按钮
    var indexEdit = null;
    $('body').on('click', '#editBtn', function() {
        // console.log(1);
        indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '编辑文章分类',
                content: $('#editArticleListDialog').html()
            })
            // 通过自定义属性获取分类文章id
        var id = $(this).attr('data-id')
            // console.log(id);
            // 发送ajax请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                    // console.log(res);
                from.val("EditFrom", res.data)
            }
        })
    })

    // 通过代理形式 处理确认修改按钮 提交修改内容 更新文章分类的数据
    $('body').on('submit', '#EditFrom', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                getArticleLists()
                    // 关闭修改窗口
                layer.close(indexEdit)
                layer.msg(res.message)
            }
        })
    })

    // 通过代理形式 根据id 删除文章列表
    $('body').on('click', '.deleteBtn', function() {
        var id = $(this).attr('data-id');
        // 确认是否删除弹窗
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg(res.message)

                }
            })

            layer.close(index);
            getArticleLists()
        });

    })
})