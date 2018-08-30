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