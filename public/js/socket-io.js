$(document).ready(() => {
    const socket = io()
    socket.on('goTo', () => {
        // Disattivata per il momento
        // document.location = '/' 
    })
    socket.on('Error', (error) => {
        console.log(error)
    })
    socket.on('prova' ,()=> {
        socket.emit('join','daje')
    })








})