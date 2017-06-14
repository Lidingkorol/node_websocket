

const mysql = require('mysql')

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


module.exports = { query }




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
