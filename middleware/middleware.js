const crypto = require('crypto');
var emailV = require('email-validator')
const querys = require('../lib/query_db')

module.exports = {

    registration: function (db) {
        return async (req, res, next) => {
            if (req.body.username.length < 5 || req.body.password.length < 5
                || !emailV.validate(req.body.email) || req.body.password === undefined || req.body.username === undefined
                || req.body.email === undefined) {
                return next(new Error('Incorrect registration data'))
            }
            var usEmails = null

            try {
                var nam = db.query(querys.user_with_same_username(req.body.username)).rowCount
                var em = db.query(querys.user_with_same_email(req.body.email)).rowCount
                if (em > 0) return next(new Error('Email is already being used.'))
                if (nam > 0) return next(new Error('username is already being used.'))
                usEmails = await db.query(querys.email_in_db(req.body.email)) // controllo se l'email è già presente nel db
            } catch (error) {
                return next(error)
            }
            const hash = crypto.createHash('sha256')
            let random = Math.random().toString()
            hash.update(req.body.password + random)
            let passH = hash.digest().toString('hex')
            if (usEmails.rowCount > 0) { // Se l'email è presente inserisco solo utente
                try {
                    await db.query(querys.insert_user(req.body.username, passH, random, req.body.email, ''))
                } catch (error) {
                    return next(error)
                }
            }  // altrimenti inserisco anche l'email

            try {
                await db.query('INSERT INTO Email(value) values($1);', [req.body.email])
                await db.query(querys.insert_user(req.body.username, passH, random, req.body.email))
            } catch (error) {
                return next(error)
            }
            next()
        }
    },







}