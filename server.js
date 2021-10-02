const express = require('express');
require('dotenv').config({path: "./config/.env"});
require('./config/db');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user.route');
const applicationsRouter = require('./routes/application.route');
const pug = require('pug');
const cors = require('cors');
const path = require('path');

//const {checkerUser} = require('./middleware/auth.middleware');

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

//routes
//app.use('*', checkerUser);
app.use('/users', userRouter);
app.use('/applications', applicationsRouter);


//server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});