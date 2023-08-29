import express from "express";
import client from "../connection.js";

const router = express.Router();

router.post("/", async (req, res) => {
    console.log(req.body)
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
    console.log(req.body)
    try {
        await client.query("delete from follower f where id_user  = $1 and id_user_to  = $2", [req.body.me, req.body.to]);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error);
    }
})


router.get("/:id", async (req, res) => {
    try {
        const results = (await client.query(`SELECT a.id, a.username, a.full_name, a.email
    FROM akun a
    LEFT JOIN follower f ON a.id = f.id_user_to AND f.id_user = $1
    WHERE f.id_user IS NULL AND a.id != $2`, [req.params.id, req.params.id])
        ).rows
        res.json(results);
    } catch (error) {
        res.status(500);
        res.send(error);
    }
});
export default router;