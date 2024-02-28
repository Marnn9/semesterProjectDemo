"use strict"
import { createHmac } from 'crypto';
import HttpCodes from './httpConstants.mjs';

//middleware must have req, res, and next, for error middleware the err parameter must be present
//this must be fixed everyone can delete
export function basicAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const encodedCredentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
        const [email, password] = credentials.split(':');

        req.authCredentials = { email, password }; // Store credentials in the request object
        return next();
    }

    // Authentication failed, send a 401 Unauthorized response
    res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
    res.status(HttpCodes.ClientSideErrorResponse.Unauthorized).json({ error: 'Unauthorized' });
}


export function validatePas(aInputPas, aStoredPas) {
    if (aInputPas === aStoredPas) {
        return true;
    }
}

//make this encrypte as a good midleware?  
export function encrypt(aPas) {
    const secret = process.env.Secret;
    const hash = createHmac('sha256', secret)
        //move to env secret
        //read more sha256 - crypto //    https://nodejs.org/api/crypto.html 
        .update(aPas) //cold generate a random number etc.
        .digest('hex');
    return hash;
}

/* function displayMsg(aMsg) {
    const messageDisplay = document.createElement('div');
    messageDisplay.innerHTML = aMsg;

    document.body.appendChild(messageDisplay);

    setTimeout(() => {
        document.body.removeChild(messageDisplay);
    }, 8000);
} */