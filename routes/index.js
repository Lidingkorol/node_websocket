const router = require('koa-router')()

router.get('/', async (ctx, next) => {
	
})



router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
