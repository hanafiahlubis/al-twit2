import express from "express";
import client from "../connection.js";


const router = express.Router();

router.get("/:id", async (req, res) => {
    const data = {}
    try {
        const result = await client.query("select * from akun where id = $1", [req.params.id]);

        const following = await client.query("select count(*) as following  from follower f where id_user  = $1  group  by id_user", [req.params.id]);
        const followers = await client.query("select count(*) as followers  from follower f where id_user_to  = $1  group  by id_user_to", [req.params.id]);
        const join_date = result.rows[0].join_date;
        result.rows[0].join_date = join_date.toISOString().split('T')[0];

        data.bio = result.rows[0];
        data.following = following.rows[0]?.following;
        data.followers = followers.rows[0]?.followers;
        res.json(data);
    } catch (err) {
        res.send(err)
    }
})

export default router;