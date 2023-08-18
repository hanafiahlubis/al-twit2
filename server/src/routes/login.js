import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";
import client from "../connection.js";

const router = express.Router();
const app = express();

router.post("/daftar", async (req, res) => {
    const results = await client.query("select email from akun where email = $1 ", [req.body.email]);

    if (results.rows.length > 0) {
        res.status(500);
        res.send("email Sudah ada");
    } else {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(req.body.password, salt);
        await client.query(
            "insert into akun (username, full_name, email, password, join_date) values ($1, $2, $3, $4, $5)",
            [req.body.username, req.body.full_name, req.body.email, hash, new Date()]
        );
        res.send("Akun berhasil ditambahkan.");
    }
});

router.put("/forgout", async (req, res) => {
    const results = await client.query("select email from akun where email = $1 ", [req.body.email]);
    console.log(results.rows.length > 0)

    if (results.rows.length > 0) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(req.body.password, salt);
        await client.query("update akun set password = $1 ", [hash]);
        res.send("Berhasil di ubah")
    } else {
        res.status(401);
        res.send("Tidak di temukan");
    }
})
app.use(cookieParser());

app.use((req, res, next) => {
    if (req.cookies.token) {
        try {
            req.me = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
            authorized = true;
        } catch (err) {
            res.setHeader("Cache-Control", "no-store"); // khusus Vercel
            res.clearCookie("token");
        }
    } else {
        if (req.path.startsWith("/api")) {
            res.status(401);
            next()
            res.send("Anda harus login terlebih dahulu.");
        }

    }
});

// Untuk mengakses file statis(khusus Vercel)

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
router.use(express.static(path.join(__dirname, "public")));

router.post("/", async (req, res) => {
    const results = await client.query(
        `SELECT * FROM akun WHERE email = '${req.body.email}'`
    );
    if (results.rows.length > 0) {
        if (await bcrypt.compare(req.body.password, results.rows[0].password)) {
            const token = jwt.sign(results.rows[0], process.env.SECRET_KEY);
            res.cookie("token", token);
            res.send("Login berhasil.");
        } else {
            res.status(401);
            res.send("Kata sandi salah.");
        }
    } else {
        res.status(401);
        res.send("Username tidak ditemukan.");
    }
});

export default router;