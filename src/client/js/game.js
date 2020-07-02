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

            var $rid = $('.pkk').attr('rid');
            var obj1 = {
                type: 'close',
                rid: $rid,
                acc: user.acc
            }
            ws.send(JSON.stringify(obj1));
        }
        // ws.onerror = function() {
        //     var $rid = $('.pkk').attr('rid');
        //     var obj = {
        //         type: 'close',
        //         rid: $rid,
        //         acc: user.acc
        //     }
        //     ws.send(JSON.stringify(obj));
        // }
        // ws.onclose = function() {
        //     var $rid = $('.pkk').attr('rid');
        //     var obj = {
        //         type: 'close',
        //         rid: $rid,
        //         acc: user.acc
        //     }
        //     ws.send(JSON.stringify(obj));
        // }

    /* 列表弹出 */
    $('.btn ul').slideToggle(1000);

    /* 选图创房 */
    $('.cont li').click(function() {
        $(this).css('border-color', 'rgb(255,0,0)').siblings().css('border-color', 'transparent')
        var roomName = prompt('输入房间名');

        if (roomName == null) {
            return;
        }

        if (roomName == '') {
            alert('房间名不能为空');
            $(this).css('border-color', 'transparent');
            return
        }
        // console.log(roomName)
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

        $('.user1').attr('acc', user.acc);
        $('.wrap').hide();
        $('.pkk').show();

    }).mouseover(function() {
        $(this).css('border-color', 'rgb(255,0,0)')
    }).mouseout(function() {
        $(this).css('border-color', 'transparent')
    });

    /* 退出房间 */
    $('.pkk > button').click(function() {
        $(this).parent().hide();
        $('.wrap').show();
        $('#room').hide()
            // $('#room').hide().find('li').css('border-color', 'transparent');

        var obj = {
            type: 'clsroom',
            rid: $('.pkk').attr('rid'),
            user: user.acc
        }
        ws.send(JSON.stringify(obj));
        $('.user_wrap>button').html('准备').attr('state', 'wait');

    })

    /**
     * 准备
     */

    $('.user_wrap>button').click(function() {
        //ready
        var ui = sessionStorage.getItem('hx191110_ui');
        var $rid = $('.pkk').attr('rid');
        if ($(this).attr('state') == 'wait') {
            $(this).html('取消').attr('state', 'ready');
        } else {
            $(this).html('准备').attr('state', 'wait');
        }
        var $state = $(this).attr('state');

        var obj = {
            type: 'state',
            rid: $rid,
            data: {
                state: $state,
                acc: user.acc,
                ui: ui
            }

        }
        ws.send(JSON.stringify(obj));

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
        var obj = {
            type: 'cls',
            acc: user.acc
        }
        ws.send(JSON.stringify(obj));
        location.href = 'hall.html';
    })


    ws.onmessage = function(msg) {
        var oMsg = JSON.parse(msg.data);
        switch (oMsg.type) {

            case 'roomlist':
                var data = oMsg.data;
                console.log(data)
                var str = ``;
                for (let i = 0; i < data.length; i++) {
                    var num = 1;
                    console.log(data[i].user2acc)
                    if (data[i].user1acc != 0 && data[i].user2acc) {
                        num = 2;
                    }
                    str += `<li rid="` + data[i].roomid + `">
                        ` + map[data[i].map - 1] + `
                        <span class="rname" title="` + data[i].roomname + `">` + data[i].roomname + `</span>
                        <div class="info_wrap">
                            <span class="state">` + data[i].state + `</span>
                            <em class="num">` + num + `</em><em>/2</em>
                        </div>
                    </li>`;
                }
                // console.log(str)
                $('.room_list ul').html(str);
                addRoom($('.room_list li'))

                break;

            case 'room':
                console.log(oMsg)
                var data = oMsg.data;
                var str = ``;
                for (let i = 0; i < data.length; i++) {
                    var num = 1;
                    if (data[i].user2acc != 0) {
                        num = 2;
                    }
                    str += `<li rid="` + data[i].roomid + `">
                        ` + map[data[i].map - 1] + `
                        <span class="rname" title="` + data[i].roomname + `">` + data[i].roomname + `</span>
                        <div class="info_wrap">
                            <span class="state">` + data[i].state + `</span>
                            <em class="num">` + num + `</em><em>/2</em>
                        </div>
                    </li>`;
                }

                $('.room_list ul').html(str);
                addRoom($('.room_list li'))

                $('.pkk').attr('rid', oMsg.rid);
                break;
            case 'ruser':
                var data = oMsg.data;
                var $rid = $('.pkk').attr('rid');
                if ($rid == oMsg.rid) {

                    if (data[0].user != undefined) {
                        var ui = 0;
                        for (let i = 0; i < data.length; i++) {
                            console.log(data[i].user)

                            if (data[i].user == 'user1') {
                                $('.user1').html('')
                                for (let j = 0; j < data[i].data.length; j++) {
                                    $('.user1').append(data[i].data[j].img);
                                }

                            } else if (data[i].user == 'user2') {
                                $('.user2').html('')
                                for (let j = 0; j < data[i].data.length; j++) {
                                    $('.user2').append(data[i].data[j].img);
                                }
                                if (user.acc == data[i].acc) {
                                    ui += 1;
                                }
                            }
                        }
                        console.log(ui);
                        if (ui) {
                            sessionStorage.setItem('hx191110_ui', 'u2');
                            $('.user1').attr('ui', 'u1');
                            $('.user2').attr('ui', 'u2');
                        } else {
                            sessionStorage.setItem('hx191110_ui', 'u1');
                            $('.user1').attr('ui', 'u1');
                            $('.user2').attr('ui', 'u2');
                        }

                    } else {
                        for (let i = 0; i < data.length; i++) {
                            $('.user1').append(data[i].img);
                        }
                    }

                }


                break;
            case 'reroom':
                var data = oMsg.data;
                var str = ``;
                var num = 1;

                for (let i = 0; i < data.length; i++) {
                    if (data[i].user1acc != 0 && data[i].user2acc) {
                        num = 2;
                    }

                    str += `<li rid="` + data[i].roomid + `">
                        ` + map[data[i].map - 1] + `
                        <span class="rname" title="` + data[i].roomname + `">` + data[i].roomname + `</span>
                        <div class="info_wrap">
                            <span class="state">` + data[i].state + `</span>
                            <em class="num">` + num + `</em><em>/2</em>
                        </div>
                    </li>`;
                    if (data[i].user1acc == 0) {
                        $('.user1').html('');
                    }
                    if (data[i].user2acc == 0) {
                        $('.user2').html('');
                    }
                }



                $('.room_list ul').html(str);
                addRoom($('.room_list li'))
                break;
            case '':
                break;
            case '':
                break;
        }
    }

    function addRoom(obj) {
        obj.click(function() {
            var $num = $(this).find('.num').html();
            if ($num < 2) {
                var rid = $(this).attr('rid')
                $('.pkk').attr('rid', rid);
                $('.wrap').hide()
                $('.pkk').show();

                var objc = {
                    type: 'add',
                    rid: rid,
                    acc: user.acc
                }
                ws.send(JSON.stringify(objc));
            } else {
                alert('当前房间已满');
            }

        })
    }


})