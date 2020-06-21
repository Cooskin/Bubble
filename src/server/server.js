var sqlite3 = require('sqlite3');

var db = new sqlite3.Database('./db/bubble.db', sqlite3.OPEN_READWRITE, function(err) {
    if (err == null) {
        console.log('数据库 s')
    }
})

var ws = require('ws');
var server = ws.Server;
var wss = new server({ port: 1711 });
console.log('服务器 f')

var socketAry = [];

wss.on('connection', function(socket) {
    socket.on('message', function(msg) {
        var oMsg = JSON.parse(msg);

        switch (oMsg.type) {
            case 'sign_on':
                var sql = 'select * from tbluser where acc=? and pwd=?';
                db.get(sql, [oMsg.acc, oMsg.pwd], function(e, data) {
                    if (e == null) {
                        console.log(data)
                        if (data == undefined) {
                            var obj = {
                                type: 'sign_on',
                                state: 0
                            }
                        } else {
                            var obj = {
                                type: 'sign_on',
                                name: data.name,
                                acc: data.acc,
                                state: 1
                            }
                        }
                        socket.send(JSON.stringify(obj));
                    }
                })

                break;
            case 'sign_up':
                var sql = 'insert into tbluser (name,pwd) values(?,?)'
                db.run(sql, [oMsg.name, oMsg.pwd], function(e) {
                    if (e == null) {

                        var obj = {
                            type: 'sign_up',
                            acc: this.lastID
                        }
                        socket.send(JSON.stringify(obj));

                    }
                })

                break;

            case 'log':
                var sql = 'update tbluser set state = 1 where acc = ?'
                db.run(sql, oMsg.acc, function(e) {
                    if (e == null) {
                        var sql2 = 'select acc,name,roleid from tbluser where state = 1'
                        db.all(sql2, [], function(e, data) {
                            if (e == null) {

                                // console.log(data)
                                if (data !== undefined) {
                                    var obj = {
                                        type: 'log',
                                        data: data

                                    }

                                    socket.send(JSON.stringify(obj));
                                }
                            }
                        })
                    }
                })
                break;
            case 'laoke':
                var acc = oMsg.userAcc;
                var condition = 1;
                for (let i = 0; i < socketAry.length; i++) {
                    if (acc == socketAry[i].acc) {
                        condition = 0;
                    }
                }
                if (condition == 1) {
                    var userObj = {
                            acc: acc,
                            socketd: socket
                        }
                        // console.log(condition)
                    socketAry.push(userObj);
                    // console.log(socketAry)

                }


                // var sql = `select q.*,f.listNumber,f.listName
                // from qqFriend f,qqRecUser q
                // where f.userAcc = ? and f.friendAcc = q.acc`;
                // db.all(sql, [acc], function(e, data) {
                //     var obj = {
                //         type: 'laoke',
                //         content: { data: data }
                //     }
                //     socket.send(JSON.stringify(obj));
                // })
                break;
            case 'news':

                for (let i = 0; i < socketAry.length; i++) {
                    if (socketAry[i].acc == oMsg.receiver) {

                        var obj = {
                            type: 'news',
                            sender: oMsg.sender,
                            receiver: oMsg.receiver,
                            info: oMsg.info
                        }

                        socketAry[i].socketd.send(JSON.stringify(obj))
                    }
                }
                break;
        }


    })
})