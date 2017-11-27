var express = require('express')
var emailV = require('email-validator')
const crypto = require('crypto');
const querys = require('../lib/query_db.js')

module.exports = (db) => {


    var router = express.Router()
    router.use('/register', async (req, res, next) => {
        if (req.body.username.length < 5 || req.body.password.length < 5
            || !emailV.validate(req.body.email) || req.body.password === undefined || req.body.username === undefined
            || req.body.email === undefined) {
            return res.json({
                error: true,
                errMessage: 'Dati di registrazione non esatti'
            })
        }
        var tab = null;
        try {
            tab = await db.query(querys.email_in_db(req.body.email)) // controllo se l'email è già presente nel db
        } catch (error) {
            console.log(error)
        }
        const hash = crypto.createHash('sha256')
        let random = Math.random().toString()
        hash.update(req.body.password + random)
        let passH = hash.digest().toString('hex')
        if (tab.rowCount > 0) { // Se l'email è presente inserisco solo utente
            try {
                await db.query(querys.insert_user(req.body.username, passH, random, req.body.email, ''))
            } catch (error) {
                return res.json({
                    err: error
                })
            }
        } else { // altrimenti inserisco anche l'email

            try {
                await db.query('INSERT INTO Email(value) values($1);', [req.body.email])
                await db.query(querys.insert_user(req.body.username, passH, random, req.body.email))
            } catch (error) {
                return res.json({
                    err: error
                })
            }
        }


        next()
    })

    router.post('/register', async (req, res) => {

        res.cookie('rememberme', '1')
        res.redirect('./../html/chat.html')
    })

    return router
}