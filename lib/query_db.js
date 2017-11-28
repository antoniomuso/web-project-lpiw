module.exports = {
    email_in_db (email) {
        return {
            // give the query a unique name
            name: 'email-in-db',
            text: 'SELECT count(*) as exist FROM Email WHERE value = $1',
            values: [email]
        }
    },
    insert_user (username, passH, sale, email, desc) {
        return {
            name: 'inser_user',
            text: 'INSERT INTO Utente(descr,conf, username, pass, sale, email, ist) values ($1,$2,$3,$4,$5,$6,current_timestamp);',
            values: [desc,false, username, passH, sale, email]
        }
    },
    user_with_same_username (username) {
        return {
            name: 'user_with_same_username',
            text: 'SELECT * FROME Utente WHERE username = $1 AND conf',
            values: [username]
        }
    },
    user_with_same_email ( email) {
        return {
            name: 'user_with_same_email',
            text: 'SELECT * FROME Utente WHERE email = $1 AND conf ',
            values: [email]
        }
    }
}
