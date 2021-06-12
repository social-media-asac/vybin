'use stric';



const socket = io();

socket.on('front', payload => {
  console.log(`here is your : ${payload}`);
});