var express = require('express')
var emailV = require('email-validator')
var router = express.Router()

router.use('register', (req, res, next) => {
    if (req.body.username < 5 || req.body.password < 5 || !emailV.validate(req.email)) {
        res.json({
            error: true,
            errMessage: 'Dati di registrazione non esatti'
        })
    } else {
        next()
    }
})
router.post('register', (req, res) => {
    res.json({
        username: req.body.username,
        password: req.body.password,
        email: req.email
    })
})

module.exports = router