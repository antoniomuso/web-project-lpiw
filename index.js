var express = require('express')
var fs = require('fs')
var path = require('path')
var bodyParser = require('body-parser')
var port = 8000
var app = express()

app.use(bodyParser)
app.use(express.static('images'));
app.use(express.static('html'));
app.use(express.static('css'));
app.use(express.static('js'));
app.use(require('./lib/register_routes'))

app.get('/',(req, res) => {
    return res.sendFile(path.join(__dirname, './index.html'))
})



app.listen(port, () => console.log(`listen on ${port}`))