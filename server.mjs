import 'dotenv/config'
import express from 'express' // Express is installed using npm
import USER_API from './routes/usersRoute.mjs'; // This is where we have defined the API for working with users.
import SuperLogger from './modules/SuperLogger.mjs';
import { errorMiddleware } from './modules/middleWare.mjs';
import printDeveloperStartupImportantInformationMSG from "./modules/developHelper.mjs";

printDeveloperStartupImportantInformationMSG();

// Creating an instance of the server
const server = express();
// Selecting a port for the server to use.
const port = (process.env.PORT || 8080);
server.set('port', port);

//enable logging in to server
const log = new SuperLogger();
server.use(log.createAutoHTTPRequestLogger());

// Defining a folder that will contain static files.
server.use(express.static('public'));

server.use(express.json());

// Telling the server to use the USER_API (all urls that uses this code will have to have the /user after the base address)
server.use("/user", USER_API);

//server.use("/login", basicAuthMiddleware, USER_API);

// A get request handler example)
server.get("/", (req, res, next) => {
    res.status(200).send(JSON.stringify({ msg: "Server ok?" })).end();
});

server.use(errorMiddleware);
// Start the server 
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});
