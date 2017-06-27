const router = require('koa-router')()

router.get('/', async (ctx, next) => {
    await ctx.render('login')
})



router.get('/chat', async (ctx, next) => {
    console.log('userId')
    console.log(ctx.cookies.get('userName'))
    if(!ctx.cookies.get('userName')) {
        ctx.redirect('/')
    }
    await ctx.render('socket')
})

module.exports = router
