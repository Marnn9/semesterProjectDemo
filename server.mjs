import express from 'express' // Express is installed using npm
import USER_API from './routes/usersRoute.mjs'; // This is where we have defined the API for working with users.
import SuperLogger from './modules/SuperLogger.mjs';
import { displayMsg } from './modules/errorHandler.mjs';


console.log("DB Connection sting " ) //must be deleted when the connection is proven ok not including the last statement for he actual object
// Creating an instance of the server
const server = express();
// Selecting a port for the server to use.
const port = (process.env.PORT || 8080);
server.set('port', port);


//enable logging in to server
 const log = new SuperLogger();
server.use(log.createAutoHTTPRequestLogger()); 

//server.use(errorHandler);
 
// Defining a folder that will contain static files.
server.use(express.static('public'));

server.use(express.json());

server.use((err, req, res, next) => {
    console.error(err);

    // Customize the message as needed
    const errorMessage = `An error occurred: ${err.message}`;

    // Use the client-side error handling function
    const clientMsg = displayMsg(errorMessage);

    // Send an appropriate response to the client
    res.status(500).json({ error: 'Internal Server Error', clientMsg });
});
// Telling the server to use the USER_API (all urls that uses this code will have to have the /user after the base address)
server.use("/user", USER_API);


// A get request handler example)
server.get("/", (req, res, next) => {
    res.status(200).send(JSON.stringify({ msg: "Server ok?" })).end();
});

// Start the server 
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});
