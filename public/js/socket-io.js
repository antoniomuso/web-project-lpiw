
$(document).ready(() => {
    socket = io()
    socket.on('goTo', () => {
        // Disattivata per il momento
        // document.location = '/' 
    })
    socket.on('Error', (error) => {
        console.error(error)
    })

    socket.on('createRoom', (data) => {
        // Qui bisogna creare la chat
        createNewChat(data.name,data.descr,data.ist)
    })

    socket.on('message', (data) => {
        // Dovrebbe esserci data.image
        reciveMessFrom(data.username, data.message, (new Date()).toLocaleTimeString() ,data.img)
    })

    
    //socket.emit('join','frace')
    //socket.emit('createRoom', 'Room Di Prova', 'Semplice chat')


})

/*
    Effettua la richiesta per le chat
    input: CallBack cb(error, data)
*/
function getChats (cb) { 
    $.ajax({
        url: '/rooms',
        type: 'GET',
        cache:false,
        success: (data) => {
            cb(null,data)
        },
        error: (request, status, error) => {
            cb (error)
        }
    })
}

/*
    Effettua la richiesta per i dati dell'utente loggato
*/
function getUserData (cb) { 
    $.ajax({
        url: '/user',
        type: 'GET',
        cache:false,
        success: (data) => {
            if (data.error) return cb(data.error)
            cb(null,data)
        },
        error: (request, status, error) => {
            cb (error)
        }
    })
}

/*
    Effettua la richiesta dei messaggi di una chat
    input: CallBack cb(error, data)
*/
function getMessage (ist, hours, cb) { 
    $.ajax({
        url: 'rooms/message',
        type: 'POST',
        cache:false,
        data: JSON.stringify({ist:ist, hours: hours}),
        dataType: 'json',
        contentType: "application/json",        
        success: (data) => {
            cb(null,data)
        },
        error: (request, status, error) => {
            cb (error)
        }
    })
}
