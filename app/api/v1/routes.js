module.exports = function (express) {
    const router = express.Router()
    // user
    require('./modules/user_routes')(router);
    

    return router;
}