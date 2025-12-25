import { NextFunction, Request, response, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";


export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // const token = req.headers["authorization"] ?? ""
    const token = req.cookies.access_token

    // const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload

    // if(decoded){
    //     req.userId = decoded.userId;
    //     next()
    // }
    // else{
    //     res.status(403).json({
    //         message: "Unauthorized"
    //     })
    // }

    if(!token){
        return res.status(401).json({message: "Token not found"})
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload
        req.userId = payload.userId
        next()
    } catch (error) {
        res.status(403).json({message: "token is invalid"})
    }
}