$(function () {
  // 点击“去注册账号”
  $('#link_reg').on('click', function () {
    $('.login').hide();
    $('.regist').show();
  });
  // 点击“去登录”
  $('#link_login').on('click', function () {
    $('.login').show();
    $('.regist').hide();
  });

  // 自定义登录校验规则
  var form = layui.form
  var layer = layui.layer
  form.verify({
    pwd: [
      /^[\S]{6,12}$/,
      '密码必须6到12位，且不能出现空格'],
    // 校验两次密码输入是否一致
    repwd: function (value) {
      var pwd = $('.regist [name=password]').val();
      if (pwd != value) return '两次输入密码不一致'
    }
  });

  // 监听注册用户表单的监听事件
  $('#reg_username').submit(function (e) {
    //1 阻止表单的默认提交行为
    e.preventDefault();
    // 2.发送请求注册用户
    var data = {
      username: $('#reg_username [name=username]').val(),
      password: $('#reg_username [name=password]').val()
    }
    // console.log(data);
    // 3.发送请求
    // $.ajax({
    // url: 'http://ajax.frontend.itheima.net/api/reguser',
    // method: 'post',
    // data: data,
    // function(res) {
    $.post('/api/reguser', data, function (res) {
      console.log(res);
      if (res.status !== 0) return layer.msg(res.message);
      layer.msg('注册成功，请登录');
      // 模拟人的行为去登录
      $('#link_login').click();
      // }
    })
  });

  //监听用户登录表单事件
  $('#login_form').submit(function (e) {
    // 阻止表单默认提交行为
    e.preventDefault();
    // 发送ajax请求
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取登录变单中的参数
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg('登录失败')
        layer.msg('登录成功')
        // 保存tocken
        localStorage.setItem('token', res.token);
        // 跳转到主页面 注意文件路径
        location.href = 'index.html'
      }
    })
  })
})