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
                if (val.rowCount === 0) return socket.emit('Error', 'Chat does not exist or timer expired.')
            } catch(error) {
                return socket.emit('Error', error.message)
            }
            var roomKeys = Object.keys(socket.rooms);
            // Esco dalla vecchia room
            socket.leave(roomKeys[1])
            // Entro nella nuova
            socket.join(room)
        })

        socket.on('message', async (id,message) => {
            var room = Object.keys(socket.rooms)[1]
            if (!room) return socket.emit('Error', 'You must enter in a chat.')
            try {
                var val = await db.query(querys.get_chat_from_time_stamp(room))
                if (val.rowCount === 0) return socket.emit('Error', 'Chat has expired.')
            } catch(error) {
                return socket.emit('Error', error.message)
            }
            db.query(querys.insert_message_in_db(socket.handshake.session.idUtente,room,message,null))
                .catch((error)=>{
                    socket.emit('Error', error.message)
            })
            // Devo inviare in brodd

        })

    });

    

    


    









}