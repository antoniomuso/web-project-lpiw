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
    }
}
