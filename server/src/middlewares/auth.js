import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        try {
            req.user = jwt.verify(token, process.env.SECRET_KEY);
            if (req.method === "GET" || req.method === "POST") {
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