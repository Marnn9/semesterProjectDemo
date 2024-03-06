"use strict"
import { encrypt, validatePas } from './authentication.mjs';
import HttpCodes from './httpConstants.mjs';
import User from '../modules/user.mjs';
import DBManager from "../modules/storageManager.mjs"


//middleware must have req, res, and next, for error middleware the err parameter must be present

export async function basicAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader != null) {
        const encodedCredentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');

        const user = new User();
        const existingUser = await user.findByIdentifyer(email);
        
        if (existingUser !== null && validatePas(encrypt(password), existingUser.password)) {

            let dbAvatar = null;
            if (existingUser.anAvatarId !== null) {
                dbAvatar = await DBManager.getAvatar(existingUser.anAvatarId);
            }
            req.authCredentials = { existingUser, dbAvatar }; // call this for the requested method in usersRoute
            next();
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'Invalid email or password' });
        }
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'no provided authentication data' });
    }
}



//maybe add a new middleware for loading templates