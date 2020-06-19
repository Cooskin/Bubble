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



/*

*/
var ws = new WebSocket("ws://localhost:1711");
ws.onopen = function() {
    console.log("与服务器建立连接...");
    if (sessionStorage.getItem('hx191110_log') == null) {
        location.href = 'index.html'
    }
    var user = JSON.parse(sessionStorage.getItem('hx191110_log'))
    var obj = {
        type: 'log',
        acc: user.acc
    }
    ws.send(JSON.stringify(obj));
}

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
                    // var accUnm = $(this).find('span').attr('acc')
                $('#chat').toggle().find('h3').html($span.html())


            })
            break;
    }
}