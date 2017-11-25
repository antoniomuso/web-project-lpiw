
// prende un messaggio ricevuto dal server e lo inserisce nella chat come messaggio ricevuto 
// da un altra persona
function reciveMessFrom (otherName, img, message)  {

}
// Prende in input un nome utente un messaggio, Dovrebbe prendere anche avatar ecc...
// restituisce il messaggio html aggiunto
function sendMessage (name, message) {
    var ol = $('#chats').append(`<li class="self">
        <div class="avatar">
            <img class='cricle #c5cae9 indigo lighten-4' src="https://i.imgur.com/HYcn9xO.png" draggable="false" />
        </div>
        <div class="msg">
            <p>${message}</p>
            <time>${(new Date()).toLocaleTimeString()}</time>
        </div>
    </li>`)
    return ol[0].children[ol[0].children.length-1]
}



