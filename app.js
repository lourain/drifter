var express = require('express')
var bodyParser = require('body-parser')
var redis = require('./models/redis')
var mongodb = require('./models/mongodb')
var app = express()

app.use(bodyParser.urlencoded({ extended: false }))

//扔一个漂流瓶
//POST owner=xxx&type=xxx&content=xxx[&time=xxx]
app.post('/',function (req,res) {
  if(!(req.body.owner && req.body.type && req.body.content)){//确保信息完整
    if(req.body.type && ['male','female'].indexOf(req.body.type)===-1){
        return res.json({code:0,msg:"类型错误"})
    }
    return res.json({code:0,msg:"信息不完整"})
  }
  redis.throw(req.body,function (result) {
    res.json(result)
  })

})

//捡一个漂流瓶
//get /?user=xxx[&type=xxx]
app.get('/',function (req,res) {
  if(!req.query.user){
    return res.json({code:0,msg:'信息不完整'})
  }
  if(req.query.type && (['male','female'].indexOf(req.query.type) ===-1)){
    return res.json({code:0,msg:'类型错误'})
  }
  redis.pick(req.query,function (result) {
    if(result.code===1){
      //捡到瓶子后存到我的瓶子内
      mongodb.save(req.query.user,result.msg,function (err) {
        if(err){
          return res.json({code:0,msg:'获取漂流瓶失败，请重试'})
        }
        res.json(result)
      })
    }
  })
})
 
//扔到海里去
//捡到了瓶子  扔回去,其实相当于自己新仍了一个瓶子，只是存活时间修改下
//post?owner=xxx&type=xxx&content=xxx  
app.post('/back',function (req,res) {
  redis.throwBack(req.body,function (result) {
    res.json(result) 
  })
})


//获取一个用户的所有漂流瓶
app.get('/user/:user',function (req,res) {
  mongodb.getAll(req.params.user,function (result) {
    res.json(result)
  })
})

//获取特定id的漂流瓶
//GET /bottle/5b87adf220192b95f0715f58
app.get('/bottle/:id',function (req,res) {
  mongodb.getOne(req.params.id,function (result){
    res.json(result)
  })
})

//回复特定的id的漂流瓶
//POST user=xxx&content=xxx&time=xxx
app.post('/reply/:id',function (req,res) {
  if (!(req.body.user && req.body.content)){
    return res.json({code:0,msg:'回复信息不完整'})
  }
  mongodb.reply(req.params.id,req.body,function (result) {
    res.json(result)
  })
})
app.listen(3000)