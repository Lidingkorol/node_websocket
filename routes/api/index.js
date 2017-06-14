/**
 * Created by Administrator on 2017/6/3.
 */


const router = require('koa-router')();
const user_router = require('./user_router');

router.use('/api', user_router.routes(), user_router.allowedMethods());

module.exports = router;