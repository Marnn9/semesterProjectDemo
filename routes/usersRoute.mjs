// Import necessary modules and classes
import express from 'express';
import bodyParser from 'body-parser';
import HttpCodes from '../modules/httpConstants.mjs';
import User from '../modules/user.mjs'; // Import your User class
import SuperLogger from '../modules/SuperLogger.mjs';
import { basicAuthMiddleware, encrypt } from '../modules/middleWare.mjs';




const logger = new SuperLogger();
const USER_API = express.Router();
USER_API.use(express.json());

// Use middleware to parse JSON requests

const users = [];

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


USER_API.get('/users', (req, res, next) => {
    // Retrieve all users
    res.status(HttpCodes.successfulResponse.Ok).json(users);
    console.log('Received GET request for all users: ');

    //logger.log("try to get user with id " + req.params.id);
});

USER_API.post('/users', async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const password = encrypt(req.body.password);

        if (name !== undefined && email !== undefined && password !== undefined) {
            // Create a new User instance
            let user = new User();
            user.name = name;
            user.email = email;
            user.pswHash = password;

            // Check if a user with the provided email exists
            const exists = users.some(existingUser => existingUser.email === email);
            if (!exists) {
                user = await user.save();
                res.status(HttpCodes.successfulResponse.Ok).json(user);
            } else {
                //displayMsg("error: User already exists");
                res.status(HttpCodes.ClientSideErrorResponse.BadRequest).json({ error: 'User already exists' });
            }
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.BadRequest).json({ error: 'Missing data fields' });
            //displayMsg("error: Missing data fields");
        }
    } catch (error) {
        console.error("Error in post handler:", error);
        res.status(HttpCodes.InternalServerError).json({ error: 'Internal Server Error' });
       // displayMsg("error: Missing data fields catch");

    }
});

USER_API.put('/users/:id', basicAuthMiddleware, async (req, res) => {
    //const userId = req.params.id;
    const userId = 1;
    const { name, email, password } = req.body;

    // Find the user with the specified ID
    const foundUser = users.find(existingUser => existingUser.id === userId);

    if (foundUser) {
        // Update user data
        foundUser.name = name || foundUser.name;
        foundUser.email = email || foundUser.email;
        foundUser.pswHash = password || foundUser.pswHash;
        
        foundUser = await foundUser.save();


        res.status(HttpCodes.successfulResponse.Ok).json(foundUser);
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.NotFound).json({ error: 'User not found' });
    }
});

USER_API.delete('/users/:id', (req, res) => {
    const userId = req.params.id;

    console.log('Deleting user with ID:', userId);

    const deletedUser = users.find(user => user.id === userId);

    if (deletedUser) {
        // Remove the user from the array
        users.splice(users.indexOf(deletedUser), 1);

        console.log('Users after deletion:', users);
        res.status(HttpCodes.successfulResponse.Ok).json(deletedUser);
    } else {
        console.log('User not found for deletion');
        res.status(HttpCodes.ClientSideErrorResponse.NotFound).json({ error: 'User not found' });
    }
});

USER_API.use((err, req, res, next) => {
    console.error(err);

    // Customize the message and position as needed
    const errorMessage = `An error occurred: ${err.message}`;
    const errorPosition = { top: '10px', left: '10px' };

    // Use the client-side error handling function
    //displayMsg(errorMessage, errorPosition);

    // Send an appropriate response to the client
    res.status(500).json({ error: 'Internal Server Error' });
});

export default USER_API;
