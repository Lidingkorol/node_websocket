

const socketIo = require('socket.io');


chat={};

chat.init = function(server){
	this.io = socketIo(server)
	this.run();
}

chat.run = function(){
	var that = this;
	this.io.on('connection',function(socket){
		
	})
	
}


module.exports = chat; 