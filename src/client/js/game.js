$(function() {

    var user = JSON.parse(sessionStorage.getItem('hx191110_log'));

    var ws = new WebSocket("ws://localhost:1711");

    ws.onopen = function() {
        console.log("与服务器建立连接...");
        if (sessionStorage.getItem('hx191110_log') == null) {
            location.href = 'index.html'
        }

        var obj = {
            type: 'gamelog',
            acc: user.acc
        }
        ws.send(JSON.stringify(obj));
    }

    /* 列表弹出 */
    $('.btn ul').slideToggle(1000);

    /* 选图创房 */
    $('.cont li').click(function() {
        $(this).css('border-color', 'rgb(255,0,0)').siblings().css('border-color', 'transparent')
        var roomName = prompt('输入房间名');
        var map = $(this).find('img').attr('oid');
        var obj = {
            type: 'room',
            data: {
                roomName: roomName,
                user1: user.acc,
                map: map
            }
        }
        ws.send(JSON.stringify(obj));
        console.log(obj);

    })

    /* 关闭选图 */
    $('#room a').click(function() {
        $(this).parent().toggle();
    })

    /* 开始选图 */
    $('.room').click(function() {
        $('#room').toggle();

    })

    /* 返回游戏大厅 */
    $('.back').click(function() {
        location.href = 'hall.html';
    })


})