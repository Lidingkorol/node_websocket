

const socketIo = require('socket.io');
const { query } = require('../init/index')

var chat={

};



//房间对象

var roomList=[]


function creatObj(master,list) {
	var o = new Object();
	o.master = master;
	o.list = list;
	return o;
}

function skChat(vm,target,emitTarget,data) {
	socket.on(target,function(data){
		console.log(data)
		vm.io.emit(emitTarget,data)
	})
}

function setCookie(all) {
    var list = all.split( "; " );
    var cookie={};
    for( var i=0; i<list.length; i++ ){
        var singleCookie = list[i];
        var p = singleCookie.indexOf( "=" );
        var name = singleCookie.substring( 0, p );
        var value = singleCookie.substring( p+1 );
        value = decodeURIComponent( value );
        cookie[name] = value;
    }
    return cookie;
}


chat.init = function(server){
	this.io = socketIo(server)
	this.run();
}



chat.run = function(){
	var that = this;
	this.io.on('connection',function(socket){
		//let asd=[]
		//let url = socket.handshake.headers.referer;
        //let splited = url.split('/');
        //that.roomID = splited[splited.length - 1];   // 获取房间ID
		//roomList.push(creatObj(roomID,asd))
		//console.log(roomList)


        that.comeIn(socket);
		
		that.getMsg(socket);
		
		that.leave(socket);
	})
	
}





chat.getMsg = function(socket){
	var that = this;
	
	
	socket.on('talkMsg',function(data){
        that.cookie = setCookie(this.handshake.headers.cookie)
        that.userName = that.cookie.userName
        let url = socket.handshake.headers.referer;
        let splited = url.split('/');
        let roomID = splited[splited.length - 1];   // 获取房间ID
		console.log(this.handshake.headers.referer)
        let msgData  = {
            fromUser : that.userName,
            nickName : that.userName,
            toUser : '',
            type : 'talk',
            content : data
        }
		that.io.to(roomID).emit('emit-talkMsg',msgData)
	})
	
	
}

chat.comeIn = function(socket){
	var that = this;
    let url = socket.handshake.headers.referer;
    let splited = url.split('/');
    let roomID = splited[splited.length - 1];   // 获取房间ID
	socket.join(roomID)
    this.cookie = setCookie(socket.handshake.headers.cookie)
    this.userName = this.cookie.userName

    let msgData  = {
        fromUser : this.userName,
        nickName : this.userName,
        toUser : '',
        type : 'login',
        content : ''
    }
    this.io.to(roomID).emit('emit-sysMsg',msgData);
}


chat.leave = function(socket){
	var that = this;
	socket.on('disconnect',function(){
        let url = this.handshake.headers.referer;
        let splited = url.split('/');
        let roomID = splited[splited.length - 1];   // 获取房间ID
        that.cookie = setCookie(this.handshake.headers.cookie)
        that.userName = that.cookie.userName
        let msgData  = {
            fromUser : that.userName,
            nickName : that.userName,
            toUser : '',
            type : 'leave',
            content : ''
        }
		console.log('离开')
		console.log(msgData)
		that.io.to(roomID).emit('emit-sysMsg',msgData)
	})
	
}


module.exports = chat; 