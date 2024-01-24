import express from 'express';
import bodyParser from 'body-parser';
import HttpCodes from '../modules/httpErrorCodes.mjs';

const USER_API = express.Router();

// Use middleware to parse JSON requests
USER_API.use(bodyParser.json());

// Array to store user data (replace this with a database in a production environment)
const users = [];

USER_API.get('/users', (req, res) => {
    res.status(HttpCodes.SuccesfullResponse.Ok).json(users);
});
// Define a route to add a new user
USER_API.post('/users', (req, res) => {
    const { name, email, password } = req.body;

    if (name && email && password) {
        const exists = users.some(existingUser => existingUser.email === email);

        if (!exists) {
            const user = { id: Date.now().toString(), name, email, pswHash: password };
            users.push(user);
            res.status(HttpCodes.SuccesfullResponse.Ok).json(user);
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.BadRequest).json({ error: 'User already exists' });
        }
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.BadRequest).json({ error: 'Missing data fields' });
    }
});

USER_API.put('/user/users/id', (req, res) => {
    const { name, email, password } = req.body;

    if (name && email && password) {
        const userIndex = users.findIndex(existingUser => existingUser.id === req.params.id);

        if (userIndex !== -1) {
            const updatedUser = { id: users[userIndex].id, name, email, pswHash: password };
            users[userIndex] = updatedUser;
            res.status(HttpCodes.SuccesfullResponse.Ok).json(updatedUser);
        } else {
            res.status(HttpCodes.ClientSideErrorResponse.NotFound).json({ error: 'User not found' });
        }
    } else {
        res.status(HttpCodes.ClientSideErrorResponse.BadRequest).json({ error: 'Missing data fields' });
    }
});


export default USER_API;


