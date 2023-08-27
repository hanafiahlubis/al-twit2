import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import login from "./routes/login.js"
import posting from "./routes/posting.js"
import comentar from "./routes/comentar.js"
import profil from "./routes/profil.js"
import like from "./routes/like.js"
import retweed from "./routes/redweet.js"
// import { createClient } from '@supabase/supabase-js'

// import multer from "multer";
// const upload = multer({ dest: "public/photos", });
// const type = upload.single('file')
// // Create Supabase client
// const supabase = createClient('https://jnglznrfflihidnncjsa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpuZ2x6bnJmZmxpaGlkbm5janNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3ODUxNzI4MiwiZXhwIjoxOTk0MDkzMjgyfQ.D-FU2F_PHU3nYLESnUqc7OE68qimabR5fkoX7I70Jk4', {
//     persistSession: true // atau metode penyimpanan lokal lainnya
// })

const app = express();
app.use(express.json());
// Twital
app.use(express.static("public/photos"))

app.use(cors({ origin: "http://localhost:5173" }));




const router = express.Router();
router.use(cookieParser());


// router.post('/upload', type, async (req, res) => {
//     console.log("sss")
//     const { data, error } = await supabase.storage
//         .from('ali')
//         .upload(req.file.filename, req.file.path, {
//             contentType: req.file.mimetype,
//         });

//     if (error) {
//         return res.status(500).json({ error: error.message });
//     }

//     return res.status(200).json(data);
// });

// router.post("/", async (req, res) => {
//     const { data, error } = await supabase.storage.from('ali').upload('file_path', file)

// })

router.use("/login", login);

router.use((req, res, next) => {
    // console.log(req.headers.authorization)
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const user = jwt.verify(token, process.env.SECRET_KEY);
            req.user = user;
            next();
        } catch {
            res.status(401);
            res.send("Token salah.");
        }
    } else {
        res.status(401);
        res.send("Token belum diisi.");
    }
});


router.get("/me", (req, res) => {
    res.json(req.user);
})

// router.use((req, res, next) => {
//     console.log(req.cookies.token);
//     if (req.cookies.token) {
//         try {
//             req.me = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
//             authorized = true;
//             next();
//         } catch (err) {
//             res.setHeader("Cache-Control", "no-store"); // khusus Vercel
//             res.clearCookie("token");
//         }g
//     }
// });
router.use("/posting", posting);
router.use("/comentar", comentar);
router.use("/profil", profil);
router.use("/like", like);
router.use("/retweed", retweed);
app.use("/api", router);


const PORT = 3000;
app.listen(PORT, console.log(`server sedang berjalan di port ${PORT}`));

