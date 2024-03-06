// Import necessary modules and classes
import express from 'express';
import HttpCodes from '../modules/httpConstants.mjs';
import User from '../modules/user.mjs'; 
import SuperLogger from '../modules/SuperLogger.mjs';
import { basicAuthMiddleware } from '../modules/middleWare.mjs';
import { encrypt, validatePas } from "../modules/authentication.mjs"
import DBManager from "../modules/storageManager.mjs"




const logger = new SuperLogger();
const USER_API = express.Router();
USER_API.use(express.json());

// Use middleware to parse JSON requests

//const users = [];

/* 
Next important so you do the code but then it sends 
you to the next checkpoint (next line in code) this makes them do it automatically

 */
/* const functionToRunToEveryUser = function (req, res, next) {
    console.log("text");
    next();
}
USER_API.use(functionToRunToEveryUser); //the use is from express making it run everytime
 */


USER_API.get('/users', async (req, res, next) => {
    try {
        let users = new User();
        users = await users.displayAll();
        res.status(HttpCodes.successfulResponse.Ok).json(users);
    } catch (error) {
        console.error('Error retrieving all users:', error);
        res.status(HttpCodes.serverSideResponse.InternalServerError).json({ error: 'Internal Server Error' });
    }
});

USER_API.get('/avatar/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const avatar = await DBManager.getAvatar(id);
        if (avatar !== null) {
            res.status(HttpCodes.successfulResponse.Ok).json(avatar);
        } else {
            res.status(HttpCodes.serverSideResponse.NotFound).json({ msg: 'no avatar found' });
        }
    } catch (error) {
        console.error('Something went wrong finding avatar', error);
        res.status(HttpCodes.serverSideResponse.InternalServerError).json({ error: 'Internal Server Error' });
    }
});

USER_API.post('/users', async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const password = encrypt(req.body.password);

        let user = new User();

        const existingUser = await user.findByIdentifyer(email);

        if (name !== undefined && email !== undefined && password !== undefined) {
            // Create a new User instance
            // Check if a user with the provided email exists 
            if (existingUser === null) {
                user.name = name;
                user.email = email;
                user.pswHash = password;
                user = await user.save();
                res.status(HttpCodes.successfulResponse.Ok).json({ msg: 'New user created' });
            } else {
                res.status(HttpCodes.ClientSideErrorResponse.UnprocessableContent).json({ error: 'A user with this email already exists' });
            }
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.BadRequest).json({ error: 'Invalid Input' });
        }
    } catch (error) {
        console.error("Error in post handler:", error);
        res.status(HttpCodes.InternalServerError).json({ error: 'Internal Server Error' });
        // displayMsg("error: Missing data fields catch");

    }
});

//using :id then you can use req.params since all data is named id as a variable
USER_API.post('/login', basicAuthMiddleware, async (req, res, next) => {
    try{
    const {dbAvatar, existingUser } = req.authCredentials;
    const userData = {
                user: existingUser,
                avatar: dbAvatar,
            }
    res.status(HttpCodes.successfulResponse.Ok).json(userData);
    } catch (error) {
        console.error("Error in login handler:", error);
        res.status(HttpCodes.serverSideResponse.InternalServerError).json({ error: 'Internal Server Error' });
    }
});

USER_API.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, email } = req.body;
        let password = req.body.password;

        let user = new User();
        const foundUser = await user.findByIdentifyer(userId);

        const checkMail = new User();
        const existingMail = await checkMail.findByIdentifyer(email);
        if (existingMail === null || email === foundUser.uEmail) {
            if (password === foundUser.password) {
                password = password;
            } else {
                password = encrypt(password);
            }

            if (userId && foundUser !== null) {
                // Update user data
                user.name = name;
                user.email = email;
                user.pswHash = password;
                user.id = userId;

                user = await user.save();

                res.status(HttpCodes.successfulResponse.Ok).json(user);
            } else {
                res.status(HttpCodes.ClientSideErrorResponse.NotFound).json({ error: 'User not found' });
            }
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.UnprocessableContent).json({ error: 'A user with this email already exists' });
        }
    } catch (error) {
        //add some code here
    }
});

USER_API.post('/avatar', async (req, res) => {
    const { hairColor, eyeColor, skinColor, browType, loggedInUser } = req.body;

    const user = new User();
    const existingUser = await user.findByIdentifyer(loggedInUser);

    const avatar = { aHairColor: hairColor, anEyeColor: eyeColor, aSkinColor: skinColor, aBrowType: browType };

    if (avatar !== null && existingUser.anAvatarId === null) {
        await DBManager.addAvatar(avatar, loggedInUser);
        res.status(HttpCodes.successfulResponse.Ok).json(avatar);
    } else if (avatar !== null && existingUser.anAvatarId !== null) {
        const updatedAvatar = await DBManager.updateAvatar(avatar, existingUser.anAvatarId);
        res.status(HttpCodes.successfulResponse.Ok).json(updatedAvatar);
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.NotFound).json({ error: 'User not found' });
    }
});


USER_API.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;

    console.log('Deleting user with ID:', userId);

    //must check if it is the logged in user that wants to delte its own profile or an Admin 

    let deleteUser = new User();

    if (userId) {
        try {
            // Call the deleteUser method, not deletedUser
            deleteUser = await deleteUser.delete(userId);

            res.status(HttpCodes.successfulResponse.Ok).json({ msg: 'user with id ' + userId + ' deleted' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(HttpCodes.InternalServerError).json({ error: 'Internal Server Error' });
        }
    } else {
        console.log('User not found for deletion');
        res.status(HttpCodes.ClientSideErrorResponse.NotFound).json({ error: 'User not found' });
    }
});

USER_API.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({ error: 'Internal Server Error' });
});

export default USER_API;