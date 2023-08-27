import express from "express";
import client from "../connection.js";

const router = express.Router();

router.post("/", async (req, res) => {
    console.log(req.body)
    try {
        await client.query("insert into post_al  values(default, $1, $2, $3, now(),$4, $5, $6)", [req.body.id_user, req.body.content, req.body.media, req.body.id, req.body.isi, req.body.user])
        // await client.query("insert into post_al (id_retweet,isi ,id_user_retweet,time_now) values($1,$2,$3,now())", [req.body.retweet, req.body.isi, req.body.user_retweet])
        res.send("Berhasil");
    } catch (error) {
        console.log(error)
        res.status(500);
        res.send(error);
    }
});
router.get("/", async (req, res) => {
    try {
        const results = (await client.query("SELECT id_retweet, COUNT(*) FROM post_al WHERE id_retweet IS NOT NULL GROUP BY id_retweet")).rows;

        // Menggunakan metode .find untuk mencari data yang memiliki id_retweet yang tidak null atau kosong
        // const data = results.find((result) => result.id_retweet !== null);

        res.json(results)
    } catch (error) {
        res.status(500);
        res.send(error)
    }
})
router.post("/a", async (req, res) => {
    console.log(req.body);
    try {
        await client.query("INSERT INTO post_al (id_retweet, content, id_user_retweet, time_now) VALUES ($1, $2, $3, now())", [req.body.retweet, req.body.isi, req.body.user_retweet]);
        res.send("Berhasil membuat retweet.");
    } catch (error) {
        res.status(500);
        res.send(error);
    }
});

router.get("/count", async (req, res) => {
    try {
        const results = (await client.query("SELECT id_retweet, COUNT(*) FROM post_al WHERE id_retweet IS NOT NULL GROUP BY id_retweet")).rows;
        res.json(results);
    } catch (error) {
        res.status(500);
        res.send(error);
    }
});

router.get("/retweeted-retweeted", async (req, res) => {
    try {
        const query = `
        select	
        a.id,
        a.full_name ,
        a.email  ,
     p1.id AS original_id,
     p1.content AS original_content,
     p1.media,
     p1.time_now,
     a2.id,
        a2.full_name ,
        a2.email  ,
     p2.id AS retweet_id,
     p2.content AS retweet_content,
     p3.id AS retweet_retweet_id,
     p3.content AS retweet_retweet_content
 FROM
     post_al p1
     left join  akun a  on p1.id_user = a.id  
  
 LEFT JOIN
     post_al p2 ON p1.id = p2.id_retweet 
     left join akun a2 on p2.id_user_retweet  = a2.id
 LEFT JOIN
     post_al p3 ON p2.id = p3.id_retweet
 WHERE
     p1.id_retweet IS NULL
            `;

        const results = (await client.query(query)).rows;
        res.json(results);
    } catch (error) {
        res.status(500);
        res.send(error);
    }
});

router.get("/retweet-chain", async (req, res) => {
    try {
        const query = `
            SELECT 
                pr.id AS original_post_id,
                pr.content AS original_content,
                pr.media AS original_media,
                pr.id_user AS original_user_id,
                au.full_name AS original_user_full_name,
                au.email AS original_user_email,
                pr.time_now AS original_time_now,
                rt.id AS retweet_id,
                rt.content AS retweet_content,
                rt.media AS retweet_media,
                rt.id_user AS retweet_user_id,
                rt.time_now AS retweet_time_now,
                ar.full_name AS retweet_user_full_name,
                ar.email AS retweet_user_email
            FROM 
                post_al pr
            JOIN 
                post_al rt ON pr.id = rt.id_retweet
            JOIN 
                akun au ON pr.id_user = au.id
            JOIN 
                akun ar ON rt.id_user = ar.id
            WHERE 
                pr.id_retweet IS NULL;
        `;

        const results = await client.query(query);
        res.json(results.rows);
    } catch (error) {
        res.status(500);
        res.send(error);
    }
});

export default router;