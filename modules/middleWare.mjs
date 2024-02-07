"use strict"


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

/* function displayMsg(aMsg) {
    const messageDisplay = document.createElement('div');
    messageDisplay.innerHTML = aMsg;

    document.body.appendChild(messageDisplay);

    setTimeout(() => {
        document.body.removeChild(messageDisplay);
    }, 8000);
} */