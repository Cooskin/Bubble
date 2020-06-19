var ws = new WebSocket("ws://localhost:1711");
ws.onopen = function() {
    console.log("与服务器建立连接...");
}

ws.onmessage = function(msg) {
    var oMsg = JSON.parse(msg.data);
    if (oMsg.type == 'sign_up') {

    }
    switch (oMsg.type) {
        case 'sign_on':
            if (oMsg.state) {
                alert('登录成功');
                var obj = {
                    acc: oMsg.acc,
                    name: oMsg.name
                }
                $('[type="text"],[type="password"]').val('');
                sessionStorage.setItem('hx191110_log', JSON.stringify(obj))
                location.href = 'hall.html';
            } else {
                alert('账号或密码有误')
            }
            break;
        case 'sign_up':
            alert('您的账号为：' + oMsg.acc);
            $('[type="text"],[type="password"]').val('').css('border-color', 'transparent');
            $('#sign_on , #sign_up').toggle();
            break;
    }
}

/*
    输入框聚焦高亮，失焦取消高亮
*/
$('[type="text"],[type="password"]').focus(function() {
    $(this).css('border-color', '#ffeb00');
}).blur(function() {
    $(this).css('border-color', 'transparent')
})

/*
    登录注册切换
*/

$('#sign_on a ,#sign_up a').click(function() {
    $('#sign_on , #sign_up').toggle();
})


var Space = /^[^\s]*$/;
var $text = $('#sign_up p:first');

$('#sign_up [type="text"]').blur(function() {
    var userName = $(this).val();
    // console.log(typeof $text.html())
    name(userName, $text, $(this))
})

$('#sign_up [placeholder="输入密码"]').blur(function() {
    var userPwd = $(this).val();
    pwd(userPwd, $text, $(this))
    $('#sign_up [placeholder="确认密码"]').blur(function() {
        var Pwd = $(this).val();
        if (userPwd == Pwd) {
            $text.html('');
            $(this).css('border-color', '#11f111')

        } else {
            $text.html('密码不一致');
        }
    })
})

/*
滑块
*/
var sta = 0;
new DragSlide({
    el: document.querySelector('.dragSlide'),
    success: function() {
        // console.log('success!!!')
        sta = 1;
    }
})

/*
注册
*/
$('#upbtn').click(function() {
    console.log($('#sign_up [placeholder="确认密码"],#sign_up [placeholder="输入密码"],#sign_up [type="text"]').css('border-color'))

    if (sta) {
        $text.html('');

        if ($('#sign_up [placeholder="确认密码"],#sign_up [placeholder="输入密码"],#sign_up [type="text"]').css('border-color') == 'rgb(17, 241, 17)') {
            var obj = {
                type: 'sign_up',
                name: $('#sign_up [type="text"]').val(),
                pwd: $('#sign_up [placeholder="确认密码"]').val()
            }
            ws.send(JSON.stringify(obj));
        }
    } else {
        $text.html('拖动滑块验证');
    }
})

/*
登录
*/
var $acc = $('#sign_on [type="text"]');
var $pwd = $('#sign_on [type="password"]');
var $text2 = $('#sign_on p:first');
$('#onbtn').click(function() {

    if ($acc.val().match(Space) == null || $pwd.val().match(Space) == null) {
        $text2.html('不能输入空格');
    } else {
        if (parseInt($acc.val()) && $acc.val().length >= 5) {
            var obj = {
                type: 'sign_on',
                acc: $acc.val(),
                pwd: $pwd.val()
            }
            ws.send(JSON.stringify(obj))
        } else {
            $text2.html('账号格式错误');
        }
    }
})

$(document).keydown(function(e) {
    console.log(!e)
    console.log(e.keyCode)
    console.log(e.which)
    if (!e) {
        e = window.event;
    }
    if ((e.keyCode || e.which) == 13) {
        // $("#LoginIn").click();
        if ($acc.val().match(Space) == null || $pwd.val().match(Space) == null) {
            $text2.html('不能输入空格');
        } else {
            if (parseInt($acc.val()) && $acc.val().length >= 5) {
                var obj = {
                    type: 'sign_on',
                    acc: $acc.val(),
                    pwd: $pwd.val()
                }
                ws.send(JSON.stringify(obj))
            } else {
                $text2.html('账号格式错误');
            }
        }
    }
})