const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const { Pool } = require('pg')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const middleware = require('./middleware/express')
const options = require('./conf.json')
const http = require('http')
const app = express()
var server = new http.Server(app)
var io = require('socket.io')(server);
var ses = session(
    {
        secret: 'Nessuna la IndovinaBell',
        store: new MemoryStore({ checkPeriod: 86400000 }), resave: false, saveUninitialized: false
    })

const client = new Pool({ connectionString: 'postgres://obbhdnav:1ONsv6xTGR21Tl2KliBMS4p5mzRrPBr1@horton.elephantsql.com:5432/obbhdnav' })

//Gestione socket io 
require('./lib/chat-socket-io')(io, ses, client)

app.set('view engine', 'ejs')
app.use(ses)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('./public'));

//Routes per la registrazione
app.use('/register', middleware.registration(client))
app.use('/register', (err, req, res, next) => {
    req.session.rMessage = err.message
    res.redirect('/')
})
app.post('/register', (req, res) => {
    req.session.autenticato = true
    res.redirect('./../html/chat.html')
})

//Routes per il login
app.use('/login', middleware.login(client))
app.use('/login', (err, req, res, next) => {
    //console.log(err) //debug
    req.session.lMessage = err.message
    res.redirect('/')
})
app.post('/login', (req, res) => {
    if (!req.session.autenticato) return res.redirect('/')
    res.redirect('./chat') // Qua va inserito il render della chat passandogli Username, Immagine Utente ecc.. contenuti nel session storage
})

//Logout
app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

app.use('/conf', middleware.conf(client))
app.use('/conf', (err, req, res, next) => {
    res.redirect('https://www.youtube.com/watch?v=IBH4g_ua5es')
})
app.get('/conf', (req, res) => {
    res.redirect('/')
})

app.get('/chat', (req, res) => {
    if (!req.session.autenticato) return res.redirect('/')
    res.sendFile(path.join(__dirname, './public/html/chat.html')) // Qua va inserito il render della chat passandogli Username, Immagine Utente ecc.. contenuti nel session storage
})

app.get('/', (req, res) => {
    if (req.session.autenticato) return res.redirect('/chat')
    res.render('index.ejs', { rError: req.session.rMessage, lError: req.session.lMessage }) // L'errore riguarda il login
    req.session.destroy()
})





app.get('/*', (req, res) => {
    res.redirect('/html/404.html')
})
server.listen(options.port, () => console.log(`listen on ${options.port}`))