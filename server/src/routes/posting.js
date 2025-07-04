import express from "express";
import client from "../connection.js";

import multer from "multer";

const upload = multer({ dest: "public/photos", });
const type = upload.single('file')

const router = express.Router();


const deletePostAndRelatedData = async (postId) => {
  try {
    // Mulai transaksi untuk menjaga konsistensi data
    await client.query('BEGIN');

    // CTE untuk menemukan post yang merujuk ke post utama (id = 1)
    await client.query(`
      WITH RECURSIVE post_hierarchy AS (
        -- Mulai dengan post yang memiliki id_retweet = $1
        SELECT id, id_retweet
        FROM post_al
        WHERE id_retweet = $1
        UNION ALL
        -- Temukan post yang merujuk ke post sebelumnya
        SELECT p.id, p.id_retweet
        FROM post_al p
        JOIN post_hierarchy ph ON ph.id = p.id_retweet
      )
      DELETE FROM post_al WHERE id IN (SELECT id FROM post_hierarchy);
    `, [postId]);

    // Hapus komentar terkait post
    await client.query('DELETE FROM commentar WHERE id_pos = $1', [postId]);

    // Hapus suka terkait post
    await client.query('DELETE FROM suka WHERE id_post = $1', [postId]);

    // Hapus post itu sendiri
    await client.query('DELETE FROM post_al WHERE id = $1', [postId]);

    // Commit transaksi jika berhasil
    await client.query('COMMIT');
    console.log('Post and all related data deleted successfully');
  } catch (error) {
    // Jika terjadi error, rollback transaksi
    await client.query('ROLLBACK');
    console.error('Error deleting post and related data:', error);
  } finally {
    // Tutup koneksi database
    await client.end();
  }
};

// Panggil fungsi deletePostAndRelatedData dengan ID post yang ingin dihapus
// deletePostAndRelatedData(1);
router.post("/add", type, async (req, res) => {
    console.log(req.body.user);
    
    await client.query("insert into post_al (id_user,content,media,time_now) values($1,$2,$3,$4)", [req.body.user, req.body.content, req.file.filename, new Date()])
    res.send("berhasil")
});

router.get("/", async (_req, res) => {
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
SELECT DISTINCT
    rc.id,
    rc.id_user,
    u.full_name,
    u.email,
    u.username,
    rc.content,
    rc.media,
    rc.time_now,
    rc.id_retweet,
    rc.isi,
    a.id as user_redweet,
    a.email as retweet_email,
    COALESCE(a.username, '') AS retweeter_username,
    COALESCE(a.full_name, '') AS retweeter_full_name
FROM
    retweet_chain rc
    INNER JOIN akun u ON u.id = rc.id_user
    LEFT JOIN akun a ON rc.id_user_retweet = a.id
ORDER BY
    rc.time_now DESC;
`)).rows;

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
    const results = (await client.query(`        WITH RECURSIVE retweet_chain AS (
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
        a.id as user_redweet,
        a.email as retweet_email,
        COALESCE(a.username, '') AS retweeter_username,
        COALESCE(a.full_name, '') AS retweeter_full_name
    FROM
        retweet_chain rc 
        INNER JOIN akun u ON u.id = rc.id_user 
        LEFT JOIN akun a ON rc.id_user_retweet = a.id
    WHERE
    rc.id_user = $1 OR rc.id_user_retweet = $2
    ORDER BY
        rc.time_now DESC`, [req.params.id, req.params.id])).rows;
    const postsWithImageUrls = results.map(post => ({
        ...post,
        mediaUrl: `http://localhost:3000/${post.media}`
    }));
    const like = (await client.query(`SELECT pa.id AS id_post, COUNT(*) AS banyak FROM suka s JOIN post_al pa ON s.id_post = pa.id WHERE s.chek = true AND (pa.id_user = $1 OR pa.id_user_retweet = $2) GROUP BY pa.id`, [req.params.id, req.params.id])).rows;
   
    const follower = (await client.query(`select * from follower`)).rows;
    const comentar = (await client.query("select id_pos,count(*) as banyak  from commentar group by id_pos")).rows
    const check = (await client.query("select  * from suka where chek = true")).rows;
    res.json({
        data: postsWithImageUrls,
        like,
        comentar,
        check, follower
    })
});

