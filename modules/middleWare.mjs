"use strict"
import { createHmac } from 'crypto';
import HttpCodes from './httpConstants.mjs';



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
    const hashInputPas = encrypt(aInputPas);
    return hashInputPas === aStoredPas;
}


//make this encrypte as a good midleware?  
export function encrypt(aPas) {
    const hash = createHmac('sha256', aPas) //read more sha256 - crypto //    https://nodejs.org/api/crypto.html
        .update('Fluffy unicorn') //cold generate a random number etc.
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