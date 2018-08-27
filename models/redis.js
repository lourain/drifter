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

    client.SELECT(type[bottle.type],function (err,res) {
        
    })
}