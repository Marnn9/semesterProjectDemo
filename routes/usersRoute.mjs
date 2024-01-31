// Import necessary modules and classes
import express from 'express';
import bodyParser from 'body-parser';
import httpConstants from '../modules/httpConstants.mjs';
import User from '../modules/user.mjs'; // Import your User class

const USER_API = express.Router();

// Use middleware to parse JSON requests
USER_API.use(bodyParser.json());

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
    res.status(httpConstants.SuccesfullResponse.Ok).json(users);
    console.log('Received GET request for all users: ');
});;

USER_API.post('/users', (req, res) => {
    const { name, email, password } = req.body;

    if (name !== undefined && email !== undefined && password !== undefined) {
        // Create a new User instance
        const user = new User();
        user.name = name;
        user.email = email;
        user.pswHash = password;
        user.id = Date.now().toString();

        // Check if the user already exists
        const exists = users.some(existingUser => existingUser.email === email);

        if (!exists) {
            users.push(user);
            res.status(httpConstants.SuccesfullResponse.Ok).json(user);
        } else {
            res.status(httpConstants.ClientSideErrorResponse.BadRequest).json({ error: 'User already exists' });
        }
    } else {
        res.status(httpConstants.ClientSideErrorResponse.BadRequest).json({ error: 'Missing data fields' });
    }
});

USER_API.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    // Find the user with the specified ID
    const foundUser = users.find(existingUser => existingUser.id === userId);

    if (foundUser) {
        // Update user data
        foundUser.name = name || foundUser.name;
        foundUser.email = email || foundUser.email;
        foundUser.pswHash = password || foundUser.pswHash;

        res.status(httpConstants.SuccesfullResponse.Ok).json(foundUser);
    } else {
        res.status(httpConstants.ClientSideErrorResponse.NotFound).json({ error: 'User not found' });
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
        res.status(HttpCodes.SuccesfullResponse.Ok).json(deletedUser);
    } else {
        console.log('User not found for deletion');
        res.status(httpConstants.ClientSideErrorResponse.NotFound).json({ error: 'User not found' });
    }
});
// Add other routes as needed (PUT, DELETE, etc.)

export default USER_API;
