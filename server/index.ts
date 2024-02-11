import express from "express";
import userRoutes from "./src/routes/user.route";
import projectsRoutes from "./src/routes/projects.route";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(userRoutes);
app.use(projectsRoutes);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
