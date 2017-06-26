const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser')

const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')

const { store } = require('./init/index')
const routers = require('./routes/api/index')

const chat = require('./socketio/socket')

const server = require('http').createServer(app.callback());

//const chat = require('./socketio/index')

const index = require('./routes/index')
const users = require('./routes/users')
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(cors())					//cors跨域资源访问
app.use(bodyParser())  	//ctx.body解析中间件
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', { 
		map: {html: 'nunjucks' }
	}
))

// 使用session中间件
app.use(session({
    key: 'SESSION_ID',
    store: new MysqlStore(store)
}))


// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next();
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
 app.use(index.routes(), index.allowedMethods())
 app.use(users.routes(), users.allowedMethods())

// 初始化路由中间件
app.use(routers.routes()).use(routers.allowedMethods())


chat.init(server);

server.listen(3000);



module.exports = app
