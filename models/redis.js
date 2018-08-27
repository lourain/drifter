var redis = require('redis')
var client = redis.createClient({
    host:'122.152.219.175',
    port:'6379',
})

//我们的个人信息内容相当于瓶子bottle(obj)
exports.throw = function (bottle,callback) {
    bottle.time = bottle.time || Date.now()
    //为每个瓶子随机添加一个id
    var bottleId = Math.random().toString(16)
    var type = {male:0,female:1}
    //根据漂流瓶的type不同，将漂流瓶保存到不同的数据库,hash适合存储对象
    client.SELECT(type[bottle.type],function () {
        client.HMSET(bottleId,bottle,function (err,result) {
            if(err){
                return callback({code:0,msg:'过会再试试吧'})
            }
            //返回结果
            callback({code:1,msg:result})
            client.EXPIRE(bottleId,3600*24)
        })
    })
}


exports.pick = function (info,callback) {
    var type = {male:0,female:1}
    
    client.SELECT(type[info.type],function () {
        client.RANDOMKEY(function (err,bottleId) {
            if(!bottleId){
                return callback({code:0,msg:'大海空空如也..'})
            }
            client.HGETALL(bottleId,function (err,result) {
                if(err){
                    return callback({code:0,msg:'漂流瓶破损了...'})
                }
                callback({code:1,msg:result})
                //redis内删除这个key
                client.DEL(bottleId)
            })
        })
    })
}