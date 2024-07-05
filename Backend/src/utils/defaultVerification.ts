import { NextFunction, Request, Response } from "express";

import { isTokenValid } from "../controller/authentication/validate.js";

export default async function verifyRequest(req: Request, res: Response, next: NextFunction) {
    if(!req.headers.authorization) return res.status(401).send({error: 'No authorization token provided'});
    req.body.user = await isTokenValid(req.headers.authorization);
    if(typeof req.body.user === "string" || !req.body.user) return res.status(401).send({error: 'Invalid authorization token provided'});
    else next();
}