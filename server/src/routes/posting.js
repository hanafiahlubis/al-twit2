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
    const results = await client.query("SELECT p.id_user, p.id, a.full_name, a.email, p.content, p.media, p.time_now, id_user FROM akun a INNER JOIN post_al p ON a.id = p.id_user ORDER BY p.time_now DESC");
    const twit = (await client.query(` select a.id, a.full_name, a.email, p1.id AS original_id, p1.content AS original_content, p1.media, p1.time_now, a2.id, a2.full_name,a2.email, p2.id AS retweet_id, p2.content AS retweet_content, p3.id AS retweet_retweet_id, p3.content AS retweet_retweet_content FROM post_al p1 left join  akun a  on p1.id_user = a.id  LEFT JOIN post_al p2 ON p1.id = p2.id_retweet left join akun a2 on p2.id_user_retweet  = a2.id LEFT JOIN post_al p3 ON p2.id = p3.id_retweet WHERE p1.id_retweet IS NULL`)).rows;


    const combinedData = results.rows.concat(twit);
    const postsWithImageUrls = combinedData.map(post => ({
        ...post,
        mediaUrl: `http://localhost:3000/${post.media}`
    }));

    // Urutkan data berdasarkan waktu yang paling besar     
    const sortedData = postsWithImageUrls.sort((a, b) => (b.retweet_id || b.id) - (a.retweet_id || a.id));
    res.json({
        data: sortedData
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