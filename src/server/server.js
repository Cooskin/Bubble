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

            break;
        }


    })
})