const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const { Pool } = require('pg')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const middleware = require('./middleware/middleware')
const options = require('./conf.json')

const app = express()
const client = new Pool({ connectionString: 'postgres://obbhdnav:1ONsv6xTGR21Tl2KliBMS4p5mzRrPBr1@horton.elephantsql.com:5432/obbhdnav' })

app.set('view engine', 'ejs')
app.use(session(
    {secret: 'Nessuna la IndovinaBell',
    store: new MemoryStore({ checkPeriod: 86400000 }), resave: false, saveUninitialized: false}));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('./'));

//Routes per la registrazione
app.use('/register',middleware.registration(client))
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
    res.redirect('./../html/chat.html') // Qua va inserito il render della chat passandogli Username, Immagine Utente ecc.. contenuti nel session storage
})

//Logout
app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

app.use('/conf',middleware.conf(client))
app.use('/conf', (err, req, res, next) => {
    res.redirect('https://www.youtube.com/watch?v=IBH4g_ua5es')
})
app.get('/conf', (req, res) => {
    res.redirect('/')
})

app.get('/chat', (req, res) => {
    if (!req.session.autenticato) return res.redirect('/') 
    res.redirect('./../html/chat.html') // Qua va inserito il render della chat passandogli Username, Immagine Utente ecc.. contenuti nel session storage
})

app.get('/',(req, res) => {
    if (req.session.autenticato) return res.redirect('/chat')
    res.render('../index.ejs', {rError:req.session.rMessage, lError: req.session.lMessage}) // L'errore riguarda il login
    req.session.destroy()
})





app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './html/404.html'))
})
app.listen(options.port, () => console.log(`listen on ${options.port}`))