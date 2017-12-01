module.exports = (io) => {

    
    var chat = io.of('/chat');
    chat.on('connection', function (socket) {
        console.log('someone connected');
    });









}