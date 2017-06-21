

const socketIo = require('socket.io');


chat={};

chat.init = function(server){
	this.io = socketIo(server)
	this.run();
}

chat.run = function(){
	var that = this;
	this.io.on('connection',function(socket){
		
		that.getMsg(socket);
		
		
	})
	
}



chat.getMsg = function(socket){
	var that = this;
	
	
	socket.on('Msg',function(data){
		console.log(data)
		that.io.emit('talkMsg',data)
	})
	
	
}





module.exports = chat; 