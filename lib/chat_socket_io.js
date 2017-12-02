module.exports = (io, session, db) => {
    const middleware = require('./../middleware/socketio')
    const sharedsession = require("express-socket.io-session")


    io.use(sharedsession(session, {
        autoSave: true
    }))

    io.on('connection', function (socket) {
        // Controllo se l'utente è autenticato
        if (!socket.handshake.session.autenticato) {
            socket.emit('goTo', '/') // Rediriggo verso il login
            socket.disconnect(true)
        }
    });

    









}