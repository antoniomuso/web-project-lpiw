const crypto = require('crypto');
var emailV = require('email-validator')
const querys = require('../lib/query_db')

module.exports = {

    registration: function (db) {
        return async (req, res, next) => {
            var email = req.body.email
            var username = req.body.username
            var password = req.body.password
            if (password === undefined || username === undefined
                || email === undefined || username.length < 5 || password.length < 5
                || !emailV.validate(email)) {
                return next(new Error('Incorrect registration data'))
            }
            var usEmails = null

            try {
                var nam = await db.query(querys.user_with_same_username(username)).rowCount
                var em = await db.query(querys.user_with_same_email(email)).rowCount
                if (em > 0) return next(new Error('Email is already being used.'))
                if (nam > 0) return next(new Error('Username is already being used.'))
                usEmails = await db.query(querys.email_in_db(email)) // controllo se l'email è già presente nel db
            } catch (error) {
                return next(error)
            }
            const hash = crypto.createHash('sha256')
            let random = Math.random().toString()
            hash.update(password + random)
            let passH = hash.digest().toString('hex')
            if (usEmails.rowCount > 0) { // Se l'email è presente inserisco solo utente
                try {
                    await db.query(querys.insert_user(username, passH, random, email, ''))
                    return next()
                } catch (error) {
                    return next(error)
                }
            }  // altrimenti inserisco anche l'email

            try {
                await db.query('INSERT INTO Email(value) values($1);', [email])
                await db.query(querys.insert_user(username, passH, random, email, ''))
            } catch (error) {
                return next(error)
            }
            next()
        }
    },







}