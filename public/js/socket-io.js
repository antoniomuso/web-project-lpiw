$(document).ready(() => {
    const socket = io()
    socket.on('goTo', () => {
        // Disattivata per il momento
        // document.location = '/' 
    })
    socket.on('Error', (error) => {
        console.log(error)
    })

    socket.on('createRoom', (ist, nome, desc) => {
        // Qui bisogna creare la chat
        createNewChat(nome,desc,ist)
    })

    socket.on('message', (user,message) => {
        reciveMessFrom(user, message, null)
    })
    //socket.emit('join','frace')
    //socket.emit('createRoom', 'prova', 'semplice chat')
    







})