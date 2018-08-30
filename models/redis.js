var redis = require('redis')
var client = redis.createClient({
    host:'122.152.219.175',
    port:'6379',
    auth_pass:'wsxrk007'
})
var client2 = redis.createClient({
    host: '122.152.219.175',
    port: '6379',
    auth_pass: 'wsxrk007'
})
var client3 = redis.createClient({
    host: '122.152.219.175',
    port: '6379',
    auth_pass: 'wsxrk007'
})
//我们的个人信息内容相当于瓶子bottle(obj)
exports.throw = function (bottle,callback) {
    client2.SELECT(2,function () {
        client2.GET(bottle.owner,function (err,result) {
            if(result>=10){
                return callback({code:0,msg:'今天仍瓶子的机会已经用完了'})
            }
            //扔瓶子次数加1
            client2.INCR(bottle.owner,function () {
                client2.TTL(bottle.owner,function (err,ttl) {
                    if(ttl===-1){
                        client2.EXPIRE(bottle.owner,86400)
                    }
                })
            })
        })
    })
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
    client3.SELECT(3,function () {
        client.GET(info.user,function (err,result) {
            if(result>=10){
                return callback({code:0,msg:'今天捡瓶子的机会已经用完了'})
            }
            client3.INCR(info.user,function () {
                //检查是否是当天第一次捡瓶子
                //若是，则设置该用户捡瓶子次数键的生存期为1天
                //若不是，生存期保持不变
                client.TTL(info.user,function (err,ttl) {
                    if(ttl===-1){
                        client3.EXPIRE(info.user,86400)
                    }  
                })
            })
        })
    })

    var type = {male:0,female:1}
    //捡到海星的概率
    if(Math.random()<0.2){
        return callback({code:1,msg:'海星'})
    }
    client.SELECT(type[info.type],function () {
        client.RANDOMKEY(function (err,bottleId) {
            if(!bottleId){
                return callback({code:0,msg:'海星'})
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

exports.throwBack = function (bottle,callback) {
    var type = {male:0,female:1}
    var bottleId = Math.random().toString(16)
    client.SELECT(type[bottle.type],function () {
        client.HMSET(bottleId,function (err,result) {
            if(err){
                return callback({code:0,msg:'过会在试试把..'})
            }
            callback({code:1,msg:result})
            client.PEXPIRE(bottleId,bottle.time+3600*1000*24-Date.now())//以毫秒计算 所以用到了PEXPIRE
        })
    })
}