const router = require('koa-router')()

router.get('/', async (ctx, next) => {
    await ctx.render('login')
})



router.get('/chat', async (ctx, next) => {
    console.log('userId')
    console.log(ctx.session.userName)
    if(!ctx.session.userName) {
        ctx.redirect('/')
    }
    await ctx.render('socket', {
        title: 'Hello Koa 2!'
    })
})

module.exports = router
