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
        let roomId = ctx.cookies.get('userName')+parseInt(1000*Math.random())
        ctx.redirect('/chat/room/'+roomId)
    }
})

router.get('/chat/room/:roomId',async(ctx,next)=> {
    if(!ctx.cookies.get('userName')||ctx.cookies.get('userName')=='undefined') {
        ctx.redirect('/')
    }else {
        console.log(ctx.url)
        console.log(ctx.params)
        if(!ctx.cookies.get('roomId')) {
            ctx.cookies.set()
            var roomId = ctx.params.roomId
        }
        await ctx.render('socket',{
            roomId : roomId
        })
    }


})


module.exports = router
