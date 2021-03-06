const crypto = require('crypto');
var emailV = require('email-validator')
const querys = require('../lib/query-db')
var options = require('../conf.json')
var send_email_conf = require('../lib/send-email-conf')
const fs = require('fs')
const path = require('path')

module.exports = {
    registration(db) {
        return async (req, res, next) => {
            var { email, username, password } = req.body
            // Vincolo sulla lunghezza dell password
            if (password === undefined || username === undefined
                || email === undefined || username.length < 5 || password.length < 5
                || !emailV.validate(email)) {
                return next(new Error('Incorrect registration data'))
            }

            try {
                // controllo se ci sono utenti con lo stesso username
                var nam = await db.query(querys.user_with_same_username(username)).rowCount
                var em = await db.query(querys.user_with_same_email(email)).rowCount

                if (em > 0) return next(new Error('Email is already being used.'))
                if (nam > 0) return next(new Error('Username is already being used.'))

                // controllo se l'email è già presente nel db
                usEmails = await db.query(querys.email_in_db(email))

                //Faccio l'hash della password
                const hash = crypto.createHash('sha256')
                var random = Math.random().toString()
                let passH = hash.update(password + random).digest('hex')

                if (usEmails.rowCount > 0) { // Se l'email è presente inserisco solo utente
                    var tab = await db.query(querys.insert_user(username, passH, random, email, ''))
                    req.session.idUtente = tab.rows[0].id
                } else {
                    // altrimenti inserisco anche l'email
                    await db.query('INSERT INTO Email(value) values($1);', [email])
                    var tab = await db.query(querys.insert_user(username, passH, random, email, ''))
                    req.session.idUtente = tab.rows[0].id
                }
            } catch (error) {
                return next(error)
            }
            // Invio l'email per la conferma
            send_email_conf(email, random, tab.rows[0].id, crypto, options)

            next()
        }
    },
    login(db) {
        return async (req, res, next) => {
            var { username, password } = req.body
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
                if (hash.update(password + sale).digest('hex') !== passInTable) return next(new Error('Password incorrect'))
                // Salvo i dati nella sessione
                req.session.autenticato = true
                req.session.idUtente = table.rows[0].id
                req.session.username = table.rows[0].username
                req.session.img = table.rows[0].img
            } catch (error) {
                return next(error)
            }
            next()
        }
    },
    conf(db) {
        return async (req, res, next) => {
            let id = req.query.id
            let saleIdHash = req.query.hash
            try {
                // prendo l'utente con la query
                var table = await db.query(querys.get_user_not_conf_with_id(id))
                if (table.rowCount === 0) return next(new Error('You can not chage query string value'))
            } catch (error) {
                return next(error)
            }
            // una volta che ho preso l'utente vado a hashare id e sale
            var sale = table.rows[0].sale
            const hash = crypto.createHash('sha256')
            // se id hashato al sale mi da hash in input della query, confermo l'utente 
            if (hash.update(id + sale).digest('hex') !== saleIdHash) return next(new Error('You can not chage query string value'))
            try {
                db.query(querys.conf_user_from_id(id))
            } catch (error) {
                return next(error)
            }
            next()
        }
    },
    rooms(db) {
        return async (req, res, next) => {
            try {
                var tab = await db.query(querys.get_chats_of_day())
            } catch (error) {
                return next(error)
            }
            req.chats = tab.rows
            next()
        }
    },
    messageRooms(db) {
        return async (req, res, next) => {
            var { hours, ist } = req.body
            if(!ist || !hours) return next(new Error('ist and hours not defined'))
            try {
                var { rows } = await db.query(querys.get_messages_of_chat(ist, hours))
            } catch (error) {
                console.log(error)
                return next(error)
            }
            req.rows = rows
            next()
        }
    },
    uploadImg(db) {
        return async (req,res,next) => {
            // tolgo la parte public/
            if (!req.file) return res.redirect('/settings')
            var fPath = req.file.path.slice(req.file.path.indexOf("/")+1,req.file.path.length)
            console.log(fPath)
            try {
                //console.log(req.file)
                await db.query('BEGIN')
                var tab = await db.query(querys.get_user_img(req.session.idUtente)) 
                await db.query(querys.insert_img(fPath))
                await db.query(querys.add_image_to_user(req.session.idUtente,fPath))
                await db.query('COMMIT')
                // Elimino la vecchia immagine 
                if (tab.rowCount > 0) {
                    fs.unlink(path.join('public/', tab.rows[0].img), (err) => {
                        if (err) console.log('Utente ha inserito per la prima volta un immagine ')
                    })
                }
            } catch (error) {
                console.log(error)
                return res.redirect('/settings')
            }
            req.session.img = fPath;
            res.redirect('/settings')
        }
    },
    controlAutenticato() {
        return (req ,res, next) => {
            if (!req.session.autenticato) return res.redirect('/')
            next()
        }
    }








}