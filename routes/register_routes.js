var express = require('express')
const middleware = require('./../middleware/middleware')


module.exports = (db) => {

    var router = express.Router()
    router.use('/register',middleware.registration(db))
    router.use('/register', (err, req, res, next) => {
        req.session.message = err.message
        res.redirect('/')
    })
    router.post('/register', (req, res) => {
        res.redirect('./../html/chat.html')
    })

    return router
}