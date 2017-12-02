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
            text: 'SELECT * FROM Chat WHERE ist = $1 AND scad > current_timestamp;',
            values: [ist]
        }
    },
    insert_message_in_db (utente, chat, corpo, img) {
        return {
            name: 'insert_message_in_db',
            text: 'INSERT INTO Messaggio( utente, chat, corpo) VALUES (current_timestamp,$1, $2, $3);',
            values: [ utente, chat, corpo]
        }
    }
}
