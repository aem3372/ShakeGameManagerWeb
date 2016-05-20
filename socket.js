var io = require('socket.io-client');

var socket = io.connect('http://localhost:8080/system');

console.log('connect socket');

socket.on("count", function(data) {
  console.log(data);
});

module.exports = socket;
