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
var gameSocket = [];

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

                var acc = oMsg.acc;
                var condition = 1;
                for (let i = 0; i < socketAry.length; i++) {
                    if (acc == socketAry[i].acc) {
                        condition = 0;
                        var obj = {
                            acc: acc,
                            socketd: socket
                        }
                        socketAry.splice(i, 1, obj);
                    }
                }
                if (condition == 1) {
                    var userObj = {
                        acc: acc,
                        socketd: socket
                    }
                    socketAry.push(userObj);

                }

                var sql = 'update tbluser set state = 1 where acc = ?';
                db.run(sql, oMsg.acc, function(e) {
                    if (e == null) {
                        var sql2 = 'select acc,name,roleid from tbluser where state = 1'
                        db.all(sql2, [], function(e, data) {
                            if (e == null) {

                                if (data !== undefined) {
                                    var obj = {
                                        type: 'log',
                                        data: data

                                    }
                                    if (socketAry.length > 0) {
                                        for (let i = 0; i < socketAry.length; i++) {
                                            socketAry[i].socketd.send(JSON.stringify(obj));
                                        }
                                    }
                                }
                            }
                        })

                    }
                })
                var sql3 = ' select name from tbluser where acc = ?'
                db.get(sql3, oMsg.acc, function(e, data) {
                    var log = {
                        type: 'login_tips',
                        name: data.name
                    }

                    if (socketAry.length > 0) {
                        for (let i = 0; i < socketAry.length; i++) {
                            socketAry[i].socketd.send(JSON.stringify(log));
                        }
                    }
                })
                break;
            case 'chat_all':

                var sql = 'select name from tbluser where acc = ?'

                db.get(sql, oMsg.sender, function(e, data) {
                    if (e == null) {
                        var obj = {
                            type: 'chat_all',
                            name: data.name,
                            info: oMsg.info
                        }
                        for (let i = 0; i < socketAry.length; i++) {
                            // if (socketAry[i].acc == oMsg.sender) { }
                            socketAry[i].socketd.send(JSON.stringify(obj));
                        }
                    }
                })

                break;
            case 'news':
                // 私聊
                var sql = 'select roleid from tbluser where acc = ?';
                db.get(sql, [oMsg.sender], function(e, data) {
                    if (e == null) {
                        if (oMsg.sender == oMsg.receiver) {
                            var obj = {
                                type: 'news',
                                roleid: data.roleid,
                                sender: oMsg.sender,
                                receiver: oMsg.receiver,
                                info: oMsg.info
                            }
                            socket.send(JSON.stringify(obj));
                            return;
                        }
                        for (let i = 0; i < socketAry.length; i++) {

                            if (socketAry[i].acc == oMsg.receiver) {

                                var obj = {
                                    type: 'news',
                                    roleid: data.roleid,
                                    sender: oMsg.sender,
                                    receiver: oMsg.receiver,
                                    info: oMsg.info
                                }
                                socketAry[i].socketd.send(JSON.stringify(obj));
                                socket.send(JSON.stringify(obj));
                            }
                        }
                    }
                })

                break;

            case 'out':

                for (let i = 0; i < socketAry.length; i++) {
                    if (oMsg.acc == socketAry[i].acc) {
                        socketAry.splice(i, 1);
                    }
                }

                var sql = 'update tbluser set state = 0 where acc = ?';
                db.run(sql, oMsg.acc, function(e) {
                    if (e == null) {
                        var sql2 = 'select acc,name,roleid from tbluser where state = 1'
                        db.all(sql2, [], function(e, data) {
                            if (e == null) {

                                if (data !== undefined) {
                                    var obj = {
                                        type: 'out',
                                        name: oMsg.name,
                                        data: data

                                    }
                                    if (socketAry.length > 0) {
                                        for (let i = 0; i < socketAry.length; i++) {
                                            socketAry[i].socketd.send(JSON.stringify(obj));
                                        }
                                    }
                                }
                            }
                        })

                    }
                })

                break;

            case 'refesh':

                var sql = `upd'ate tbluser 
                        set roleid = ? ,cap = ?,win = ? 
                        where acc = ?`;
                db.run(sql, [oMsg.roleid, oMsg.cap, oMsg.win, oMsg.acc], function(e) {
                    console.log(e);
                    if (e == null) {
                        console.log('修改成功')
                    }
                })
                break;

            case 'dress':
                // 打印角色和服饰
                var sql = `select c.img 
                from tbluser u,tblcostume c
                where u.acc = ?
                group by img
                having u.roleid = c.id or u.cap = c.id or u.win = c.id `;
                var sql2 = 'select * from tblcostume'
                db.all(sql, oMsg.acc, function(e, data) {
                    if (e == null) {
                        db.all(sql2, [], function(er, data2) {
                            if (er == null) {
                                var obj = {
                                    type: 'dress',
                                    user: data,
                                    data: data2
                                }
                                socket.send(JSON.stringify(obj));
                            }
                        })
                    }
                })
                break;
            case 'gamelog':
                var acc = oMsg.acc;
                var condition = 1;
                for (let i = 0; i < gameSocket.length; i++) {
                    if (acc == gameSocket[i].acc) {
                        condition = 0;
                        var obj = {
                            acc: acc,
                            socketd: socket
                        }
                        gameSocket.splice(i, 1, obj);
                    }
                }
                if (condition == 1) {
                    var userObj = {
                        acc: acc,
                        socketd: socket
                    }
                    gameSocket.push(userObj);

                }

                break;

            case 'room':
                var data = oMsg.data;
                var sql = `insert into tblroom
                            (roomname,user1acc,map)
                            values(?,?,?)`;
                db.run(sql, [data.roomName, data.user1, data.map], function(e) {
                    if (e == null) {
                        console.log('添加成功');
                        var sql2 = `select * from tblroom`;
                        db.all(sql2, [], function(e, data) {
                            if (e == null) {
                                for (let i = 0; i < gameSocket.length; i++) {
                                    gameSocket[i].socket.send(JSON.stringify(data))
                                }
                            }
                        })
                    }
                })
                break;
            case 'arr':
                // allImage   hastImage   wingImage
                var data = oMsg.data;
                var sql = 'update tblcostume set img = ? where id = ?'
                var numarr = [1, 7, 13];
                var i = 0;
                for (j in data) {
                    arr(sql, data[j], numarr[i]);
                    i++
                }

                break;
        }


    })
})

function arr(sql, obj, num) {
    console.log(num)
    console.log(obj)
    console.log(sql)
    for (let i = 0; i < obj.length; i++) {
        db.run(sql, [obj[i], num + i], function(e) {
            console.log('修改成功')
        })
    }
}