var express = require('express')
var fs = require('fs')
var path = require('path')
var bodyParser = require('body-parser')
var app = express()
var { Pool } = require('pg')
const client = new Pool({
    connectionString: 'postgres://obbhdnav:1ONsv6xTGR21Tl2KliBMS4p5mzRrPBr1@horton.elephantsql.com:5432/obbhdnav'
})

var port = 8000

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('./'));
app.use(require('./routes/register_routes')(client))
app.get('/',(req, res) => {
    return res.sendFile(path.join(__dirname, './index.html'))
})





app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './html/404.html'))
})
app.listen(port, () => console.log(`listen on ${port}`))