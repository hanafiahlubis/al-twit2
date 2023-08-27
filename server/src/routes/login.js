import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
// import cookieParser from "cookie-parser";
import client from "../connection.js";

const router = express.Router();

async function chekEmail(email) {
    return await client.query("select * from akun where email = $1 ", [email])
}
router.post("/check", async (req, res) => {
    if ((await chekEmail(req.body.email)).rows.length > 0) {
        res.send("Berhasil mengambil");
    } else {
        res.status(401);
        res.send("Email Tidak Di temukan");
    }
})


router.post("/daftar", async (req, res) => {
    console.log(req.body)
    const results = await chekEmail(req.body.email);
    if (results.rows.length > 0) {
        res.status(401);
        res.send("email Sudah ada");
    } else {
        const salt = await bcrypt.genSalt(); // fdsfsfs
        const hash = await bcrypt.hash(req.body.password, salt);

        await client.query(
            "insert into akun (username, full_name, email, password, join_date) values ($1, $2, $3, $4, $5)",
            [req.body.username, req.body.full_name, req.body.email, hash, new Date()]
        );
        res.send("Akun berhasil ditambahkan.");
    }
});

router.put("/forgout", async (req, res) => {
    // console.log(req.body)
    const results = await chekEmail(req.body.email);

    if (results.rows.length > 0) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(req.body.password, salt);
        await client.query("update akun set password = $1  where email = $2 ", [hash, req.body.email]);
        res.send("Berhasil di ubah")
    } else {
        res.status(401);
        res.send("Tidak di temukan");
    }
})

// Untuk mengakses file statis(khusus Vercel)

router.post("/", async (req, res) => {
    const user = (await chekEmail(req.body.email)).rows;
    console.log(user)
    if (user.length > 0) {
        if (await bcrypt.compare(req.body.password, user[0].password)) {
            res.json({ token: jwt.sign(user[0], process.env.SECRET_KEY), user: user[0] });
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

