const fadeIn = 1000
const chatListName = "chatListName";
var chatList = {}
var currentIst = null
var modalitaEnum = {
    MOBILE: 0,
    DESKTOP: 1
};
var userData = {}
var modalita;

$(document).ready(function () {
    //nascondi la chat da mobile
    if ($(document).width() <= 600) {
        modalita = modalitaEnum.MOBILE
        $(".mobile-chat").css("display", "none")
    }
    getUserData((error, data) => {
        if (error) return console.error(error)
        userData.username = data.username
        userData.idUser = data.id
        userData.img = data.img
    })

    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal()
    // Inserisco callback di pressione dell'invio, per l'invio dei messaggi 
    $("#input-chat").keydown(callBackKeyPressed)


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
function reciveMessFrom(otherName, message, time, link_img) {
    var object = $(`<li class="other">
        <div class="avatar">
            <img class='cricle #c5cae9 indigo lighten-4' src="${link_img}" draggable="false" />
        </div>
        <div class="msg">
            <p style='word-wrap:normal;'><b>${otherName}:</b></p>
            <p>${message}</p>
            <time>${time}</time>
        </div>
    </li>`)
    //(new Date()).toLocaleTimeString()
    object.find('.avatar').hide()
    object.find('.msg').hide()
    var ol = object.appendTo('#chats')
    ol.find('.avatar').fadeIn();
    ol.find('.msg').toggle('bounce')
    return ol[0].children[ol[0].children.length - 1]
}
// Prende in input un nome utente un messaggio, Dovrebbe prendere anche avatar ecc...
// restituisce il messaggio html aggiunto
function sendMessage(name, message, time, link_img, notEscape) {
    //console.log(message)
    var object = $(
        `<li class="self">
        <div class="avatar">
        <img class='cricle #c5cae9 indigo lighten-4' src="${link_img}" draggable="false" />
        </div>
        <div class="msg">
        <p>${ notEscape ? message : escapeHtml(message)}</p>
        <time>${time}</time>
        </div>
        </li>`)
    object.find('.avatar').hide()
    object.find('.msg').hide()
    var ol = object.appendTo('#chats')
    ol.find('.avatar').fadeIn();
    ol.find('.msg').toggle('bounce')
    return ol[0].children[ol[0].children.length - 1]
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Rimuove li dalla lista
function liRemoveAnimation(element) {
    if (typeof element === 'string') var element = $(element)
    //console.log(typeof element)
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
    //console.log('call')
    if (e.which == 13) {
        if (this.value === '') return
        var msg = sendMessage('Giovanni Varricchione', this.value, (new Date()).toLocaleTimeString(), 'https://scontent-mxp1-1.xx.fbcdn.net/v/t1.0-9/20770225_10212100619488480_2709822859667583246_n.jpg?oh=2aced0a77a1238729b5fc0886ae1f28a&oe=5AD25825')
        socket.emit('message', this.value)
        //console.log(msg)
        $(this).val('')
        $('#chat').stop().animate({
            scrollTop: msg.offsetTop
        }, 2000)
    }
}

function liShowAnimation(element) {
    if (typeof element === 'string') var element = $(element)
    element.velocity({ translateX: "-100px" }, { duration: 0 });
    element.velocity({ opacity: "1", translateX: "0" }, { duration: 800, delay: 0, easing: [60, 10] })
}

//GET TIME STAMP FROM DB
function setTimeStamp(chat) {
    chat.timeStamp = window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now();
}

function appendNewChatToDocument(chat) {
    $(`<li style='list-style-type: none;'><a href="#!" onclick="openChat(this)" class="collection-item tooltipped" data-position="right" data-delay="50" data-tooltip="${chat.chatDesc} <p><b><i>${chat.creatorUser}</i></b></p>" id="${chat.timeStamp}"> ${chat.chatName} </a></li>`).prependTo('#list-chat')
    //addTooltipItem(chat.timeStamp, chat.chatDesc);
}

function appendNewChatToDocumentWithAnimation(chat) {
    let c = $(`<li style='list-style-type: none;'><a href="#!" onclick="openChat(this)" class="collection-item tooltipped" data-position="right" data-delay="50" data-tooltip="${chat.chatDesc} <p><b><i>${chat.creatorUser}</i></b></p>" id="${chat.timeStamp}"> ${chat.chatName} </a></li>`)
    liShowAnimation(c.prependTo('#list-chat').first())
    //addTooltipItem(chat.timeStamp, chat.chatDesc);

}

function createNewChat(chatName, chatDesc, ist, creatorUser, noAnimation) {
    var chat = { chatName: chatName, chatDesc: chatDesc, timeStamp: ist, creatorUser: creatorUser };
    if (!ist) setTimeStamp(chat);
    saveChat(chat);
    if (!noAnimation) appendNewChatToDocumentWithAnimation(chat);
    else appendNewChatToDocument(chat)
    $('.tooltipped').tooltip({ delay: 50, html: true }); // Mostra le descrizioni           
}

function loadChats() {
    //chatList = {};
    //Faccio una richiesta al server e chiedo le chat
    getChats((error, obj) => {
        if (error) return console.error(error)
        //console.log(obj)
        obj.forEach(chat => createNewChat(chat.nome, chat.descr, chat.ist, chat.creatore, true))
        Materialize.showStaggeredList('#list-chat') // Animazione lista delle chat
    })
}

function saveChat(chat) {
    chatList[chat.timeStamp] = chat;
    //console.log(chatList);
    localStorage.chatListName = JSON.stringify(chatList);
}

function remove(chatTimeStamp) {
    delete chatList[chatTimeStamp];
    localStorage.chatListName = JSON.stringify(chatList);
}

function chatSubmitClicked() {
    var chatName = $("#topic").val();
    var chatDesc = $("#description").val();
    if (chatName.length <= 20)///da sistemare. per non fare i nomi delle chat lunghissime: ci vorrebbe un avviso se superano tale dim
        if (chatName && chatDesc) {
            // creo la room e aspetto che mi ritorni il time stamp
            socket.emit('createRoom', { nome: chatName, desc: chatDesc }, (ist) => {
                createNewChat(chatName, chatDesc, ist, userData.username);
                $("#div-create-new-chat").css("display", "none")
                $("#topic").val("")
                $("#description").val("")
                var list = document.getElementById("list-chat").firstChild
            })
            //setTimeout(function () { list.className += " show"; }, 10)
        }
}

function timestampParse (string) {
    return string.slice(0,string.lastIndexOf("."))
}


function reset($elem) {
    $elem.before($elem.clone(true));
    var $newElem = $elem.prev();
    $elem.remove();
    return $newElem;
}

function openChat(chat) {
    //Animazione per far apparire chat
    var containerChat = $('#container-chat');
    containerChat.removeClass("animated bounceInLeft");
    containerChat = reset(containerChat);
    var ist = $(chat).attr('id')
    if (ist != currentIst) {
        // Faccio il join alla chat 
        socket.emit('join', ist, (conf) => {
            if (!conf) return
            currentIst = ist
            removeLiMessage()
            getMessage(ist, 4, (error, data) => {
                if (error) console.error(error)
                // Ultimo messaggio della chat 
                var last = undefined;
                for (let mess of data) {
                    if (mess.utente === userData.idUser) {
                        last = sendMessage(null, mess.corpo, timestampParse(mess.ist), 'https://scontent-mxp1-1.xx.fbcdn.net/v/t1.0-9/20770225_10212100619488480_2709822859667583246_n.jpg?oh=2aced0a77a1238729b5fc0886ae1f28a&oe=5AD25825', true)
                    } else {
                        last = reciveMessFrom(mess.username, mess.corpo, timestampParse(mess.ist), 'http://dreamicus.com/data/ghost/ghost-08.jpg')
                    }
                }
                if (last) {
                    $('#chat').scrollTo(last)
                }
            })
            $("#name-chat-statebar").text($(chat).text())
            if (modalita == modalitaEnum.MOBILE) {
                $(".mobile-chat").css("display", "inherit")
                $(".mobile-list").css("display", "none")
            }
            containerChat.addClass('animated bounceInLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function () {
                $(this).removeClass('animated bounceInLeft');
            });
        })
    }
}

function removeLiMessage() {
    var chat = $('#chats').empty()
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
    var containerChat = $("#div-create-new-chat");
    if (containerChat.is(":hidden")) {
        $("#div-create-new-chat").css("display", "inherit")
        //attendi che finisca l'animazione
        containerChat.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function () {
            });
        containerChat.removeClass("animated bounceIn");
        containerChat = reset(containerChat);
        containerChat.addClass('animated bounceIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function () {
                $(this).removeClass('animated bounceIn');
            });
    }
}

//Funzione usata per controllare se il click ha colpito la nuvoletta usata per aggiungere nuove chat
$(document).mouseup(function (e) {
    var containerSubmit = $("#div-create-new-chat");
    var containerButton = $("#btn-add-chat");

    // if the target of the click isn't the container nor a descendant of the container
    // And the target is not the add button
    if ((!containerButton.is(e.target)
        && containerButton.has(e.target).length === 0)
        && !containerSubmit.is(e.target)
        && containerSubmit.has(e.target).length === 0
        && !(containerSubmit.is(":hidden"))) //controlla se la nuvoletta è nascosta(Qui si presentava il problema dell'effetto speciale indesiderato)
    {

        //attendi che l'animazione finisca
        containerSubmit.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function () {
            });
        containerSubmit.removeClass("animated bounceOut");
        containerSubmit.addClass('animated bounceOut').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
            function () {
                $(this).removeClass('animated bounceOut');
                containerSubmit.hide();
            });
    }
});