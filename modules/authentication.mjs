//add the validate pas and encrypt here instead of middleware
import { createHmac } from 'crypto';

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