import express, { Request, Response, Router } from "express";
import db from "../database";
import { generateToken, verifyPassword, hashPassword } from "../auth";

const router: Router = express.Router();

// GET USER
router.get("/user/:id", async (req: Request, res: Response) => {
    try {
        const user: unknown = await new Promise<unknown>((resolve, reject) => {
            db.get("SELECT * FROM users WHERE id = ?", req.params.id, (err, row) => {
                if (err) return reject(err);

                resolve(row);
            });
        });
        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Service Error" });
    }
});

// LOGIN USER
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const isValid = await verifyPassword(username, password);

    if (!isValid) {
        return res
            .status(401)
            .json({ error: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    const token = generateToken(username);
    return res.status(200).json({ token });
});

// REGISTER USER
router.post("/register", async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: "no body provided" });
    }
    const { username, password } = req.body;
    const existingUser = await new Promise<boolean>((resolve, reject) => {
        db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
            if (err) return reject(err);
            resolve(!!row);
        });
    });
  
    if (existingUser) {
        return res.status(400).json({ error: "Cet utilisateur existe déjà" });
    }
  
    const hashedPassword = await hashPassword(password);
  
    db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword],
        (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: "Erreur lors de l'enregistrement de l'utilisateur" });
            }
  
            const token = generateToken(username);
            return res.status(201).json({ token });
        }
    );
});

export default router;
