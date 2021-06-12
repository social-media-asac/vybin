'use strict';

//////////////////////////
////// Dependencies /////
////////////////////////


const express = require('express');
const app = express();
const morgan= require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const server = require('http').createServer(app);
const socket = require('socket.io');
const io = socket(server, {
  cors: { origin: '*' },
});




//////////////////////////
////// Imports      /////
////////////////////////

// Auth routes <==> Signup <==> Signin
const authRoutes  = require('./auth/router.js');

// Error handlers <==> 404 <==> 500
const notFoundHandler = require('./errors/404.js');
const errorHandler = require('./errors/500.js');

////////// API Routes

// CRUD Posts <==> Like/disLike Posts <==> get one Post <==> get timeLine posts <==> get user profile posts
const postRoute  = require('./api/routes/posts');

// Update & Delete User <==> get a user <==> get followers <==> follow & un-follow a user
const userRoute  = require('./api/routes/users.js');

// new conversation /get conversation
const conversationRoute  = require('./api/routes/conversations');

const messageRoute = require('./api/routes/messages');

/////////////////////////////
//////// Middleware  ///////
///////////////////////////

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(express.static(path.join(__dirname, '../public')));


/////////////////////
////////////////////
//////anwar////////
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};


io.on('connection', socket => {
  console.log('finally i am connceted !!!');
  let payload = 'test';
  io.emit('front', payload);

  //when ceonnect
  console.log('a user connected.');

  //take userId and socketId from user
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  //send and get message
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit('getMessage', {
      senderId,
      text,
    });
  });

  //when disconnect
  socket.on('disconnect', () => {
    console.log('a user disconnected!');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});







/////////////////////////////
//////// Routes      ///////
///////////////////////////

// home
// app.get('/', homeHandler);

// routes

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/conversation',conversationRoute);
app.use('/api/v1/messages',messageRoute);

// Error handlers
app.use('*',notFoundHandler);
app.use(errorHandler);


// home handler
// function homeHandler(req,res){
//   console.log('homeee ');
//   res.status(201).sendFile('/index.html');
// }

//////// socket ////////////////////


//////////////////////////
////// Exports      /////
////////////////////////

module.exports = {
  server: app,
  startup: (port) => {
    server.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
