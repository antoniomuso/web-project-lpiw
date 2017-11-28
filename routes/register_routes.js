var express = require('express')
const middleware = require('./../middleware/middleware')


module.exports = (db) => {

    var router = express.Router()
    router.use('/register',middleware.registration(db))
    router.use('/register', (err, req, res, next) => {
        res.render('../index.ejs', { error:err, message:err.message } )
    })
    router.post('/register', async (req, res) => {

        res.cookie('rememberme', '1')
        res.redirect('./../html/chat.html')
    })

    return router
}