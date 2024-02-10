import sqlite3 from "sqlite3";

const db = new sqlite3.Database("terribleApp.db");

db.serialize(() => {
    db.run(
        "CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)"
    );

    db.run(
        "INSERT INTO users (username, password) VALUES ('user', 'password')"
    );

    db.run(
        "INSERT INTO users (username, password) VALUES ('user1', 'password1')"
    );
});

export default db;