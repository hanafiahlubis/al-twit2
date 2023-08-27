import express from "express";
import client from "../connection.js";
const router = express.Router();

router.get("/", async (req, res) => {
    const results = await client.query("select id_post,count(*) as banyak  from suka where chek = true group by id_post"); //banyak like
    res.json(results.rows)
});
router.post("/", async (req, res) => {
    await client.query("insert into suka(id_user,id_post,chek) values ($1,$2,$3)", [req.body.user, req.body.post, true]);
    res.send("Berhasil")
})
router.get("/check", async (req, res) => {
    const results = await client.query("select  * from suka where chek = true"); //check like
    res.json(results.rows)
});
router.delete("/:me/:id", async (req, res) => {
    await client.query("delete from suka where id_user  = $1 and id_post  = $2 ", [req.params.me, req.params.id]); //check like
    res.send("berhasil");
});
export default router