router.get("/by/:id", async (req, res) => {
    const results = (await client.query(`WITH RECURSIVE retweet_chain AS (
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
        a.id as user_redweet,
        a.email as retweet_email,
        COALESCE(a.username, '') AS retweeter_username,
        COALESCE(a.full_name, '') AS retweeter_full_name
    FROM
        retweet_chain rc 
    INNER JOIN
        akun u ON u.id = rc.id_user 
    LEFT JOIN
        akun a ON rc.id_user_retweet = a.id
    WHERE
        rc.id = $1 
    ORDER BY
        rc.time_now DESC;
    
    `, [req.params.id])).rows;
    const postsWithImageUrls = results.map(post => ({
        ...post,
        mediaUrl: `http://localhost:3000/${post.media}`
    }));
    const like = (await client.query("select id_post,count(*) as banyak  from suka where  chek  = true and id_post  in(select id from  post_al pa where id  = $1  )  group by id_post", [req.params.id])).rows;
    
    const comentar = (await client.query("select id_pos,count(*) as banyak  from commentar group by id_pos")).rows;
    const contentComentar = (await client.query("select a.id,a.email,a.full_name ,c.* from commentar c inner join akun a on a.id = c.id_user and c.id_pos = $1", [req.params.id])).rows;
    const check = (await client.query("select  * from suka where chek = true")).rows;
    const follower = (await client.query(`select * from follower`)).rows;

    res.json({
        data: postsWithImageUrls,
        like,
        comentar,
        contentComentar,
        check, follower
    })
});
router.get("/:me/:id", async (req, res) => {
    let results;
    if (req.params.me === req.params.id) {
        results = (await client.query(`SELECT
        pa.id,
            pa.id_user,
            a.full_name,
            a.email,
            a.username,
            pa.content,
            pa.media,
            pa.time_now,
            pa.id_retweet,
            pa.isi,
            pa.id_user_retweet AS user_redweet,
            u.email AS retweet_email,
            u.username AS retweeter_username,
            COALESCE(u.full_name, '') AS retweeter_full_name
    FROM
        post_al pa
        INNER JOIN akun a ON pa.id_user = a.id
        LEFT JOIN akun u ON pa.id_user_retweet = u.id
    WHERE
        pa.id IN(
                SELECT id_post
            FROM suka
            WHERE chek = true
            AND id_user = $1
            ) 
        OR pa.id_user_retweet = $2 
    ORDER BY
        pa.time_now DESC;
        `, [req.params.me, req.params.me])).rows;
    } else {
        results = (await client.query(`SELECT
        pa.id,
        pa.id_user,
        pa.content,
        pa.media,
        pa.time_now,
        pa.id_retweet,
        pa.isi,
        pa.id_user_retweet,
        u.full_name AS user_full_name,
        u.email AS user_email,
        u.username AS user_username,
        COALESCE(a.full_name, '') AS retweeter_full_name,
        COALESCE(a.email, '') AS retweeter_email,
        COALESCE(a.username, '') AS retweeter_username
    FROM
        post_al pa
        INNER JOIN akun u ON pa.id_user = u.id
        LEFT JOIN akun a ON pa.id_user_retweet = a.id
    WHERE
        (pa.id_user = $1 OR pa.id_user_retweet = $2) 
        AND pa.id IN (
            SELECT id_post
            FROM suka
            WHERE chek = $3
            AND id_user = $4
        ) 
        AND (
            pa.id_user_retweet IS NULL
            OR pa.id_user_retweet = $5 
        )
    ORDER BY
        pa.time_now DESC;
    
    `, [req.params.id, req.params.id, true, req.params.me, req.params.id,])).rows;
    }
    const postsWithImageUrls = results.map(post => ({
        ...post,
        mediaUrl: `http://localhost:3000/${post.media}`
    }));
    const like = (await client.query("select id_post,count(*) as banyak  from suka where  chek  = true and id_post  in(select id from  post_al pa where id_user = $1  )   group by id_post", [req.params.id])).rows;
    const comentar = (await client.query("select id_pos,count(*) as banyak  from commentar group by id_pos")).rows
    const check = (await client.query("select  * from suka where chek = true")).rows;
    const follower = (await client.query(`select * from follower`)).rows;
    res.json({
        data: postsWithImageUrls,
        like,
        comentar, follower,
        check
    })

})
router.delete("/:id", async (req, res) => {
    try {
        await client.query(`WITH RECURSIVE retweet_chain AS (
            SELECT id, id_retweet
            FROM post_al
            WHERE id_retweet = $1
            UNION ALL
            SELECT p.id, p.id_retweet
            FROM post_al p
            JOIN retweet_chain rc ON p.id_retweet = rc.id
        )
        UPDATE post_al
        SET id_retweet = NULL, id_user = NULL, content = NULL, media = NULL
        WHERE id IN (SELECT id FROM retweet_chain);`, [req.params.id]);

        await client.query(`DELETE FROM post_al WHERE id = $1;`, [req.params.id]);

        res.send("Berhasil");
    } catch (error) {
        console.log(error)
        res.status(500);
        res.send(error);
    }
});

router.put("/:id", async (req, res) => {
    try {
        await client.query(`WITH RECURSIVE retweet_chain AS (
            SELECT id, id_retweet
            FROM post_al
            WHERE id_retweet = $1
            UNION ALL
            SELECT p.id, p.id_retweet
            FROM post_al p
            JOIN retweet_chain rc ON p.id_retweet = rc.id
        )
        UPDATE post_al
        SET  content = $2
        WHERE id IN (SELECT id FROM retweet_chain);`, [req.params.id, req.body.isi]);

        await client.query(`update post_al set content = $1 WHERE id = $2;`, [req.body.isi, req.params.id]);

        res.send("Berhasil");
    } catch (error) {
        console.log(error)
        res.status(500);
        res.send(error);
    }
})

export default router;