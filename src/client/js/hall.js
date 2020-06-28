/*
游戏说明展示隐藏
*/
$(function() {
    $('.exp a').click(function() {
        $(this).parent().toggle();
    })

    $('.expbtn').click(function() {
        $('.exp').toggle();
    })
})

/* 前往角色换装 */
$('.toUser').click(function() {
    location.href = 'user.html';
})

/*  */
$('.game').click(function() {
    location.href = 'game.html'
})


/*

*/
var user = JSON.parse(sessionStorage.getItem('hx191110_log'));

if (user == null) {
    location.href = 'index.html';
}

var ws = new WebSocket("ws://localhost:1711");
ws.onopen = function() {
    console.log("与服务器建立连接...");
    if (sessionStorage.getItem('hx191110_log') == null) {
        location.href = 'index.html'
    }

    var obj = {
        type: 'log',
        acc: user.acc
    }
    ws.send(JSON.stringify(obj));
}


$('.head a').click(function() {
    $(this).parents('#chat').toggle()
})

ws.onmessage = function(msg) {
    var oMsg = JSON.parse(msg.data);
    switch (oMsg.type) {
        case 'log':
            var $list = $('.list_wrap ul');
            var len = oMsg.data.length;
            var str = '';
            for (let i = 0; i < len; i++) {
                str += `<li>` +
                    allImage[oMsg.data[i].roleid - 1] + `<span>` +
                    oMsg.data[i].name + `</span>
                    </li>`;

            }
            $list.html(str);
            $list.find('span').each(function(i) {
                $(this).attr('acc', oMsg.data[i].acc);
            })
            $list.find('li').dblclick(function() {
                if ($(this).attr('class') == undefined) {
                    $('tbody').html('');
                }
                var $span = $(this).find('span')
                var accUnm = $(this).find('span').attr('acc')
                $('#chat').toggle().find('h3').html($span.html()).attr('he', accUnm);
                $(this).removeClass('tips')
            })
            break;

        case 'news':
            pirent(user.acc, oMsg.sender, oMsg.receiver, oMsg.info, allImage[oMsg.roleid])
            console.log(user.acc == oMsg.receiver)
            if (user.acc == oMsg.receiver) {

                $('.list_wrap li').each(function() {
                    var $acc = $(this).find('span').attr('acc')

                    if ($acc == oMsg.sender) {
                        if ($('#chat').css('display') == 'none') {
                            $(this).addClass('tips');
                        }
                    }
                })
            }

            break;

        case 'chat_all':
            // $('.cont span em').html()
            if (user.name == oMsg.name) {
                var str = `<div>
                <span><em class="me">` + oMsg.name + `</em>：</span>
                <span>` + oMsg.info + `</span>
            </div>`;
            } else {
                var str = `<div>
                <span><em>` + oMsg.name + `</em>：</span>
                <span>` + oMsg.info + `</span>
            </div>`;
            }

            $('#foot .cont').append(str);

            break;

        case 'login_tips':
            var str = `<div>
                <span><em class="me">系统提示</em>：</span>
                <span>` + `玩家"` + oMsg.name + `"已上线` + `</span>
            </div>`;
            $('#foot .cont').append(str);
            break;

        case 'out':
            var $list = $('.list_wrap ul');
            var len = oMsg.data.length;
            var str = '';
            for (let i = 0; i < len; i++) {
                str += `<li>` +
                    allImage[oMsg.data[i].roleid] + `<span>` +
                    oMsg.data[i].name + `</span>
                        </li>`;

            }
            $list.html(str);
            $list.find('span').each(function(i) {
                $(this).attr('acc', oMsg.data[i].acc);
            })

            var str = `<div>
                <span><em class="me">系统提示</em>：</span>
                <span>` + `玩家"` + oMsg.name + `"已下线` + `</span>
            </div>`;
            $('#foot .cont').append(str);
            break;
    }
}



// 私聊


$('.info_wrap button').click(function() {
    var sendInfo = $('.info_wrap .edit').val();
    var sender = user.acc
    var receiver = parseInt($('.head>h3').attr('he'));

    if (!$.trim(sendInfo)) {
        alert('发送内容不能为空');
        return;
    }

    var obj = {
        type: 'news',
        sender: sender,
        receiver: receiver,
        info: sendInfo
    }
    ws.send(JSON.stringify(obj))

    $('.info_wrap .edit').val('');
})

function pirent(user, sender, receiver, info, img) {
    var aTr = $('<tr></tr>');
    var lTd = $('<td></td>');
    var mTd = $('<td></td>');
    var rTd = $('<td></td>');
    var iSpan = $('<span></span>');
    iSpan.html(info);
    if (user == sender) {
        rTd.html(img);
        iSpan.css({ 'float': 'right', 'background-color': '#6cff6c' })
    } else if (user == receiver) {
        lTd.html(img);
    }
    mTd.append(iSpan)
    aTr.append(lTd, mTd, rTd);
    $('tbody').append(aTr);

}


//  群聊

$('.text button').click(function() {
    var $text = $('.text .edit')
    if ($text.val() == '') {
        alert('输入点内容吧');
    } else {
        var obj = {
            type: 'chat_all',
            sender: user.acc,
            info: $text.val()
        }
        ws.send(JSON.stringify(obj));
    }
    $text.val('')
})



/*
    推出登录

    状态为0，
    本地存储删除，
    // socket删除，
    修改列表。

*/

$('#sign_out').click(function() {
    var acc = user.acc;
    var obj = {
        type: 'out',
        acc: acc,
        name: user.name
    }
    ws.send(JSON.stringify(obj));
    sessionStorage.removeItem('hx191110_log');
    location.href = 'index.html';
})