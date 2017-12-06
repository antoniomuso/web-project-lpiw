
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
        reciveMessFrom(data.user, data.message, data.img)
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
    Effettua la richiesta dei messaggi di una chat
    input: CallBack cb(error, data)
*/
function getMessage (ist, hours, cb) { 
    $.ajax({
        url: '/rooms',
        type: 'POST',
        cache:false,
        data: {ist:ist, hours: hours},
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
