var express = require('express')
var emailV = require('email-validator')
const crypto = require('crypto');



module.exports = (db) => {
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

    router.post('/register',async (req, res) => {
        const hash = crypto.createHash('sha256')
        let random = Math.random().toString()
        hash.update(req.body.password + random)
        let passH = hash.digest().toString('hex')
        try {
        await db.query('INSERT INTO Email(value) values($1);', [req.body.email])
        await db.query('INSERT INTO Utente(conf, username, pass, sale, email, ist) values ($1,$2,$3,$4,$5,$6,current_timestamp);'
            ,[false,req.body.username,passH,random,req.body.email])
        } catch(error) {
            return res.json({
                err: error
            })
        }
        res.cookie('rememberme', '1')
        res.redirect('./../html/chat.html')
    })

    return router
}