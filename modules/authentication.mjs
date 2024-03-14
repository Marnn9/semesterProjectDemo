import { createHmac } from 'crypto';

export function validatePas(aInputPas, aStoredPas) {
    if (aInputPas === aStoredPas) {
        return true;
    }
}

export function encrypt(aPas) {
    const secret = process.env.Secret;
    const hash = createHmac('sha256', secret)
        .update(aPas)
        .digest('hex');
    return hash;
}

export function createToken(anId, anEMail, avatarId, aRole) {
    const credentials = anId + ":" + anEMail + ":" + avatarId + ":" + aRole + ":" + Date.now();
    return "Basic " + btoa(credentials);
}

export function tokenTimer(aTokenTime) {
    const now = Date.now();
    const validForHours = 2;
    const validationTimeInMilliseconds = validForHours * 60 * 60 * 1000;

    return (now - aTokenTime) < validationTimeInMilliseconds;

    //false the token has timed out, true token still valid
}

export function decodeToken(aHeaderAutorization) {
    const encodedCredentials = aHeaderAutorization.split(' ')[1];
    const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
    const [id, email, avatarId, role, time] = credentials.split(':');

    return {id, email, avatarId, role, time};
}
