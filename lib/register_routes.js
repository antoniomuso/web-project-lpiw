var express = require('express')
var emailV = require('email-validator')
var router = express.Router()

router.use('/register', (req, res, next) => {
    if (req.body.username.length < 5 || req.body.password.length < 5 
        || !emailV.validate(req.body.email) || req.body.password === undefined || req.body.username === undefined 
        || req.body.email === undefined) {
        res.json({
            error: true,
            errMessage: 'Dati di registrazione non esatti'
        })
    } else {
        next()
    }
})
router.post('/register', (req, res) => {
    res.json({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    })
})

module.exports = router