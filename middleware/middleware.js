const crypto = require('crypto');
var emailV = require('email-validator')
const querys = require('../lib/query_db')

module.exports = {
    registration (db) {
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
            let passH = hash.digest('hex')
            if (usEmails.rowCount > 0) { // Se l'email è presente inserisco solo utente
                try {
                    let id = await db.query(querys.insert_user(username, passH, random, email, ''))
                    req.session.idUtente = id.rows[0].id
                    return next()
                } catch (error) {
                    return next(error)
                }
            }  // altrimenti inserisco anche l'email

            try {
                await db.query('INSERT INTO Email(value) values($1);', [email])
                let id = await db.query(querys.insert_user(username, passH, random, email, ''))
                req.session.idUtente = id.rows[0].id
            } catch (error) {
                return next(error)
            }
            next()
        }
    },
    login (db) {
        return async(req, res, next) => {
            var username = req.body.username
            var password = req.body.password
            if (password === undefined || username === undefined 
                || username.length < 5 || password.length < 5) {
                return next(new Error('Incorrect login data'))
            }
            try {
                let table = await db.query(querys.get_user_conf_with_username(username))
                if (table.rowCount === 0) return next(new Error('Username incorrect or User not confirmed'))
                let sale = table.rows[0].sale
                let passInTable = table.rows[0].pass
                const hash = crypto.createHash('sha256')
                if ( hash.update(password + sale).digest('hex') !== passInTable) return next(new Error('Password incorrect'))
                // Salvo i dati nella sessione
                req.session.autenticato = true
                req.session.idUtente = table.rows[0].id
                req.session.username = table.rows[0].username
                req.session.img = table.rows[0].img
            } catch(error) {
                return next(error)
            }
            next()
        }
    },








}