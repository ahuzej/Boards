if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;

const userRouter = require('./src/users/usersRouter');
const projectRouter = require('./src/projects/projectsRouter');

app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/projects', projectRouter);

app.get('/', (req, res) => {
    res.send('bla');
});

app.listen(port, () => console.log(`App listening at port ${port}`)); 


mongoose.connect(`mongodb://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@127.0.0.1:27017/project-planner`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Moongoose connected');

});