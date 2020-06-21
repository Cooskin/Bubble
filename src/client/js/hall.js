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

// var useracc = JSON.parse(sessionStorage.getItem('hx191110_log'));


/*

*/
var ws = new WebSocket("ws://localhost:1711");
ws.onopen = function() {
    console.log("与服务器建立连接...");
    if (sessionStorage.getItem('hx191110_log') == null) {
        location.href = 'index.html'
    }

    // var obj = {
    //     type: 'laoke',
    //     userAcc: useracc.acc
    // }
    // ws.send(JSON.stringify(obj));

    var user = JSON.parse(sessionStorage.getItem('hx191110_log'))
    var obj = {
        type: 'log',
        acc: user.acc
    }
    ws.send(JSON.stringify(obj));

    if (socket.readyState === 1) {
        window.onload = function() {
            var obj = {
                type: 'laoke',
                userAcc: useracc.acc
            }
            ws.send(JSON.stringify(obj));
        }
    }

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
                    allImage[oMsg.data[i].roleid] + `<span>` +
                    oMsg.data[i].name + `</span>
                    </li>`;

            }
            $list.html(str);
            $list.find('span').each(function(i) {
                $(this).attr('acc', oMsg.data[i].acc);
            })
            $list.find('li').dblclick(function() {
                var $span = $(this).find('span')
                var accUnm = $(this).find('span').attr('acc')
                $('#chat').toggle().find('h3').html($span.html()).attr('he', accUnm);
            })
            break;
    }
}



// 私聊




$('.btn_wrap button').click(function() {
    var sendInfo = $('.info_wrap .edit').val();
    var sender = useracc.acc
    var receiver = parseInt($('.head>h3').attr('he'));
    // if (receiver == undefined) {
    //     alert('你找谁聊天呢？')
    //     return;
    // }
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

    // $('#text').val('');
    // head(obj, ret);
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
        iSpan.css('float', 'right')
    } else if (user == receiver) {
        lTd.html(img);
    }
    mTd.append(iSpan)
    aTr.append(lTd, mTd, rTd);
    $('tbody').append(aTr);
    console.log(aTr);
}