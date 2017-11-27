CREATE DOMAIN smalls as varchar(20);
CREATE DOMAIN mediums as varchar(100);
CREATE DOMAIN bigs as varchar(1000);
CREATE DOMAIN int_positive as Integer check (value > 0);
CREATE DOMAIN real_positive as Real check (value > 0);

CREATE TABLE Email (
    value mediums not null,
    primary key (value)
);

CREATE TABLE Img (
    path mediums not null,
    primary key (path)
);

CREATE TABLE Utente (
    id serial not null,
    conf boolean not null,
    username smalls not null,
    descr mediums not null,
    pass varchar(40) not null,
    sale smalls not null,
    email mediums not null,
    img mediums,
    primary key (id),
    foreign key (email) references Email(value),
    foreign key (img) references Img(path)
);

CREATE TABLE Cookie {
    ist timestamp not null,
    utente integer not null,
    scad timestamp not null,
    foreign key utente references Utente(id),
    check (ist < scad),
    primary key(ist, utente)
}

CREATE TABLE Chat (
    ist timestamp not null,
    nome smalls not null,
    descr mediums not null,
    utente integer not null,
    img mediums ,
    scad timestamp not null,
    primary key (ist),
    check (ist < scad),
    foreign key (img) references Img(path),
    foreign key (utente) references Utente(id)
);

CREATE TABLE Categoria (
    nome smalls not null,
    primary key (nome)
);

CREATE TABLE Chatcat(
    chat timestamp not null,
    categoria smalls not null,
    primary key (chat, categoria),
    foreign key (chat) references Chat(ist),
    foreign key (categoria) references Categoria(nome)
);

CREATE TABLE Messaggio (
    ist timestamp not null,
    utente integer not null,
    corpo bigs not null,
    chat timestamp not null,
    img mediums,
    primary key (ist,utente),
    foreign key (utente) references Utente(id),
    foreign key (chat) references Chat(ist),
    foreign key (img) references Img(path)
);

