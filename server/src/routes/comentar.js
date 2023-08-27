import express from "express";
import client from "../connection.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        res.json(((await client.query("select id_pos,count(*) as banyak  from commentar  group by id_pos")).rows))
    } catch (err) {
        res.status(500);
        res.send("Gagal");
    }
});
router.post("/", async (req, res) => {
    try {
        await client.query("insert  into commentar(id_pos,id_user,content,time_now) values($1,$2,$3,$4)", [req.body.id_post, req.body.user, req.body.commentar, new Date()])
        res.send("Behasil");
    } catch (err) {
        res.status(500);
        res.send("Gagal");
    }
});

export default router;