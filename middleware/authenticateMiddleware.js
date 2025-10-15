

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ quiet: true })

export const protectAction = (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).json({
            status: "fail",
            message: "Unauthorized, no token",
            data: []
        })
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded){
        if(err){
            return res.status(401).json({
                status: "fail",
                message: "Unauthorized, invalid token",
                data: []
            })
        }
        req.user = decoded;
        next();
}    )
}