

const mysql = require('mysql')

const MysqlSession = require('koa-mysql-session')

// 创建数据池
const pool  = mysql.createPool({
  	host     : '127.0.0.1',   // 数据库地址
  	user     : 'root',    // 数据库用户
  	password : 'admin',   // 数据库密码
  	database : 'mysql'  // 选中数据库
})
 
let query = function( sql, values ) {
  	return new Promise(( resolve, reject ) => {
	    pool.getConnection(function(err, connection) {
	      	if (err) {
	        	reject( err )
	      	} 
	      	else {
	    		connection.query(sql, values, ( err, rows) => {
		
		          	if ( err ) {
		            	reject( err )
		          	} else {
		            	resolve( rows )
		          	}
		          	connection.release()
		        })	
	      	}
	    })
  	})
}

// 配置存储session信息的mysql
/*let store = new MysqlSession({
    user: 'root',
    password: 'admin',
    database: 'mysql',
    host: '127.0.0.1',
})*/
let store = {
    user: 'root',
    password: 'admin',
    database: 'mysql',
    host: '127.0.0.1',
}


// 存放sessionId的cookie配置
let cookie = {
    domain: 'localhost',  // 写cookie所在的域名
    path: '/',       // 写cookie所在的路径
    maxAge: 10 * 60 * 1000, // cookie有效时长
    expires: new Date('2017-02-15'),  // cookie失效时间
    httpOnly: true,  // 是否只用于http请求中获取
    overwrite: false  // 是否允许重写
}
/*let cookie = {
    maxAge: '', // cookie有效时长
    expires: '',  // cookie失效时间
    path: '', // 写cookie所在的路径
    domain: '', // 写cookie所在的域名
    httpOnly: '', // 是否只用于http请求中获取
    overwrite: '',  // 是否允许重写
    secure: '',
    sameSite: '',
    signed: '',

}*/

module.exports = { query,store }




//数据库基本操作方法
/*const query = function ( sql, values, callback ) {
    pool.getConnection(function(err, conn) {
        if (err) {
            callback(err, false)
        } else {
            var querys = conn.query(sql, values, function(err, rows) {

                if (err) {
                    callback(err, false)
                } else {
                    callback(null,rows)
                }
            }); 
        }
    });
}*/

//数据库对外操作类
exports.DatabaseUtil = {

    //建表方法
    createTable ( sql, callback ) {
        query( sql, [], callback )
    },

    //根据id查找数据
    findDataById ( table,  id, callback) {
        let  _sql =  "select * from ?? where id = ? "
        query( _sql, [ table, id], callback )
    },

    //分页查找数据
    findDataByPage ( table, start, end , callback) {
        let  _sql =  "select * from ??  limit ? , ?"
        query( _sql, [ table,  start, end ], callback )
    },

    //插入数据
    insertData ( table, values, callback ) {
        let _sql = "insert into ?? set ?"
        query( _sql, [ table, values ], callback )
    },

    //更新数据
    updateData ( table, values, id,  callback ) {
        let _sql = "update ?? set ? where id = ?"
        query( _sql, [ table, values, id ], callback )
    },

    //删除数据
    deleteDataById ( table, id, callback ) {
        let _sql = "delete from ?? where id = ?"
        query( _sql, [ table, id ], callback )
    }
}




/*module.exports = { query }*/
