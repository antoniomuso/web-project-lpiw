const crypto = require('crypto');
var emailV = require('email-validator')


module.exports = {

    registration: function (db) {
        return async (req, res, next) => {
            if (req.body.username.length < 5 || req.body.password.length < 5
                || !emailV.validate(req.body.email) || req.body.password === undefined || req.body.username === undefined
                || req.body.email === undefined) {
                return next(new Error('dati registrazione non esatti'))
            }
            var tab = null;
            try {
                tab = await db.query(querys.email_in_db(req.body.email)) // controllo se l'email è già presente nel db
            } catch (error) {
                return next(error)
            }
            const hash = crypto.createHash('sha256')
            let random = Math.random().toString()
            hash.update(req.body.password + random)
            let passH = hash.digest().toString('hex')
            if (tab.rowCount > 0) { // Se l'email è presente inserisco solo utente
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