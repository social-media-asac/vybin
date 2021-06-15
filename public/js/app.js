'use strict';



const socket = io();

socket.on('front', payload => {
  console.log(`here is your : ${payload}`);
});

socket.emit('addUser');
socket.on('getUsers', (users) => {
  console.log(users);
});

socket.emit('sendMessage');

socket.on('getMessage',payload =>{
  console.log(`${payload.senderId}: ${payload.text}`);
});