

const socketIo = require('socket.io');


var chat={};



//房间对象

var roomList=[]




function skChat(vm,target,emitTarget,data) {
	socket.on(target,function(data){
		console.log(data)
		vm.io.emit(emitTarget,data)
	})
}


chat.init = function(server){
	this.io = socketIo(server)
	this.run();
}

chat.run = function(){
	var that = this;
	this.io.on('connection',function(socket){
		
		that.comeIn(socket);
		
		that.getMsg(socket);
		
		that.leave(socket);
	})
	
}


chat.getMsg = function(socket){
	var that = this;
	
	
	socket.on('talkMsg',function(data){
		console.log(data)
		that.io.emit('emit-talkMsg',data)
	})
	
	
}

chat.comeIn = function(socket){
	var that = this;
	
	socket.on('sysMsg',function(data){
		console.log('进入')
		console.log(data)
		that.io.emit('emit-sysMsg',data)
	})
	
}


chat.leave = function(socket){
	var that = this; 
	
	socket.on('disconnect',function(data){
		data.type = 'leave';
		console.log('离开')
		console.log(data)
		that.io.emit('emit-sysMsg',data)
	})
	
}


module.exports = chat; 