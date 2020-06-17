var sqlite3 = require('sqlite3');

var db = new sqlite3.Database('./db/bubble.db', sqlite3.OPEN_READWRITE, function (err) {
    if (err == null) {
        console.log('数据库 s')
    }
})

var ws = require('ws');
var server = ws.Server;
var wss = new server({ port: 1711 });
console.log('服务器 f')


wss.on('connection', function (socket) {
    socket.on('message', function (msg) {
        var oMsg = JSON.parse(msg);

        switch (oMsg.type) {
            case 'sign_on':

                break;
            case 'sign_up':
                var sql = 'insert into tbluser (name,pwd) values(?,?)'
                db.run(sql, [oMsg.name, oMsg.pwd], function (e) {
                    console.log(e)
                    if (e == null) {
                        var sql2 = 'select acc from tbluser where name=? and pwd=?'
                        db.get(sql2, [oMsg.name, oMsg.pwd], function (e, data) {
                            if (e == null) {
                                var obj = {
                                    type: 'sign_up',
                                    acc: data.acc
                                }
                                socket.send(JSON.stringify(obj));
                            }
                            console.log(data)

                        })
                    }
                })

                break;
        }


    })
})