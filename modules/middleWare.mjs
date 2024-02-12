"use strict"
import  { createHmac } from 'crypto'; 

export function basicAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {

        const encodedCredentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
        const [username, password] = credentials.split(':');

        // Must be updated to take input from user to check username etc. using find
        const validUsername = 'admin';
        const validPassword = 'adminPas';

        if (username === validUsername && password === validPassword) {
            // Authentication successful, proceed 
            return next();
        }
    }

    // Authentication failed, send a 401 Unauthorized response
    res.set('WWW-Authenticate', 'Basic realm="Authentication Required"');
    res.status(401).json({ error: 'Unauthorized' });
}

//make this encrypte as a good midleware?  
export function encrypt(aPas) {
    const secret = aPas; //this should be the users password
    const hash = createHmac('sha256', secret) //read more sha256 - crypto //    https://nodejs.org/api/crypto.html
        .update('I love cupcakes')
        .digest('hex');
    //add hash as the users password
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