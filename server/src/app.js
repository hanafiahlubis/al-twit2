import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import login from "./routes/login.js";
import posting from "./routes/posting.js";
import comentar from "./routes/comentar.js";
import profil from "./routes/profil.js";
import like from "./routes/like.js";
import retweed from "./routes/redweet.js";
import followers from "./routes/followers.js";
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
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


const router = express.Router();


// untuk uplod supabase karena laptop nya lam sekali di buat 
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
app.use(cookieParser())
router.use("/login", login);


// router.get("/me", (req, res) => {
//     res.json(req.user)
// })
router.use("/posting", posting);
router.use("/comentar", comentar);
router.use("/profil", profil);
router.use("/like", like);
router.use("/retweed", retweed);
router.use("/follower", followers);
app.use("/api", router);


const PORT = 3000;
app.listen(PORT, console.log(`server sedang berjalan di port ${PORT}`));

