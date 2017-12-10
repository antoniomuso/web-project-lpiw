module.exports = {
    email_in_db (email) {
        return {
            // give the query a unique name
            name: 'email-in-db',
            text: 'SELECT * FROM Email WHERE value = $1;',
            values: [email]
        }
    },
    insert_user (username, passH, sale, email, desc) {
        return {
            name: 'inser_user',
            text: 'INSERT INTO Utente(descr,conf, username, pass, sale, email, ist) values ($1,$2,$3,$4,$5,$6,current_timestamp) RETURNING id;',
            values: [desc,false, username, passH, sale, email]
        }
    },
    user_with_same_username (username) {
        return {
            name: 'user_with_same_username',
            text: 'SELECT * FROM Utente WHERE username = $1 AND conf;',
            values: [username]
        }
    },
    user_with_same_email ( email) {
        return {
            name: 'user_with_same_email',
            text: 'SELECT * FROM Utente WHERE email = $1 AND conf;',
            values: [email]
        }
    },
    get_user_conf_with_username (username) {
        return {
            name: 'get_user_conf_with_username',
            text: 'SELECT * FROM Utente WHERE username = $1 AND conf;',
            values: [username]
        }
    },
    get_user_not_conf_with_id (id) {
        return {
            name: 'get_user_not_conf_with_id',
            text: 'SELECT * FROM Utente WHERE id = $1 AND NOT conf;',
            values: [id]
        }
    },
    conf_user_from_id (id) {
        return {
            name: 'conf_user_from_id',
            text: 'UPDATE Utente SET conf = TRUE WHERE id = $1 AND NOT conf;',
            values: [id]
        }
    },
    get_chat_from_time_stamp (ist) {
        return {
            name: 'chat_exist',
            text: "SELECT * FROM Chat WHERE ist = $1 AND scad > current_timestamp;",
            values: [ist]
        }
    },
    insert_message_in_db (utente, chat, corpo, img) {
        return {
            name: 'insert_message_in_db',
            text: 'INSERT INTO Messaggio( ist,utente, chat, corpo) VALUES (current_timestamp,$1, $2, $3);',
            values: [ utente, chat, corpo]
        }
    },
    insert_chat_in_db (utente, nome, desc, img) {
        return {
            name: 'insert_message_in_db',
            text: "INSERT INTO Chat( ist, utente, nome, descr, scad) VALUES (current_timestamp,$1, $2, $3, current_timestamp + interval '1 day') RETURNING ist;",
            values: [utente, nome, desc]
        }
    },
    get_chats_of_day () {
        return {
            name:'get_chats_of_day',
            text: "SELECT c.ist, c.descr, c.nome, c.img, u.username as creatore FROM Chat c, Utente u WHERE c.ist > current_timestamp - interval '23 hours' AND c.utente = u.id ORDER BY c.ist",
            values: []
        }
    },
    get_messages_of_chat (chat, intervalH) {
        return {
            name: 'get_messages_of_chat',
            text: "SELECT m.ist, m.utente , username, corpo, u.img FROM Messaggio m, Utente u WHERE m.chat = $1 AND m.ist > current_timestamp - interval '23 hours' AND m.utente = u.id ORDER BY m.ist",
            values: [chat]
        }
    },
    insert_img (path) {
        return {
            name: 'insert_img',
            text: "INSERT INTO Img(path) VALUES ($1);",
            values: [path]
        }
    },
    add_image_to_user(idUtente,img) {
        return {
            name: 'add_image_to_user',
            text: "UPDATE Utente SET img = $1 WHERE id = $2",
            values: [img,idUtente]
        }
    },
    get_user_img(id) {
        return {
            name: 'get_user_img',
            text: "SELECT img FROM Utente WHERE id = $1 and img IS NOT NULL",
            values: [id]
        }
    }
}
