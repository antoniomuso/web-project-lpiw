var express = require('express')
var fs = require('fs')
var path = require('path')
var port = 8000
var app = express()


app.get('/',(req, res) => {
    return res.sendFile(path.join(__dirname, './index.html'))
})



app.listen(port, () => console.log(`listen on ${port}`))