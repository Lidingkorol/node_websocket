/**
 * Created by Administrator on 2017/6/3.
 */


const router = require('koa-router')();
const user_controller = require('../../app/controllers/user_controller');


const routers =router
    .get('/getUser', user_controller.getUser)
    .post('/registerUser', user_controller.registerUser)



module.exports = routers;