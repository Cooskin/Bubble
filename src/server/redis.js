var redis=require("redis");
var redisCli=redis.createClient();

var map_1 = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
    [3,3,3,3,3,1,3,3,3,1,3,3,3,3,3],
    [0,3,0,0,1,0,0,0,0,0,1,0,0,3,0],
    [0,0,3,1,0,0,0,0,0,0,0,1,3,0,0],
    [0,0,1,3,0,0,0,0,0,0,0,3,1,0,0],
    [0,1,0,0,3,0,0,0,0,0,3,0,0,1,0],
    [1,1,1,1,1,3,1,1,1,3,1,1,1,1,1],
    [0,0,0,0,0,0,3,0,3,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,3,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]
var map_2 = [
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,3,0,0,0,2,0,0,0,3,0,0,0],
    [0,0,0,3,0,0,0,2,0,0,0,3,0,0,0],
    [0,0,0,3,0,2,0,2,0,2,0,3,0,0,0],
    [0,0,0,3,0,0,0,2,0,0,0,3,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,2,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,2,1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
    [0,0,0,3,0,0,3,0,3,0,0,3,0,0,0],
]

var map_3 = [

    [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,2,0,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,2,0,0,3,3,0,0,0,0],
    [0,0,0,0,0,0,2,0,0,0,3,0,0,0,0],
    [0,0,0,0,0,2,0,0,0,0,3,0,0,0,0],
    [0,0,0,0,0,2,0,0,0,0,3,0,0,0,0],
    [0,0,0,0,2,0,0,0,0,0,3,0,0,0,0],
    [0,0,0,0,2,0,0,0,0,0,3,0,0,0,0],
    [0,0,0,2,0,0,0,0,0,0,3,0,0,0,3],
    [0,0,0,2,0,0,0,0,0,0,3,0,0,0,3],
    [0,0,2,0,0,0,0,0,0,0,0,3,3,3,0],
    [0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],

    ]

    var map_4 = [
        [0,0,0,2,3,0,0,0,0,0,2,3,0,0,0],
        [0,0,2,0,0,1,0,0,0,1,0,0,2,0,0],
        [0,3,0,0,0,0,3,0,3,0,0,0,0,3,0],
        [3,0,0,0,0,0,0,1,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [3,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
        [0,2,0,0,0,0,0,0,0,0,0,0,0,2,0],
        [0,0,1,0,0,0,0,0,0,0,0,0,1,0,0],
        [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
        [0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        ]


redisCli.set("map_1",JSON.stringify(map_1));
redisCli.set("map_2",JSON.stringify(map_2));
redisCli.set("map_3",JSON.stringify(map_3));
redisCli.set("map_4",JSON.stringify(map_4));

// redisCli.get("map_1",function(err,data){
//  console.log(data);
// })
