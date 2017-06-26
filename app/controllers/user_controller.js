/**
 * Created by Administrator on 2017/6/3.
 */

var mysql = require('mysql');
const { query } = require('../../init/index')





/*
// 解析上下文里node原生请求的POST参数
function parsePostData( ctx ) {
  return new Promise((resolve, reject) => {
    try {
      let postdata = "";
      ctx.req.addListener('data', (data) => {
        postdata += data
      })
      ctx.req.addListener("end",function(){
        let parseData = parseQueryStr( postdata )
        resolve( parseData )
      })
    } catch ( err ) {
      reject(err)
    }
  })
}

// 将POST请求参数字符串解析成JSON
function parseQueryStr( queryStr ) {
  let queryData = {}
  let queryStrList = queryStr.split('&')
  console.log( queryStrList )
  for (  let [ index, queryStr ] of queryStrList.entries()  ) {
    let itemList = queryStr.split('=')
    queryData[ itemList[0] ] = decodeURIComponent(itemList[1])
  }
  return queryData
}
*/

/*
 * 
 *	接口
 * 
 */



//获取用户
exports.getUser = async (ctx, next) => {
	console.log(1)
    console.log(ctx.query.username)
    ctx.session = {
        userId: Math.random().toString(36).substr(2),
        userName :ctx.query.username
    }
	let dataList = await setData()

    ctx.redirect('/chat')
}



exports.registerUser = async (ctx, next) => {
	
	let postData = ctx.request.body
	
	let dataList = await selectAllData()
	
    ctx.body = postData
}




/*
 * 
 *	sql查询语句
 * 
 */



async function selectAllData( ) {
  	let sql = 'select * from `test` where name = 1 '
  	let dataList = await query( sql )
  	return dataList
}




async function setData( ) {
  	let sql = 'select * from `test` '
  	let dataList = await query( sql )
  	return dataList
}




/*
 * 
 *	设置cookies
 * 
 */


function cookies(ctx){
	ctx.cookies.set(
      	'cid', 
      	'hello world',
      	{
        	domain: 'localhost',  // 写cookie所在的域名
        	path: '/index',       // 写cookie所在的路径
        	maxAge: 10 * 60 * 1000, // cookie有效时长
        	expires: new Date('2017-02-15'),  // cookie失效时间
        	httpOnly: false,  // 是否只用于http请求中获取
        	overwrite: false  // 是否允许重写
      	}
    )
}