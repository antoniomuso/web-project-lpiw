var express = require('express')
var fs = require('fs')
var path = require('path')
var bodyParser = require('body-parser')
var port = 8000
var app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('./'));
app.use(require('./lib/register_routes'))

app.get('/',(req, res) => {
    return res.sendFile(path.join(__dirname, './index.html'))
})



app.listen(port, () => console.log(`listen on ${port}`))