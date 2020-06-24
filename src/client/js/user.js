$(function() {
    var obj = {
        name: 'aa',
        acc: 10000
    }
    localStorage.setItem('hx191110_log', JSON.stringify(obj));
    var user = JSON.parse(localStorage.getItem('hx191110_log'));


    // var user = JSON.parse(sessionStorage.getItem('hx191110_log'));

    var ws = new WebSocket("ws://localhost:1711");
    ws.onopen = function() {
        var obj = {
            type: 'dress',
            acc: user.acc
        }
        console.log(obj);
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
                console.log(user);
                for (let i = 0; i < user.length; i++) {
                    $('.befor').append(user[i].img);
                }
                // $('.befor').html(oMsg.data);

                // $('.list_wrap li').each(function(i){

                //     $(this).html('')
                // })

                break;
        }
    }

})