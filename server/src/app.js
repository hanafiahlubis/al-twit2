import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import login from "./routes/login.js"
import posting from "./routes/posting.js"
const app = express();
const router = express.Router()

app.use(express.json());
// Twital

app.use(cors({ origin: "http://localhost:5173" }));
router.use("/login", login);

// app.use(cookieParser());
//  app.use((req, res, next) => {
// if (req.path === "/api/login/" || req.path.startsWith("/assets")) {
//     next();
// } else {
// let authorized = false;
//     if (req.cookies.token) {
//         try {
//             req.me = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
//             authorized = true;
//             next();
//         } catch (err) {
//             res.setHeader("Cache-Control", "no-store"); // khusus Vercel
//             res.clearCookie("token");
//         }
//     }
// if (authorized) {
//     if (req.path.startsWith("/login")) {
//         res.redirect("/");
//     } else {
//         next();
//     }
// } else {
// if (req.path.startsWith("/login")) {
//     next();
// }
// else {
// if (req.path.startsWith("/api")) {
//     res.status(401);
//     res.send("Anda harus login terlebih dahulu.");
// } else {
//     res.redirect("/login");
//     // }
//     // }
// }
// }
// });
// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "public")));

router.use("/posting", posting);
app.use("/api", router);


const PORT = 3000;
app.listen(PORT, console.log(`server sedang berjalan di port ${PORT}`));

