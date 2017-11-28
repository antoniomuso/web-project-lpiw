const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const { Pool } = require('pg')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const middleware = require('./middleware/middleware')

const app = express()
const client = new Pool({ connectionString: 'postgres://obbhdnav:1ONsv6xTGR21Tl2KliBMS4p5mzRrPBr1@horton.elephantsql.com:5432/obbhdnav' })
const port = 8000

app.set('view engine', 'ejs')
app.use(session(
    {secret: 'Nessuna la IndovinaBell',
    store: new MemoryStore({ checkPeriod: 86400000 }), resave: false, saveUninitialized: false}));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('./'));

router.use('/register',middleware.registration(client))
router.use('/register', (err, req, res, next) => {
    req.session.message = err.message
    res.redirect('/')
})
router.post('/register', (req, res) => {
    res.redirect('./../html/chat.html')
})

app.get('/',(req, res) => {
    return res.render('../index.ejs', {error:req.session.message}) // L'errore riguarda il login
})





app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './html/404.html'))
})
app.listen(port, () => console.log(`listen on ${port}`))