import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
// import cookieParser from "cookie-parser";
import client from "../connection.js";
import auth from "../middlewares/auth.js"
const router = express.Router();

async function chekEmail(email) {
    return await client.query("select * from akun where email = $1 ", [email])
}

router.post("/check", async (req, res) => {
    try {
        const result = await chekEmail(req.body.email);
        if (result.rows.length > 0) {
            res.status(200).json({
                success: true,
                message: "Berhasil mengambil data pengguna.",
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Email tidak ditemukan.",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server.",
        });
    }
});

// async function a() {
//     const salt = await bcrypt.genSalt(); // fdsfsfs
//     const hash = await bcrypt.hash("123456789", salt);
//     console.log(hash);

// }

// a();
router.post("/daftar", async (req, res) => {
    try {
        const results = await chekEmail(req.body.email);
        if (results.rows.length > 0) {
            return res.status(401).json({
                message: "email Sudah ada",
                status: 401
            });
        } else {
            const salt = await bcrypt.genSalt(); // fdsfsfs
            const hash = await bcrypt.hash(req.body.password, salt);

            await client.query(
                "insert into akun (username, full_name, email, password, join_date) values ($1, $2, $3, $4, $5)",
                [req.body.username, req.body.full_name, req.body.email, hash, new Date()]
            );
            return res.status(201).json({
                message: "Akun berhasil ditambahkan",
                status: 201
            });
        }
    } catch (error) {
        return res.status(500).json({
            data: JSON.stringify(error),
            message: "Maaf sedang ada gangguan!!!",
            status: 500
        });
    }
});

router.put("/forgout", async (req, res) => {
    try {
        const results = await chekEmail(req.body.email);

        if (results.rows.length > 0) {
            const salt = await bcrypt.genSalt();
            const hash = await bcrypt.hash(req.body.password, salt);

            await client.query("UPDATE akun SET password = $1 WHERE email = $2", [hash, req.body.email]);

            res.status(200).json({
                success: true,
                message: "Password berhasil diubah.",
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Email tidak ditemukan.",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server. Silakan coba lagi.",
        });
    }
});


// Untuk mengakses file statis(khusus Vercel)

router.post("/", async (req, res) => {

    const user = (await chekEmail(req.body.email)).rows;

    if (user.length > 0) {
        if (await bcrypt.compare(req.body.password, user[0].password)) {
            const token = jwt.sign(user[0], process.env.SECRET_KEY);
            res
                .cookie("jwt", token, {
                    httpOnly: true,
                    // secure: true,
                })
                .send("Login berhasil.");
            // res.json({ token: jwt.sign(user[0], process.env.SECRET_KEY), user: user[0] });
        } else {
            res.status(401);
            res.send("Kata sandi salah.");
        }
    } else {
        res.status(401);
        res.send("Username tidak ditemukan.");

    }
});
router.use(auth)
router.get("/me", (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(404);
        res.send("belum login")
    }
});

router.post("/logout", (_req, res) => {
    res.clearCookie("jwt").send("Logout berhasil.");
});
export default router;

