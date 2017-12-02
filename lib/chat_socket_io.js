module.exports = (io, session, db) => {
    const middleware = require('./../middleware/socketio')
    const sharedsession = require("express-socket.io-session")
    const querys = require('./query_db')


    io.use(sharedsession(session, {
        autoSave: true
    }))

    io.on('connection', function (socket) {
        // Controllo se l'utente è autenticato
        socket.join('ciao') // debug
        if (!socket.handshake.session.autenticato) {
            socket.emit('goTo', '/') // Rediriggo verso il login
            socket.disconnect(true)
        }

        socket.on('join', async (room) => {
            try {
                var val = await db.query(querys.get_chat_from_time_stamp(room))
                if (val.rowCount === 0) return socket.emit('Error', 'Chat does not exist')
            } catch(error) {
                return socket.emit('Error', error.message)
            }
            // devo uscire dalla vecchia room
            //socket.leave(socket)
            socket.join(room)
        })

        socket.emit('prova','nulla')
        //console.log(socket.rooms)
    });

    

    


    









}