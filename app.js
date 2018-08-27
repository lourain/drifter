var express = require('express')
var bodyParser = require('body-parser')

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

})

//捡一个漂流瓶
//get /?user=xxx[&type=xxx]
app.get('/',function (req,res) {
  if(!req.query.user){
    return res.json({code:0,msg:'信息不完整'})
  }
})