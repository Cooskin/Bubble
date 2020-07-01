var sqlite3 = require('sqlite3');

var db = new sqlite3.Database('./db/bubble.db', sqlite3.OPEN_READWRITE, function(err) {
    if (err == null) {
        console.log('数据库 s')
    }
})

var ws = require('ws');
const { Socket } = require('dgram');
var server = ws.Server;
var wss = new server({ port: 1711 });
console.log('服务器 f')

var socketAry = [];
var gameSocket = [];

wss.on('connection', function(socket) {
    socket.on('message', function(msg) {
        var oMsg = JSON.parse(msg);

        switch (oMsg.type) {

            /**
             * 登录 
             */
            case 'sign_on':
                var sql = 'select * from tbluser where acc=? and pwd=?';
                db.get(sql, [oMsg.acc, oMsg.pwd], function(e, data) {
                    if (e == null) {
                        // console.log(data)
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

                /**
                 * 注册 
                 * 存储数据
                 */
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

                /**
                 * 存储游戏大厅socket
                 * 修改登录状态
                 * 用户上线提醒
                 */
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

                    var sql3 = ' select name from tbluser where acc = ?'
                    db.get(sql3, oMsg.acc, function(e, data) {
                        if (e == null) {
                            var log = {
                                type: 'login_tips',
                                name: data.name
                            }
                            if (socketAry.length > 0) {
                                for (let i = 0; i < socketAry.length; i++) {
                                    socketAry[i].socketd.send(JSON.stringify(log));
                                }
                            }
                        }
                    })

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

                break;

                /**
                 * 群聊
                 */

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
                            socketAry[i].socketd.send(JSON.stringify(obj));
                        }
                    }
                })

                break;

                /**
                 * 私聊
                 */
            case 'news':
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

                /**
                 * 退出登录
                 * 用户下线提醒
                 */
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

                /**
                 * 保存个人中心服饰
                 */
            case 'refesh':

                var sql = `update tbluser 
                        set roleid = ? ,cap = ?,win = ? 
                        where acc = ?`;
                db.run(sql, [oMsg.roleid, oMsg.cap, oMsg.win, oMsg.acc], function(e) {
                    console.log(e);
                    if (e == null) {
                        console.log('修改成功')
                    }
                })
                break;

                /**
                 * 打印角色和服饰
                 */
            case 'dress':
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

                /**
                 * 存储游戏房间的socket
                 * 打印房间列表
                 */
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

                /*
                进入界面或者刷新界面
                    到数据库（删）该用户存在的房间里的账号
                    判断空间（删）
                    反馈，打印列表 √
                */


                // `select roomid
                //  from room 
                //  where user1acc = ? or user2acc = ?`;


                var sqlarr = [
                    'update tblroom set user1acc = 0 where user1acc = ?',
                    'update tblroom set user2acc = 0 where user2acc = ?'
                ]

                for (let i = 0; i < sqlarr.length; i++) {
                    db.run(sqlarr[i], [acc], function(er) {
                        // console.log(er)
                        if (er == null) {
                            // console.log('kanbiao');
                            // console.log(1);
                        }
                    })
                }

                var sql2 = `select roomid
                            from tblroom 
                            where user1acc = 0 and user2acc = 0`;
                var sql3 = `delete from tblroom 
                            where roomid = ?`;
                db.all(sql2, [], function(er2, data2) {
                    // console.log(er)
                    if (er2 == null) {
                        // console.log(data2);

                        for (let i = 0; i < data2.length; i++) {
                            db.run(sql3, [data2[i].roomid], function(err) {
                                if (err == null) {
                                    console.log('dle');
                                }
                            })
                        }
                        var sql = `select * from tblroom`;
                        db.all(sql, [], function(e, data) {
                            if (e == null) {
                                var obj = {
                                        type: 'roomlist',
                                        data: data
                                    }
                                    // console.log(data)

                                for (let i = 0; i < gameSocket.length; i++) {
                                    gameSocket[i].socketd.send(JSON.stringify(obj))
                                }
                            }
                        })
                    }
                })

                // var sql = `select * from tblroom`;
                // db.all(sql, [], function(e, data) {
                //     if (e == null) {
                //         var obj = {
                //             type: 'roomlist',
                //             data: data
                //         }

                //         for (let i = 0; i < gameSocket.length; i++) {
                //             gameSocket[i].socketd.send(JSON.stringify(obj))
                //         }
                //     }
                // })

                break;

                /**
                 * 存储创建的房间
                 * 更新打印房间列表
                 */
            case 'room':
                var data = oMsg.data;
                var sql = `insert into tblroom
                            (roomname,user1acc,map)
                            values(?,?,?)`;
                db.run(sql, [data.roomName, data.user1, data.map], function(e) {
                    if (e == null) {
                        var roomid = this.lastID;
                        console.log('添加成功');
                        var sql2 = `select * from tblroom`;
                        db.all(sql2, [], function(e, data) {
                            if (e == null) {
                                var obj = {
                                        type: 'room',
                                        rid: roomid,
                                        data: data
                                    }
                                    // console.log(data)
                                for (let i = 0; i < gameSocket.length; i++) {
                                    gameSocket[i].socketd.send(JSON.stringify(obj));
                                }
                            }
                        })
                    }
                })

                var sql3 = `select c.img 
                from tbluser u,tblcostume c
                where u.acc = ?
                group by img
                having u.roleid = c.id or u.cap = c.id or u.win = c.id `;
                db.all(sql3, [data.user1], function(e, data2) {
                    if (e == null) {
                        var obj = {
                            type: 'ruser',
                            data: data2
                        }
                        socket.send(JSON.stringify(obj));
                    }
                })

                break;

                /**
                 * 删除房间的socket
                 */
            case 'cls':
                for (let i = 0; i < gameSocket.length; i++) {
                    if (gameSocket[i].acc == oMsg.acc) {
                        gameSocket.splice(i, 1)
                    }
                }
                break;

                /**
                 * 删除大厅的socket
                 */
            case 'clschat':
                for (let i = 0; i < socketAry.length; i++) {
                    if (socketAry[i].acc == oMsg.acc) {
                        socketAry.splice(i, 1)
                    }
                }
                break;

                /**
                 * 退出房间
                 */
            case 'clsroom':

                // if()
                var sql3 = `select user1acc,user2acc 
                            from tblroom 
                            where roomid = ?`;

                db.get(sql3, [oMsg.rid], function(err, data2) {
                    if (err == null) {
                        console.log(data2);
                        var num = 0;
                        for (i in data2) {
                            if (data2[i] != 0) {
                                num += 1;
                            }
                        }

                        // var sql4 = `update tblroom set `
                        var sqlarr = [
                            'update tblroom set user1acc = 0 where user1acc = ?',
                            'update tblroom set user2acc = 0 where user2acc = ?'
                        ]

                        for (let i = 0; i < sqlarr.length; i++) {
                            db.run(sqlarr[i], [oMsg.user], function(we) {})
                        }


                        if (num == 0) {
                            var sql = 'delete from tblroom where roomid = ?;'
                            db.run(sql, [oMsg.rid], function(e) {
                                if (e == null) {
                                    console.log('删除成功');
                                }
                            })
                        }

                        var sql2 = `select * from tblroom`;
                        db.all(sql2, [], function(er, data) {
                            if (er == null) {
                                var obj = {
                                    type: 'reroom',
                                    data: data
                                }

                                for (let i = 0; i < gameSocket.length; i++) {
                                    gameSocket[i].socketd.send(JSON.stringify(obj));
                                }
                            }
                        })
                    }
                })

                break;
            case 'add':
                var sql = `select * from tblroom where roomid = ?`;
                db.get(sql, [oMsg.rid], function(e, data) {
                    if (e == null) {
                        var userarr = [data.user1acc, data.user2acc]

                        if (data.user1acc == 0) {
                            var sql2 = `update tblroom set user1acc = ? where roomid = ?`;
                            userarr.splice(0, 1, oMsg.acc)
                        } else if (data.user2acc == 0) {
                            var sql2 = `update tblroom set user2acc = ? where roomid = ?`;
                            userarr.splice(1, 1, oMsg.acc)
                        }
                        db.run(sql2, [oMsg.acc, data.roomid], function(er) {
                            if (e == null) {

                                console.log('加入成功')

                                var sql4 = `select c.img 
                                from tbluser u,tblcostume c
                                where u.acc = ?
                                group by img
                                having u.roleid = c.id or u.cap = c.id or u.win = c.id `;
                                var flag = 0;
                                var arr = [];
                                var key;

                                for (let i = 0; i < userarr.length; i++) {
                                    if (i == 0) {
                                        key = 'user1acc';
                                    } else if (i == 1) {
                                        key = 'user2acc';
                                    }
                                    db.all(sql4, [userarr[i]], function(e, data1) {
                                        if (e == null) {


                                            var p = {
                                                acc: userarr[i],
                                                // user: i,
                                                user: key,
                                                data: data1
                                            }

                                            arr.push(p);

                                            var obj = {
                                                type: 'ruser',
                                                rid: oMsg.rid,
                                                userarr: userarr,
                                                data: arr
                                            }
                                            if (flag) {
                                                for (let i = 0; i < gameSocket.length; i++) {
                                                    console.log(obj)
                                                    gameSocket[i].socketd.send(JSON.stringify(obj));

                                                }
                                            }
                                            flag += 1
                                                // socket.send(JSON.stringify(obj));
                                        }
                                    })

                                }


                                // 刷新列表
                                var sql3 = `select * from tblroom`;
                                db.all(sql3, [], function(er, data2) {
                                    if (er == null) {
                                        var obj = {
                                            type: 'reroom',
                                            rid: oMsg.rid,
                                            data: data2
                                        }

                                        for (let i = 0; i < gameSocket.length; i++) {
                                            gameSocket[i].socketd.send(JSON.stringify(obj));
                                        }
                                    }
                                })
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