"use strict"
import { encrypt, validatePas, createToken, tokenTimer, decodeToken } from './authentication.mjs';
import HttpCodes from './httpConstants.mjs';
import User from '../modules/user.mjs';
import DBManager from "../modules/storageManager.mjs"

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
            req.authCredentials = { existingUser, dbAvatar, token };
            next();
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'Invalid email or password' });
        }
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'no provided authentication data' });
    }
}

export async function validateUserMiddleware(req, res, next) {
    const authHeaderToken = req.headers.authorization;

    if (authHeaderToken !== null && authHeaderToken !== 'null') {
        const { time, email } = decodeToken(authHeaderToken);
        const validToken = tokenTimer(time);

        if (validToken) {
            const user = new User();
            const existingUser = await user.findByIdentifyer(email);
            if (existingUser !== null) {

                let dbAvatar = null;
                if (existingUser.anAvatarId !== null) {
                    dbAvatar = await DBManager.getAvatar(existingUser.anAvatarId);
                }
                const token = authHeaderToken;
                req.authCredentials = { existingUser, dbAvatar, token };
                next();
            } else {
                res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'Invalid email or password' });
            }
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'Token timed out, please log in again' });
            return;
        }
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'no provided authentication data' });
    }
}


export function adminAuth(req, res, next) {
    const { existingUser } = req.authCredentials;

    if (existingUser.role === "admin") {
        next();
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: "You don't have the rights to execute this request" });
    }
}

export async function updateUserMiddleware(req, res, next) {
    const { existingUser } = req.authCredentials;
    const { name, email, password, userId } = req.body;

    const loggedInUser = existingUser;
    let token = req.authCredentials.token;

    let newName = null;
    let newPas = null;
    let newMail = null;
    let foundUser = null;
    let adminUpdateUser = false;
    

    const credentialToCheck = new User();

    if (userId !== null && userId !== undefined && loggedInUser.role === "admin") {
        adminUpdateUser = true
        foundUser = await credentialToCheck.findByIdentifyer(userId);

    } else {
        foundUser = await credentialToCheck.findByIdentifyer(loggedInUser.id);
    }

    if (email !== undefined && email !== '') {

        if (foundUser === null || foundUser.id === foundUser.id) {
            newMail = email;
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.UnprocessableContent).json({ error: "a user with this email already exists" });
            return;
        }
    } else {
        newMail = foundUser.uEmail;
    }

    if (password !== undefined && password !== '') {
        newPas = encrypt(password);
    } else {
        newPas = foundUser.password;
    }

    if (name !== undefined && name !== '') {
        newName = name;
    } else {
        newName = foundUser.uName;
    }

    if (newMail && newName && newPas) {
        const updatedUser = new User();
        updatedUser.name = newName;
        updatedUser.email = newMail;
        updatedUser.pswHash = newPas;
        updatedUser.id = foundUser.id;
        if (!adminUpdateUser) {
            token = createToken(loggedInUser.id, updatedUser.email, loggedInUser.anAvatarId, loggedInUser.role);
        }
        req.updatedUserData = { token, updatedUser};
        next();
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.BadRequest).json({ error: "could not set new values to the user" });
    }
}


export async function errorMiddleware(err, req, res, next) {
    const superInstance = new SuperLogger();
    superInstance.log(err);

    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        superInstance.log(error);
    });

    res.status(HttpCodes.serverSideResponse.InternalServerError).json({ error: 'Unhandled error in server', errorCode: `${err}` });
    next();
}
