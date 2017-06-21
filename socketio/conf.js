
//express.js framework
var express = require('express');
var app = express();

//socket io module
var socketIo = require('socket.io');

// create a new ojbect chat
var chat = {};

//chat property
// io object
chat.io = false;
//user name
chat.userName = {};
//name has been used
chat.usedName = [];
//user number
chat.userNum = 0;
//current room name
chat.currentRoom = {};

//room list
chat.roomList = ['Lobby'];

//chat initialization with the passing http object
chat.initialize = function(http) {
	this.io = socketIo(http);
	this.ioListen();
}

// major socket listening method
chat.ioListen = function() {
	
	var that = this;

	this.io.on('connection', function(socket){
		
		that.assignRoom(socket);

		socket.on('change room', function(msg){

			that.changeRoom(socket, msg);

		});

		that.sysMsg(socket);

		that.userMsg(socket);


		that.changeName(socket);

		that.disconnect(socket);

	});
}

// send user message
chat.userMsg = function(socket) {

	var that = this;

	socket.on('chat message', function(msg){
		msg = that.userName[socket.id] + ' said: ' + msg;

		that.io.to(that.currentRoom[socket.id]).emit('chat message', msg);
	});

}

//send system message
chat.sysMsg = function(socket) {

	var that = this;

	socket.on('sys message', function(msg){
		that.io.to(that.currentRoom[socket.id]).emit('sys message', msg);
	});	
	
}

//assign a guest name to new joining user
chat.assignGuestName = function(socket) {

	this.userName[socket.id] = 'Guest' + this.userNum;
	this.usedName.push('Guest' + this.userNum);
	this.userNum++;

	var msg = this.userName[socket.id] + ' enter the room! Welcome!';

	this.io.to(this.currentRoom[socket.id]).emit('new user', msg);

}

//disconnection
chat.disconnect = function(socket) {

	var that = this;

	socket.on('disconnect', function(){
		var msg = that.userName[socket.id] + ' just left';

		that.io.emit('exit user', msg);

		var nameIndex = that.usedName.indexOf(that.userName[socket.id]);

		delete that.userName[socket.id];
		delete that.usedName[nameIndex];   

		socket.leave(that.currentRoom[socket.id]);

		delete that.currentRoom[socket.id]; 
	});

}

//change user name
chat.changeName = function(socket) {

	var that = this;

	socket.on('change name', function(msg){
		if (that.usedName.indexOf(msg) == -1) {

			var nameIndex = that.usedName.indexOf(that.userName[socket.id]);
			that.userName[socket.id] = msg;
			that.usedName[nameIndex] = msg;
			socket.emit('sys message', 'Your name has been changed as ' + msg);
		}
		else {
			socket.emit('sys message', 'Your name has been used');
		}

	});
}

//assign room 'Lobby' once they enter
chat.assignRoom = function(socket) {
	
	var that = this;
	socket.join('Lobby', function(){
		that.currentRoom[socket.id] = 'Lobby';
		that.assignGuestName(socket);
		socket.emit('room list', that.roomList);
	});
}

//change room
chat.changeRoom = function(socket, msg) {

	var that = this;

	var sysMsg = that.userName[socket.id] + ' left room ' + that.currentRoom[socket.id];

	this.io.to(this.currentRoom[socket.id]).emit('sys message', sysMsg);

	if (msg != 'room') {
		socket.leave(this.currentRoom[socket.id], function(){

			var isExist = false;

			if (that.currentRoom[socket.id] !== 'Lobby') {

				for (key in that.currentRoom) {

					if (key == socket.id) {
						continue;
					}

					if (that.currentRoom[key] === that.currentRoom[socket.id]) {
						isExist = true;
						break;
					}
				}
				
			}
			else {
				isExist = true;
			}

			if (isExist === false) {
				var roomIndex = that.roomList.indexOf(that.currentRoom[socket.id]);
				console.log(roomIndex);
				that.roomList.splice(roomIndex, 1);
			}

			console.log(isExist + '-' + that.roomList);
			
			socket.join(msg);

			that.currentRoom[socket.id] = msg;

			sysMsg = that.userName[socket.id] + ' join room ' + that.currentRoom[socket.id];

			if (that.roomList.indexOf(msg) == -1) {
				that.roomList.push(msg);
				// console.log('add ' + that.roomList);
			}

			socket.emit('sys message', sysMsg);

			socket.emit('change room name', {'msg': msg, 'roomList': that.roomList});
			
			that.io.emit('room list', that.roomList);

		});
	}
	else {
		socket.emit('sys message', '无法加入房间room！');
	}
		

	
}

module.exports = chat;
