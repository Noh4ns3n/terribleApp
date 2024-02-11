import express, { Request, Response, Router } from "express";
import db from "../database";
const router: Router = express.Router();

type ProjectT = {
  id?: number;
  name: string;
  description?: string;
  type?: string;
  url?: string;
  language?: string;
};

// FINDBYID PROJECT
router.get("/projects/:id", async (req: Request, res: Response) => {
    try {
        const project: unknown = await new Promise<unknown>((resolve, reject) => {
            db.get(
                "SELECT * FROM projects WHERE id = ?",
                req.params.id,
                (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                }
            );
        });
        if (project) {
            res.status(200).json({ project });
        } else {
            res.status(404).json({ error: "Project not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Service Error" });
    }
});

// FIND ALL PROJECTS
router.get("/projects", async (req: Request, res: Response) => {
    try {
        const projects: unknown[] = await new Promise<unknown[]>(
            (resolve, reject) => {
                db.all("SELECT * FROM projects", (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
            }
        );
        res.status(200).json({ projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Service Error" });
    }
});

// CREATE PROJECT
router.post("/projects/create", async (req: Request, res: Response) => {
    try {
        const { name, description, type, url, language } = req.body as ProjectT;
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }
        const result = await new Promise<number>((resolve, reject) => {
            const stmt = db.prepare(
                "INSERT INTO projects (name, description, type, url, language) VALUES (?, ?, ?, ?, ?)"
            );
            stmt.run(name, description, type, url, language, function (err: Error) {
                if (err) return reject(err);
                resolve(this.lastID);
            });
        });

        res.status(201).json({ id: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Service Error" });
    }
});

// UPDATE EXISTING PROJECT
router.put("/projects/update/:id", async (req: Request, res: Response) => {
    const projectId = req.params.id;
    const { name, description, type, url, language } = req.body as ProjectT;

    try {
        await new Promise<void>((resolve, reject) => {
            const stmt = db.prepare(
                "UPDATE projects SET name=?, description=?, type=?, url=?, language=? WHERE id=?"
            );
            stmt.run(
                name,
                description,
                type,
                url,
                language,
                projectId,
                function (err: Error) {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });

        res.status(200).json({ message: "Project updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Service Error" });
    }
});

// DELETE PROJECT
router.delete("/projects/delete/:id", async (req: Request, res: Response) => {
    const projectId = req.params.id;

    try {
        await new Promise<void>((resolve, reject) => {
            const stmt = db.prepare("DELETE FROM projects WHERE id=?");
            stmt.run(projectId, function (err) {
                if (err) return reject(err);
                resolve();
            });
        });

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Service Error" });
    }
});

export default router;
