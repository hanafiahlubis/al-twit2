import express from "express";
import client from "../connection.js";

import multer from "multer";

const upload = multer({ dest: "public/photos", });
const type = upload.single('file')

const router = express.Router();

router.post("/add", type, async (req, res) => {
    console.log("aaaa")
    console.log(req.body)
    await client.query("insert into post_al (id_user,content,media,time_now) values($1,$2,$3,$4)", [req.body.user, req.body.content, req.file.filename, new Date()])
    res.send("berhasil")
});


router.get("/", async (_req, res) => {
    console.log("aaa");
    // const results = await client.query("SELECT p.id_user, p.id, a.full_name, a.email, p.content, p.media, p.time_now, id_user FROM akun a INNER JOIN post_al p ON a.id = p.id_user ORDER BY p.time_now DESC");
    const twit = (await client.query(` 
    WITH RECURSIVE retweet_chain AS (
        SELECT
            id,
            id_user,
            content,
            media,
            time_now,
            id_retweet,
            isi,
            id_user_retweet
        FROM
            post_al
        WHERE
            id_retweet IS NULL
        UNION ALL
        SELECT
            pa.id,
            pa.id_user,
            pa.content,
            pa.media,
            pa.time_now,
            pa.id_retweet,
            pa.isi,
            pa.id_user_retweet
        FROM
            retweet_chain rc
        JOIN
            post_al pa ON rc.id = pa.id_retweet
    )
    SELECT
        rc.id,
        rc.id_user,
        u.full_name ,
        u.email ,
        u.username ,
        rc.content,
        rc.media,
        rc.time_now,
        rc.id_retweet,
        rc.isi,
        COALESCE(a.username, '') AS retweeter_username,
        COALESCE(a.full_name, '') AS retweeter_full_name
    FROM
        retweet_chain rc 
        inner join akun u on u.id = rc.id_user 
    LEFT JOIN
        akun a ON rc.id_user_retweet = a.id
    ORDER BY
        rc.time_now DESC`)).rows;

    const follower = (await client.query(`select * from follower`)).rows;

    const postsWithImageUrls = twit.map(post => ({
        ...post,
        mediaUrl: `http://localhost:3000/${post.media}`
    }));

    const sortedData = postsWithImageUrls.sort((a, b) => (b.id) - (a.id));

    const count = (await client.query(`SELECT p.id, COALESCE(rt.retweets_count, 0) AS retweets_count FROM post_al p LEFT JOIN ( SELECT id_retweet, COUNT(*) AS retweets_count FROM post_al WHERE id_retweet IS NOT NULL GROUP BY id_retweet) rt ON p.id = rt.id_retweet LEFT JOIN ( SELECT id_retweet, COUNT(*) AS metweets_count FROM post_al WHERE id_retweet IS NOT NULL AND id_user_retweet IS NOT NULL GROUP BY id_retweet ) mt ON p.id = mt.id_retweet ORDER BY p.id DESC;`)).rows;

    const combinedData = sortedData.map(post => ({
        ...post,
        retweets_count: count.find(c => c.id === post.id)?.retweets_count || 0
    }));

    res.json({
        data: combinedData,
        follower
    });

})

router.get("/:id", async (req, res) => {
    console.log("aa")
    const results = (await client.query("select p.id, a.full_name,a.email,p.content,p.media,p.time_now,id_user  from akun a inner join post_al p on a.id = p.id_user and p.id_user  = $1 order by p.time_now desc", [req.params.id])).rows;
    const postsWithImageUrls = results.map(post => ({
        ...post,
        mediaUrl: `http://localhost:3000/${post.media}`
    }));
    const like = (await client.query("select id_post,count(*) as banyak  from suka where  chek  = true and id_post  in(select id from  post_al pa where id_user  = $1  )  group by id_post", [req.params.id])).rows;
    console.log(like)
    const comentar = (await client.query("select id_pos,count(*) as banyak  from commentar group by id_pos")).rows
    const check = (await client.query("select  * from suka where chek = true")).rows;
    res.json({
        data: postsWithImageUrls,
        like,
        comentar,
        check
    })
});

router.get("/by/:id", async (req, res) => {
    console.log("a")
    const results = (await client.query("select p.id, a.full_name,a.email,p.content,p.media,p.time_now,id_user  from akun a inner join post_al p on a.id = p.id_user and p.id = $1 ", [req.params.id])).rows;
    const postsWithImageUrls = results.map(post => ({
        ...post,
        mediaUrl: `http://localhost:3000/${post.media}`
    }));
    const like = (await client.query("select id_post,count(*) as banyak  from suka where  chek  = true and id_post  in(select id from  post_al pa where id  = $1  )  group by id_post", [req.params.id])).rows;
    console.log(like)
    const comentar = (await client.query("select id_pos,count(*) as banyak  from commentar group by id_pos")).rows;
    const contentComentar = (await client.query("select a.id,a.email,a.full_name ,c.* from commentar c inner join akun a on a.id = c.id_user and c.id_pos = $1", [req.params.id])).rows;
    const check = (await client.query("select  * from suka where chek = true")).rows;

    res.json({
        data: postsWithImageUrls,
        like,
        comentar,
        contentComentar,
        check
    })
});
router.get("/:me/:id", async (req, res) => {
    console.log("aaaaaaaaaaa")
    let results;
    if (req.params.me === req.params.id) {
        results = (await client.query("select * from post_al pa inner join akun a on pa.id_user = a.id  where pa.id in (select id_post from suka where chek = $1 and id_user = $2 ) order by pa.time_now desc", [true, req.params.me])).rows;
    } else {
        results = (await client.query("select * from post_al pa  where id_user = $1 and id in (select id_post from suka where chek = $2 and id_user = $3 ) order by time_now desc", [req.params.id, true, req.params.me])).rows;
    }
    const postsWithImageUrls = results.map(post => ({
        ...post,
        mediaUrl: `http://localhost:3000/${post.media}`
    }));
    const like = (await client.query("select id_post,count(*) as banyak  from suka where  chek  = true and id_post  in(select id from  post_al pa where id_user = $1  )   group by id_post", [req.params.id])).rows;
    console.log(like)
    const comentar = (await client.query("select id_pos,count(*) as banyak  from commentar group by id_pos")).rows
    const check = (await client.query("select  * from suka where chek = true")).rows;
    res.json({
        data: postsWithImageUrls,
        like,
        comentar,
        check
    })

})


export default router;