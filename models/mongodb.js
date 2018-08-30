var mongo = require('mongoose')
mongo.connect('mongodb://122.152.219.175/drifter', { useNewUrlParser: true },function (err) {
    console.log('success');
})
var Schema = mongo.Schema
var bottleSchema = new Schema({
    bottle:Array,
    message:Array
})

var bottleModel = mongo.model('bottles',bottleSchema)

exports.save = function (picker,_bottle,callback) {
    var bottle = {bottle:[],message:[]}
    bottle.bottle.push(picker)
    bottle.message.push([_bottle.owner,_bottle.time,_bottle.content])
    bottle = new bottleModel(bottle)
    bottle.save(function (err) {
        callback(err)
    })
}
exports.getAll = function (user,callback) {
    bottleModel.find({'bottle':user},function (err,bottles) {
        if(err){
            return callback({code:0,msg:'获取漂流瓶列表失败'})
        }
        callback({code:1,msg:bottles})
    })
}
exports.getOne = function (id,callback) {
    bottleModel.findById(id,function (err,bottle) {
        if(err){
            return callback({code:0,msg:'读取漂流瓶失败'})
        }
        callback({code:1,msg:bottle})
    })
}
exports.reply = function (id,reply,callback) {
    reply.time = reply.time || Date.now()
    //通过id查找到要回复的漂流瓶
    bottleModel.findById(id,function (err,bottle) {
        if(err){
            return callback({code:0,msg:'回复漂流瓶失败'})
        }
        var newBottle = {}
        newBottle.bottle = bottle.bottle
        newBottle.message = bottle.message
        //如果第一次回复，则再bottle内加上漂流瓶主人
        if(newBottle.bottle.length ===1){
            newBottle.bottle.length.push(newBottle.message[0][0])
        }
        //在newBottle内添加回复信息
        newBottle.message.push([reply.user,reply.time,reply.cotent])
        bottleModel.findByIdAndUpdate(id,newBottle,function (err,bottle) {
            if(err){
                
            }
        })
    })
}