import express from "express";
import client from "../connection.js";


const router = express.Router();

router.get("/:id", async (req, res) => {
    console.log(req.params.id)
    const data = {}
    try {
        const result = await client.query("select * from akun where id = $1", [req.params.id]);

        const following = await client.query("select count(*) as following  from follower f where id_user  = $1  group  by id_user", [req.params.id]);
        const followers = await client.query("select count(*) as followers  from follower f where id_user_to  = $1  group  by id_user_to", [req.params.id]);
        const join_date = result.rows[0].join_date;
        console.log(followers)
        console.log(following)
        result.rows[0].join_date = join_date.toISOString().split('T')[0];

        console.log(result.rows[0].join_date)
        data.bio = result.rows[0];
        console.log(data)
        data.following = following.rows[0]?.following;
        console.log(data)
        data.followers = followers.rows[0]?.followers;
        console.log(result)
        res.json(data);
    } catch (err) {
        res.send(err)
    }
})

export default router;