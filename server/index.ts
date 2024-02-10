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
            res.status(200).json({user});
        } else {
            res.status(404).json({error : "User not found"});
        }}
    catch(error) {
        console.error(error);
        res.status(500).json({error : "Internal Service Error"});
    }
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});