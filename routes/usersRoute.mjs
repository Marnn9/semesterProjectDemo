// Import necessary modules and classes
import express from 'express';
import HttpCodes from '../modules/httpConstants.mjs';
import User from '../modules/user.mjs';
import SuperLogger from '../modules/SuperLogger.mjs';
import { loginAuthenticationMiddleware, adminAuth, validateUserMiddleware, updateUserMiddleware } from '../modules/middleWare.mjs';
import { encrypt } from "../modules/authentication.mjs"
import DBManager from "../modules/storageManager.mjs"

const logger = new SuperLogger();
const USER_API = express.Router();
USER_API.use(express.json());


USER_API.get('/users', validateUserMiddleware, adminAuth, async (req, res, next) => {
    const admin = req.authCredentials;
    if (admin != null) {
        try {
            let users = new User();
            users = await users.displayAll();
            res.status(HttpCodes.successfulResponse.Ok).json(users);
        } catch (error) {
            console.error('Error retrieving all users:', error);
            res.status(HttpCodes.serverSideResponse.InternalServerError).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.Forbidden).json({ error: "You don't have the rights to access the data" });
    }
});

USER_API.get('/avatar', validateUserMiddleware, async (req, res, next) => {
    const { dbAvatar } = req.authCredentials;
    try {
        if (dbAvatar !== null) {
            const avatar = await DBManager.getAvatar(dbAvatar.avatarId);
            res.status(HttpCodes.successfulResponse.Ok).json(avatar);
        }
        else {
            res.status(HttpCodes.successfulResponse.Ok).json({ msg: 'User has no avatar' });
        }
    } catch (error) {
        console.error('Something went wrong finding avatar', error);
        res.status(HttpCodes.serverSideResponse.InternalServerError).json({ error: 'Something went wrong finding avatar' });
    }
});

USER_API.post('/users', async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const password = encrypt(req.body.password);

        let user = new User();

        const existingUser = await user.findByIdentifyer(email);

        if (name !== undefined && email !== undefined && password !== undefined) {

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
    }
});

USER_API.post('/login', loginAuthenticationMiddleware, async (req, res, next) => {
    try {
        const { dbAvatar, existingUser, token } = req.authCredentials;
        const userData = {
            user: { id: existingUser.id, role: existingUser.role },
            avatar: dbAvatar,
            token,
        }
        res.status(HttpCodes.successfulResponse.Ok).json(userData);
    } catch (error) {
        console.error("Error in login handler:", error);
        res.status(HttpCodes.serverSideResponse.InternalServerError).json({ error: 'Internal Server Error' });
    }
});

USER_API.put('/users/update', validateUserMiddleware, updateUserMiddleware, async (req, res) => {
    const { token, updatedUser } = req.updatedUserData;
    try {
        await updatedUser.save();
        const user = { id: updatedUser.id, email: updatedUser.email }
        res.status(HttpCodes.successfulResponse.Ok).json({ user, token });
    } catch (error) {
        res.status(HttpCodes.ClientSideErrorResponse.BadRequest).json({ error: "Could not update user in database" });
    }
});

USER_API.post('/avatar', validateUserMiddleware, async (req, res) => {
    const { hairColor, eyeColor, skinColor, browType } = req.body;
    const { existingUser } = req.authCredentials;

    const avatar = { hairColor: hairColor, eyeColor: eyeColor, skinColor: skinColor, browType: browType, avatarId: existingUser.anAvatarId };

    try {
        if (avatar !== null && existingUser.anAvatarId === null) {
            await DBManager.addAvatar(avatar, existingUser.id);
            res.status(HttpCodes.successfulResponse.Ok).json(avatar);
        } else if (avatar !== null && existingUser.anAvatarId !== null) {
            const updatedAvatar = await DBManager.updateAvatar(avatar, avatar.avatarId);
            res.status(HttpCodes.successfulResponse.Ok).json(updatedAvatar);
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.NotFound).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(HttpCodes.ClientSideErrorResponse.BadRequest).json({ error: 'Error saving the avatar to database' });
    }
});


USER_API.delete('/users/:id', validateUserMiddleware, async (req, res) => {
    const userId = req.params.id;
    const { existingUser } = req.authCredentials;
    let adminId = null
    let deleteUser = new User();

    if (existingUser.role === "admin") {
        adminId = existingUser.id
    }

    if (userId && (userId != adminId)) {
        try {
            deleteUser = await deleteUser.delete(userId);
            res.status(HttpCodes.successfulResponse.Ok).json({ msg: 'user with id ' + userId + ' deleted' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(HttpCodes.InternalServerError).json({ error: 'Could not delete user' });
        }
    } else if (userId && (userId == adminId)) {
        console.log('Admin user cannot be deleted');
        res.status(HttpCodes.ClientSideErrorResponse.BadRequest).json({ error: 'Admin user cannot be deleted' });
    } else {
        console.log('id not provided or not valid for deleting');
        res.status(HttpCodes.ClientSideErrorResponse.NotFound).json({ error: 'id not provided or not valid for deleting' });
    }
});

//wanted to add an endpoint for sending a new email-reset to the users whos forgotten hteir password
/* USER_API.put('/forgotten', async (req, res) => {
    const { mail, id } = req.headers.authorization;
    
}); */

export default USER_API;