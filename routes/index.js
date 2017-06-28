const router = require('koa-router')()

router.get('/', async (ctx, next) => {
    await ctx.render('login')
})



router.get('/chat', async (ctx, next) => {
    console.log('userId')
    console.log(ctx.cookies.get('userName'))
    if(!ctx.cookies.get('userName')||ctx.cookies.get('userName')=='undefined') {
        ctx.redirect('/')
    }else {
        ctx.redirect('/chat/room/'+ctx.cookies.get('roomId'))
    }
})

router.get('/chat/room/:roomId',async(ctx,next)=> {
    if(!ctx.cookies.get('userName')||ctx.cookies.get('userName')=='undefined') {
        ctx.redirect('/')
    }else {
        console.log(ctx.url)
        console.log(ctx.params)
        await ctx.render('socket',{
            roomId : ctx.cookies.get('roomId')
        })
    }


})


module.exports = router
