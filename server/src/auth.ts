/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "./database";

const JWT_SECRET = "votre_secret"; // TODO mettre vraie clef dans le .env

const generateToken = (username: string) => {
    return jwt.sign({ username }, JWT_SECRET, { expiresIn: "365d" });
};

const hashPassword = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (username: string, password: string) => {
    return new Promise<boolean>((resolve, reject) => {
        db.get("SELECT * FROM users WHERE username = ?", [username], (err, row : any) => {
            if (err) return reject(err);
            if (!row) return resolve(false);

            bcrypt.compare(password, row.password, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    });
};

export {generateToken, verifyPassword, hashPassword};