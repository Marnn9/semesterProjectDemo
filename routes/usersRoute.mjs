// Import necessary modules and classes
import express from 'express';
import bodyParser from 'body-parser';
import HttpCodes from '../modules/httpConstants.mjs';
import User from '../modules/user.mjs'; // Import your User class
import SuperLogger from '../modules/SuperLogger.mjs';


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

USER_API.post('/users', (req, res) => {
    const { name, email, password } = req.body;
        
    if (name !== undefined && email !== undefined && password !== undefined) {
        // Create a new User instance
        const user = new User();
        user.name = name;
        user.email = email;
        user.pswHash = password;
        user.id = Date.now().toString();

        // Check if a user with the provided email exists
        const exists = users.some(existingUser => existingUser.email === email);
        if (!exists) {
            users.push(user);
            res.status(HttpCodes.successfulResponse.Ok).json(user);
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

    // Find the user with the specified ID
    const foundUser = users.find(existingUser => existingUser.id === userId);

    if (foundUser) {
        // Update user data
        foundUser.name = name || foundUser.name;
        foundUser.email = email || foundUser.email;
        foundUser.pswHash = password || foundUser.pswHash;

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

function errorHandler(err, req, res, next) {
    console.error(err.stack);
  
    // Set the response status code based on the error
    const statusCode = err.statusCode || 500;
  
    // Send a JSON response with detailed error information
    res.status(statusCode).json({
      error: 'Internal Server Error',
      message: err.message || 'Something went wrong!',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  USER_API.use(errorHandler());
// Add other routes as needed (PUT, DELETE, etc.)

export default USER_API;
