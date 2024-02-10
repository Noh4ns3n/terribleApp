import express, { Request, Response } from "express";
import db from "./src/database";

const app = express();
const port = 3000;

app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.get("/user/:id", async (req : Request, res : Response) => {
    try {
        const user : unknown = await new Promise<unknown>((resolve, reject) => {
            db.get("SELECT * FROM users WHERE id = ?", req.params.id, (err, row) => {
                if (err) return reject(err);
                resolve(row);
            });
        });
        if(user) {
            const userJSON = JSON.stringify(user, null, 2);
            res.json(`User information : ${userJSON}`);
        }}
    catch(error) {
        console.error(error);
        res.status(500).send("Internal Service Error");
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});