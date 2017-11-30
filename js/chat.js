const fadeIn = 1000
// prende un messaggio ricevuto dal server e lo inserisce nella chat come messaggio ricevuto 
// da un altra persona
function reciveMessFrom(otherName, message, link_img) {
    var object = $(`<li class="other">
        <div class="avatar">
            <img class='cricle #c5cae9 indigo lighten-4' src="${link_img}" draggable="false" />
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
function sendMessage(name, message, link_img) {
    var object = $(
        `<li class="self">
        <div class="avatar">
            <img class='cricle #c5cae9 indigo lighten-4' src="${link_img}" draggable="false" />
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

function hideShowChat () {
    $('#chat').toggle('bounce')
}

function backToChat(){
    $("#list-chat").css("display", "inherit")
    $(".hide-mobile").css("display", "none")
    $(".show-mobile").css("display", "inherit")
    
}
function selectedChat(chat){
    $("#chat").attr("w3-include-html", chat)
}

// cattura l'evento di pressione dell'enter
function callBackKeyPressed(e) {
    if (e.which == 13) {
        if (this.value === '') return
        var msg = sendMessage('Giovanni Varricchione', this.value, 'https://scontent-mxp1-1.xx.fbcdn.net/v/t1.0-9/20770225_10212100619488480_2709822859667583246_n.jpg?oh=2aced0a77a1238729b5fc0886ae1f28a&oe=5AD25825')
        //console.log(msg)
        $(this).val('')
        $('#chat').stop().animate({
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

    $(".profile-collapse").sideNav()
    $("#confirm-topic").click(function(){
        var chatName = $("#topic").val();
        if (chatName)
            $("#list-chat").append('<a href="#!" class="collection-item">' + chatName + '</a>')});
    $("#confirm-topic").bind('keypress', function(e){
        if ( e.keyCode == 13 )
            $( this ).find( 'input[type=submit]:first' ).click();
        });

})
