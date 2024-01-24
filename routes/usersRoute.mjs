// Import necessary modules and classes
import express from 'express';
import bodyParser from 'body-parser';
import HttpCodes from '../modules/httpErrorCodes.mjs';
import User from '../modules/user.mjs'; // Import your User class

// Create an instance of express.Router()
const USER_API = express.Router();

// Use middleware to parse JSON requests
USER_API.use(bodyParser.json());

// Array to store user data (replace this with a database in a production environment)
const users = [];

USER_API.get('/users', (req, res) => {
    // Retrieve all users
    res.status(HttpCodes.SuccesfullResponse.Ok).json(users);
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
            res.status(HttpCodes.SuccesfullResponse.Ok).json(user);
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.BadRequest).json({ error: 'User already exists' });
        }
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.BadRequest).json({ error: 'Missing data fields' });
    }
});

USER_API.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    // Find the index of the user with the specified ID
    const userIndex = users.find(existingUser => existingUser.id === userId);

    if (userIndex !== -1) {
        // Update user data
        users.name = name || users[userIndex].name;
        users.email = email || users[userIndex].email;
        users.pswHash = password || users[userIndex].pswHash;

        res.status(HttpCodes.SuccesfullResponse.Ok).json(users[userIndex]);
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
        res.status(HttpCodes.SuccesfullResponse.Ok).json(deletedUser);
    } else {
        console.log('User not found for deletion');
        res.status(HttpCodes.ClientSideErrorResponse.NotFound).json({ error: 'User not found' });
    }
});
// Add other routes as needed (PUT, DELETE, etc.)

export default USER_API;
