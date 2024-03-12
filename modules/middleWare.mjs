"use strict"
import { encrypt, validatePas, createToken, tokenTimer, decodeToken } from './authentication.mjs';
import HttpCodes from './httpConstants.mjs';
import User from '../modules/user.mjs';
import DBManager from "../modules/storageManager.mjs"

//middleware must have req, res, and next, for error middleware the err parameter must be present

export async function loginAuthenticationMiddleware(req, res, next) {
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
            const token = createToken(existingUser.id, existingUser.uEmail, existingUser.anAvatarId, existingUser.role);
            req.authCredentials = { existingUser, dbAvatar, token }; // call this for the requested method in usersRoute
            next();
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'Invalid email or password' });
        }
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'no provided authentication data' });
    }
}

export async function validateUserMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader != null) {
        const { time, email } = decodeToken(authHeader);
        const validToken = tokenTimer(time);

        if (validToken) {
            const user = new User();
            const existingUser = await user.findByIdentifyer(email);
            if (existingUser !== null) {

                let dbAvatar = null;
                if (existingUser.anAvatarId !== null) {
                    dbAvatar = await DBManager.getAvatar(existingUser.anAvatarId);
                }
                const token = authHeader;
                req.authCredentials = { existingUser, dbAvatar, token }; // call this for the requested method in usersRoute
                next();
            } else {
                res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'Invalid email or password' });
            }
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'Invalid token, please log in' });
        }
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'no provided authentication data' });
    }
}


export async function adminAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader != null) {
        const encodedCredentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
        const [id, email] = credentials.split(':');

        const user = new User();
        const admin = await user.findByIdentifyer(id);

        if (admin !== null && admin.role === 'admin') {
            req.authCredentials = { admin }; // call this for the requested method in usersRoute
            next();
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'Invalid email or password' });
        }
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'no provided authentication data' });
    }
}

export async function errorMiddleware(err, req, res, next) {
    const superInstance = new SuperLogger();
    superInstance.log(err);

    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        superInstance.log(error);
        process.exit(1);
    });

    res.status(500).json({ error: 'Unhandled error in server', errorCode: `${err}` });
    next();
}


//maybe add a new middleware for loading templates