module.exports = (io, session, db) => {
    const middleware = require('./../middleware/socketio')
    const sharedsession = require("express-socket.io-session")
    const querys = require('./query_db')

    io.use(sharedsession(session, {
        autoSave: true
    }))

    io.on('connection', function (socket) {
        // Controllo se l'utente è autenticato oppure ha un altra pagina aperta 
        if (!socket.handshake.session.autenticato || socket.handshake.session.socket) {
            socket.emit('goTo', '/') // Rediriggo verso il login
            return socket.disconnect(true)
        }

        socket.on('disconnect', () => {
            // durante la disconnessione se la socket è quella che ha preso la sessione la libero
            if (socket.handshake.session.socket === socket.id) { 
                socket.handshake.session.socket = undefined
                socket.handshake.session.save();
            }
        })
        // Mi salvo l'id della socket nella sessione del cookie 
        socket.handshake.session.socket = socket.id
        socket.handshake.session.save()


        socket.on('join', async (room, callback) => {
            
            try {
                var val = await db.query(querys.get_chat_from_time_stamp(room))
                if (val.rowCount === 0) return socket.emit('Error', 'Chat does not exist or timer expired.')
            } catch(error) {
                return socket.emit('Error', error.message)
            }
            
            var roomKeys = Object.keys(socket.rooms);
            // Esco dalla vecchia room
            for (let room in socket.rooms) {
                if (room === roomKeys[0]) continue
                socket.leave(room)
            }
            //socket.leave(roomKeys[1])
            // Entro nella nuova
            socket.join(room)
            callback(`You are enter in ${room}`)
        })

        socket.on('message', async (message) => {
            if (!message || message.lenght > 1000) return socket.emit('Error', 'Message so big or null')
            var room = Object.keys(socket.rooms)[1]
            console.log(room)
            
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
            socket.to(room).emit('message', socket.handshake.session.username, message)

        })


        socket.on('createRoom', async (nome, desc) => {
            if (!nome || nome.length > 20 ) return socket.emit('Error', 'Name so long or null.')
            if (!desc || desc.lenght > 100) return socket.emit('Error', 'Description so long or null.')
            try {
                var tab = await db.query(querys.insert_chat_in_db(socket.handshake.session.idUtente, nome, desc, null))
            } catch(error) {
                socket.emit('Error', error.message)
            }
            //Mando a tutte le socket la presenza della nuova chat
            socket.of('/').emit('createRoom', tab.rows.ist, nome, desc)

        })

    });

    

    


    









}