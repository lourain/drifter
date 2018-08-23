var express = require('express')
var redis = require('redis').createClient()
var bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))

