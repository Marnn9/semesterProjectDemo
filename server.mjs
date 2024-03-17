import 'dotenv/config'
import express from 'express' 
import USER_API from './routes/usersRoute.mjs'; 
import SuperLogger from './modules/SuperLogger.mjs';
import { errorMiddleware } from './modules/middleWare.mjs';
import printDeveloperStartupImportantInformationMSG from "./modules/developHelper.mjs";

printDeveloperStartupImportantInformationMSG();

const server = express();
const port = (process.env.PORT || 8080);
server.set('port', port);

const log = new SuperLogger();
server.use(log.createAutoHTTPRequestLogger());

server.use(express.static('public'));

server.use(express.json());

server.use("/user", USER_API);


server.get("/", (req, res, next) => {
    res.status(200).send(JSON.stringify({ msg: "Server ok?" })).end();
});

server.use(errorMiddleware);
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});
