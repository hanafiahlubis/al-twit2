import express from "express";
import client from "../connection.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        await client.query("insert into follower values(default, $1,$2,now())", [req.body.me, req.body.to])
        res.send("Berhasil MemFollow");
    } catch (error) {
        console.log(error)
        res.status(500);
        res.send(error);
    }

});

router.delete("/", async (req, res) => {
    try {
        await client.query("delete from follower f where id_user  = $1 and id_user_to  = $2", [req.body.me, req.body.to]);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error);
    }
})

export default router;