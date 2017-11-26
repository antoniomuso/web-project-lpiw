const fadeIn = 1000
// prende un messaggio ricevuto dal server e lo inserisce nella chat come messaggio ricevuto 
// da un altra persona
function reciveMessFrom(otherName, img, message) {
    var object = $(`<li class="other">
        <div class="avatar">
            <img class='cricle #c5cae9 indigo lighten-4' src="https://i.imgur.com/DY6gND0.png" draggable="false" />
        </div>
        <div class="msg">
            <p>${message}</p>
            <time>${(new Date()).toLocaleTimeString()}</time>
        </div>
    </li>`)
    object.find('.avatar').hide()
    object.find('.msg').hide()
    var ol = object.appendTo('#chats')
    ol.find('.avatar').fadeIn();
    ol.find('.msg').toggle('bounce')
    return ol[0].children[ol[0].children.length - 1]
}
// Prende in input un nome utente un messaggio, Dovrebbe prendere anche avatar ecc...
// restituisce il messaggio html aggiunto
function sendMessage(name, message) {
    var object = $(
        `<li class="self">
        <div class="avatar">
            <img class='cricle #c5cae9 indigo lighten-4' src="https://i.imgur.com/HYcn9xO.png" draggable="false" />
        </div>
        <div class="msg">
            <p>${message}</p>
            <time>${(new Date()).toLocaleTimeString()}</time>
        </div>
        </li>`)
    object.find('.avatar').hide()
    object.find('.msg').hide()
    var ol = object.appendTo('#chats')
    ol.find('.avatar').fadeIn();
    ol.find('.msg').toggle('bounce')
    return ol[0].children[ol[0].children.length - 1]
}


// cattura l'evento di pressione dell'enter
function callBackKeyPressed(e) {
    if (e.which == 13) {
        var msg = sendMessage('MyName', this.value)
        //console.log(msg)
        $(this).val('')
        $('#chat').animate({
            scrollTop: msg.offsetTop
        }, 2000)
    }
}
$(document).ready(function () {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    w3.includeHTML(() => { // callback di fine embedd
        $('#input-chat').keydown(callBackKeyPressed)
    }) // embedda chat_div in questa pagina html

})


