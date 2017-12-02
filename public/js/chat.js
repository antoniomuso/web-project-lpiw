const fadeIn = 1000
const chatListName = "chatListName";
var snd = new Audio("/sound/pling.wav")
var chatList;
var modalitaEnum = {
    MOBILE: 0,
    DESKTOP: 1
};
var modalita;

$(document).ready(function () {
    //nascondi la chat da mobile
    if ($(document).width() <= 600) {
        modalita = modalitaEnum.MOBILE
        $(".mobile-chat").css("display", "none")
    }
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    w3.includeHTML(() => { // callback di fine embedd
        $('#input-chat').keydown(callBackKeyPressed)
    }) // embedda chat_div in questa pagina html

    $(".profile-collapse").sideNav()
    $("#confirm-topic").click(chatSubmitClicked);
    $("#description").bind('keypress', function (e) {
        if (e.keyCode == 13)
            $("#confirm-topic").click()
    });
    loadChats()
})

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

// Rimuove li dalla lista
function liRemoveAnimation (element) { 
    if (typeof element === 'string' ) var element = $(element)
    console.log(typeof element)
    //element.velocity({ translateX: "-100px" }, { duration: 0 });
    element.velocity({ opacity: "0", translateX: "-100px" }, { duration: 800, delay: 0, easing: [60, 10] })
}

function hideShowChat() {
    $('#chat').toggle('bounce')
}

function backToChat() {
    $(".mobile-chat").css("display", "none")
    $(".mobile-list").css("display", "inherit")

}
function selectedChat(chat) {
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

function liShowAnimation(element) {
    if (typeof element === 'string' ) var element = $(element)
    element.velocity({ translateX: "-100px" }, { duration: 0 });
    element.velocity({ opacity: "1", translateX: "0" }, { duration: 800, delay: 0, easing: [60, 10] })
}

//GET TIME STAMP FROM DB
function setTimeStamp(chat) {
    chat.timeStamp = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
}

function appendNewChatToDocument(chat) {
    $(`<li style='list-style-type: none;'><a href="#!" onclick="openChat(this)" class="collection-item"> ${chat.chatName} </a></li>`).prependTo('#list-chat')
}

function appendNewChatToDocumentWithAnimation(chat) {
    let c = $(`<li style='list-style-type: none;'><a href="#!" onclick="openChat(this)" class="collection-item"> ${chat.chatName} </a></li>`)
    liShowAnimation(c.prependTo('#list-chat').first())
}

function createNewChat(chatName, chatDesc, ist) {
    var chat = { chatName: chatName, chatDesc: chatDesc, timeStamp: ist };
    if (!ist) setTimeStamp(chat);
    saveChat(chat);
    appendNewChatToDocumentWithAnimation(chat);
}

function loadChats() {
    chatList = {};
    //var s = $('#list-chat').hide()
    var loadedChats = JSON.parse(localStorage.chatListName);
    if (loadedChats)
        chatList = loadedChats;
    console.log(chatList)
    for (let ind in chatList) {
        var chat = chatList[ind];
        appendNewChatToDocument(chat);
    }
    Materialize.showStaggeredList('#list-chat')

}

function saveChat(chat) {
    chatList[chat.timeStamp] = chat;
    console.log(chatList);
    localStorage.chatListName = JSON.stringify(chatList);
}

function remove(chatTimeStamp) {
    delete chatList[chatTimeStamp];
    localStorage.chatListName = JSON.stringify(chatList);
}

function chatSubmitClicked() {
    var chatName = $("#topic").val();
    var chatDesc = $("#description").val();
    if (chatName.length <= 30)///da sistemare. per non fare i nomi delle chat lunghissime: ci vorrebbe un avviso se superano tale dim
        if (chatName && chatDesc) {
            createNewChat(chatName, chatDesc);
            $("#div-create-new-chat").css("display", "none")
            $("#topic").val("")
            $("#description").val("")
            var list = document.getElementById("list-chat").firstChild
            //setTimeout(function () { list.className += " show"; }, 10)
            //snd.play();
        }

}

//non so se avete fatto una funzione. quando clicchi sulla chat nella lista fa tornare la barra
function openChat(chat) {
    if (modalita == modalitaEnum.MOBILE) {
        $(".mobile-chat").css("display", "inherit")
        $(".mobile-list").css("display", "none")
    }
    $("#name-chat-statebar").text($(chat).text())

}
function resizeWindow() {
    var oldModalita = modalita
    if ($(document).width() <= 600)
        modalita = modalitaEnum.MOBILE
    else
        modalita = modalitaEnum.DESKTOP

    if (!modalita == oldModalita) {
        if (modalita == modalitaEnum.MOBILE) {
            $(".mobile-list").css("display", "inherit")
            $(".mobile-chat").css("display", "none")
        }
        else {
            $(".mobile-list").css("display", "inherit")
            $(".mobile-chat").css("display", "inherit")
        }
    }
}
function showAddChatMenu() {
    $("#div-create-new-chat").css("display", "inherit")
}

$(document).mouseup(function (e) {
    var container = $("#div-create-new-chat");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
    }
});