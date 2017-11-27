begin transaction;
CREATE OR REPLACE FUNCTION V_messaggio_doposcad_or_mess_prima_di_chat() RETURNS trigger AS 
$V_messaggio_doposcad_or_mess_prima_di_chat$
declare
    ISERROR boolean;
begin
    ISERROR := EXISTS(
        select *
        from Chat c
        where NEW.chat = c.ist and ( c.ist > NEW.ist or NEW.ist < c.scad)
    );
    if ISERROR then
         raise exception 'Messaggio inserito su una chat scaduta, oppure istante iserimento messaggio sbagliato';
    end if;
    return NEW;
end;
$V_messaggio_doposcad_or_mess_prima_di_chat$ language plpgsql;

CREATE TRIGGER V_MESSAGGIO_DOPOSCAD_OR_MESS_PRIMA_DI_CHAT 
AFTER INSERT or UPDATE ON Messaggio 
FOR EACH ROW EXECUTE PROCEDURE V_messaggio_doposcad_or_mess_prima_di_chat();


CREATE OR REPLACE FUNCTION V_utente_non_conf_non_puo_messaggiare() RETURNS trigger AS 
$V_utente_non_conf_non_puo_messaggiare$
declare
    ISERROR boolean;
begin
    ISERROR := EXISTS(
        select *
        from Utente u
        where NEW.utente = u.id and not u.conf
    );
    if ISERROR then
         raise exception 'Un utente non conf non può messaggiare';
    end if;
    return NEW;
end;
$V_utente_non_conf_non_puo_messaggiare$ language plpgsql;

CREATE TRIGGER V_UTENTE_NON_CONF_NON_PUO_MESSAGGIARE 
AFTER INSERT or UPDATE ON Messaggio 
FOR EACH ROW EXECUTE PROCEDURE V_utente_non_conf_non_puo_messaggiare();



CREATE OR REPLACE FUNCTION V_utente_non_conf_non_puo_creare_chat() RETURNS trigger AS 
$V_utente_non_conf_non_puo_creare_chat$
declare
    ISERROR boolean;
begin
    ISERROR := EXISTS(
        select *
        from Utente u
        where NEW.utente = u.id and not u.conf
    );
    if ISERROR then
         raise exception 'Un utente non conf non può creare chat';
    end if;
    return NEW;
end;
$V_utente_non_conf_non_puo_creare_chat$ language plpgsql;

CREATE TRIGGER V_UTENTE_NON_CONF_NON_PUO_CREARE_CHAT 
AFTER INSERT or UPDATE ON Chat 
FOR EACH ROW EXECUTE PROCEDURE V_utente_non_conf_non_puo_creare_chat();



CREATE OR REPLACE FUNCTION V_utente_cookie_precedente_registrazione() RETURNS trigger AS 
$V_utente_cookie_precedente_registrazione$
declare
    ISERROR boolean;
begin
    ISERROR := EXISTS(
        select *
        from Utente u
        where NEW.utente = u.id and u.ist > NEW.ist
    );
    if ISERROR then
         raise exception 'Non puoi assegnare un cookie ad un utente prima che si registri';
    end if;
    return NEW;
end;
$V_utente_cookie_precedente_registrazione$ language plpgsql;

CREATE TRIGGER V_UTENTE_COOKIE_PRECEDENTE_REGISTRAZIONE 
AFTER INSERT or UPDATE ON Cookie 
FOR EACH ROW EXECUTE PROCEDURE V_utente_cookie_precedente_registrazione();



CREATE OR REPLACE FUNCTION V_utente_conf_stessa_email() RETURNS trigger AS 
$V_utente_conf_stessa_email$
declare
    ISERROR boolean;
begin
    ISERROR := EXISTS(
        select *
        from Utente u
        where NEW.id <> u.id and NEW.conf and u.conf and NEW.email = u.email
    );
    if ISERROR then
         raise exception 'Ci sono due utenti con la stessa email confermati';
    end if;
    return NEW;
end;
$V_utente_conf_stessa_email$ language plpgsql;

CREATE TRIGGER V_UTENTE_CONF_STESSA_EMAIL 
BEFORE INSERT or UPDATE ON Utente 
FOR EACH ROW EXECUTE PROCEDURE V_utente_conf_stessa_email();


CREATE OR REPLACE FUNCTION V_utenti_stesso_username_autenticati() RETURNS trigger AS 
$V_utenti_stesso_username_autenticati$
declare
    ISERROR boolean;
begin
    ISERROR := EXISTS(
        select *
        from Utente u
        where NEW.id <> u.id and NEW.username = u.username and u.conf and NEW.conf
    );
    if ISERROR then
         raise exception 'Ci sono due utenti con la stesso username confermati';
    end if;
    return NEW;
end;
$V_utenti_stesso_username_autenticati$ language plpgsql;

CREATE TRIGGER V_UTENTI_STESSO_USERNAME_AUTENTICATI 
BEFORE INSERT or UPDATE ON Utente 
FOR EACH ROW EXECUTE PROCEDURE V_utenti_stesso_username_autenticati();


commit;
