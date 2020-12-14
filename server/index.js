if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
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
const boardsRouter = require('./src/api/boards/boardsRouter');
const threadsRouter = require('./src/api/threads/threadsRouter');
const authenticationRouter = require('./src/api/authentication/authenticationRouter');
const { createProtectedRoute, createBaseRoute, exportRoute } = require('./src/api/routing');
// ACCESS LOGGER
const morgan = require('morgan');
if (!fs.existsSync(process.env.LOGFOLDER)){
    fs.mkdirSync(process.env.LOGFOLDER);
}
const accessLogStream = fs.createWriteStream(path.join(__dirname, process.env.LOGFOLDER, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));

// BASE LOGGER
const logger = require('./src/core/logging/logger');

// REQUEST CONFIGURATION
app.use(cors({credentials: true, origin: process.env.CORSORIGINURL}));
app.use(bodyParser.json());
app.use(cookieParser());

// ROUTES / MIDDLEWARE CONFIGURATION
var usersRoute = exportRoute(createProtectedRoute(userRouter));
var boardRoute = exportRoute(createProtectedRoute(boardsRouter));
var threadsRoute = exportRoute(createProtectedRoute(threadsRouter));
var authenticationRoute = exportRoute(createBaseRoute(authenticationRouter));

app.use('/users', usersRoute);
app.use('/boards', boardRoute);
app.use('/threads', threadsRoute);
app.use('/auth', authenticationRoute);
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