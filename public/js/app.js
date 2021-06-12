'use strict';

const user =require('../../src/auth/models/users');

const socket = io();

socket.on('front', payload => {
  console.log(`here is your : ${payload}`);
});

socket.current.emit('addUser', user._id);
socket.current.on('getUsers', (users) => {
  console.log(users);
});