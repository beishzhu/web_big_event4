$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 文章列表查询参数
    var query = {
        pagenum: 1, //文章列表默认显示第一页
        pagesize: 2,
        cate_id: '', //文章分类id
        state: '' //文章发布状态
    }
    getArticleLIst()
    getState()

    // 时间格式化
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }


    // 时间补0
    function padZero(p) {
        return p > 9 ? p : '0' + p
    }

    // 获取文章列表
    function getArticleLIst() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: query,
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                console.log(res);
                // 调用模板
                var strHtml = template('tpl-list', res);
                $('tbody').html(strHtml)
                    // 渲染分页
                if (res.total < 1) {
                    $('#pageBox').hide()
                }
                renderPage(res.total)


            }
        })

    }
    // 获取文章状态
    function getState() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message)
                    // 调用模板引擎渲染文章状态
                var strHtml = template('tpl-state', res)
                console.log(strHtml);
                $("[name=cate_id]").html(strHtml)
                    // 重新渲染表单结构
                form.render();
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#search-btn').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        query.cate_id = cate_id
        query.state = state

        // 根据最新的筛选条件从新渲染表格数据
        getArticleLIst()
    })

    // 分页
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: query.pagesize,
            curr: query.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function(obj, first) {
                console.log(obj.curr);
                query.pagenum = obj.curr
                query.pagesize = obj.limit
                if (!first) getArticleLIst()
            }
        })
    }

    // 删除文章 通过动态方式去删除
    $('body').on('click', '.delete-btn', function() {
        // 当前页面删除按钮的个数
        var len = $('.delete-btn').length
        console.log(len);
        var id = $(this).attr('data-id')

        // 询问用户是否要删除
        layer.confirm('确定要删除文章吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg(res.message)
                    layer.msg(res.message)
                        // 判断当前页删除按钮是否等于1 如果等于1 就让当前的页码值减1
                    if (len === 1) {
                        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1
                    }


                    getArticleLIst()
                }
            })

            layer.close(index);
        });
    })

})