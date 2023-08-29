import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        try {
            req.user = jwt.verify(token, process.env.SECRET_KEY);
            if (req.method === "GET") {
                next();
            } else {
                res.status(401).send("Anda tidak diizinkan melakukan tindakan ini.");
            }
        } catch {
            res.status(401).send("Token tidak valid.");
        }
    } else {
        res.status(401).send("Anda belum login.");
    }
}

export default authMiddleware;


// import jwt from "jsonwebtoken";

// function authMiddleware(req, res, next)   (req, res, next) => {
//     // console.log(req.headers.authorization)
//     if (req.headers.authorization) {
//         const token = req.headers.authorization.split(" ")[1];
//         try {
//             const user = jwt.verify(token, process.env.SECRET_KEY);
//             req.user = user;
//             next();
//         } catch {
//             res.status(401);
//             res.send("Token salah.");
//         }
//     } else {
//         res.status(401);
//         res.send("Token belum diisi.");
//     }
// }

// export default authMiddleware;