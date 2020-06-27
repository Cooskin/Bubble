$(function() {
    // var obj = {
    //     name: 'aa',
    //     acc: 10000
    // }
    // localStorage.setItem('hx191110_log', JSON.stringify(obj));
    // var user = JSON.parse(localStorage.getItem('hx191110_log'));


    var user = JSON.parse(sessionStorage.getItem('hx191110_log'));

    var ws = new WebSocket("ws://localhost:1711");
    ws.onopen = function() {
        var obj = {
            type: 'dress',
            acc: user.acc
        }
        ws.send(JSON.stringify(obj));

        /*添加图片到数据库*/
        // var arr = {
        //     type: 'arr',
        //     data: {
        //         arr1: allImage,
        //         arr2: hastImage,
        //         arr3: wingImage
        //     }
        // }
        // ws.send(JSON.stringify(arr));
    }

    $('.list-btn button').each(function() {
        $(this).attr('type', )
    })

    ws.onmessage = function(msg) {
        var oMsg = JSON.parse(msg.data);
        switch (oMsg.type) {
            case 'dress':
                var user = oMsg.user;
                // console.log(oMsg.user)
                for (let i = 0; i < user.length; i++) {
                    $('.befor').append(user[i].img);
                }
                // $('.befor').html(oMsg.data);

                $('.list-btn button').each(function(i) {
                    $(this).attr('type', i + 1);
                    $(this).click(function() {
                        $(this).addClass('active').siblings().removeClass('active')
                        $('.list-wrap li').each(function(i) {
                            $(this).html('');
                        })
                        pir();
                    })
                })

                pir();

                function pir() {
                    var type = $('.active').attr('type');

                    switch (type) {
                        case '1':
                            $('.list-wrap li').each(function(i) {
                                $(this).html(oMsg.data[i].img);
                            })
                            break;
                        case '2':
                            $('.list-wrap li').each(function(i) {
                                $(this).html(oMsg.data[i + 6].img);
                            })
                            break;
                        case '3':
                            $('.list-wrap li').each(function(i) {
                                if (i < 4) {
                                    $(this).html(oMsg.data[i + 12].img);
                                }
                            })

                    }
                }



                break;
        }
    }

    var afterArr = [];

    $('.list-wrap li').click(function() {

        var obj = {
            type: $(this).find('img').attr('type'),
            img: $(this).html()
        }

        var on = 1;

        for (let i = 0; i < afterArr.length; i++) {
            if (afterArr[i].type == $(this).find('img').attr('type')) {
                afterArr.splice(i, 1, obj);
                on = 0;
            }
        }
        if (on) {
            afterArr.push(obj);
        }

        $('.after').html('')

        for (let i = 0; i < afterArr.length; i++) {
            $('.after').append(afterArr[i].img)
        }

    })

    $('.preserve').click(function() {
        var obj = {
            type: 'refesh',
            acc: user.acc,
            roleid: $('.after [type="1"]').attr('oid'),
            cap: $('.after [type="2"]').attr('oid'),
            win: $('.after [type="3"]').attr('oid')
        }
        ws.send(JSON.stringify(obj));
        alert('保存成功');
    })

    $('.out').click(function() {
        location.href = 'hall.html';
    })

})