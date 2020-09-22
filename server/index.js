if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const { initiateRequestProcess, finalizeRequestProcess, sendResponse } = require('./src/core/middleware/baseMiddleware');
const { fetchToken, validateToken } = require('./src/core/middleware/tokenMiddleware');

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
require('./src/core/passport/passportStrategies');
const userRouter = require('./src/api/users/usersRouter');
const projectRouter = require('./src/api/projects/projectsRouter');
const authenticationRouter = require('./src/api/authentication/authenticationRouter');
// ACCESS LOGGER
const morgan = require('morgan');
const accessLogStream = fs.createWriteStream(path.join(__dirname, process.env.LOGFOLDER, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));

// BASE LOGGER
const logger = require('./src/core/logging/logger');

// REQUEST CONFIGURATION
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(cookieParser());

const useProtection = process.env.USEPROTECTION;
logger.info(`Protection is ${useProtection}`);
// ROUTES / MIDDLEWARE CONFIGURATION
const protectedRoutes = [
    '/users',
    '/projects'
];
app.use(initiateRequestProcess);
app.use('/users', fetchToken, validateToken, userRouter);
app.use('/projects', validateToken, validateToken, projectRouter);
app.use('/auth', authenticationRouter);
app.use(finalizeRequestProcess, sendResponse);
app.listen(port, () => logger.info(`App listening at port ${port}`)); 

// MONGO CONFIGURATION
mongoose.connect(`mongodb://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@127.0.0.1:27017/project-planner`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', () => logger.info('connection error: '));
db.once('open', () => {
    logger.info('Moongoose connected');
});