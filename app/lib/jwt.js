let jwt = require('jsonwebtoken');
const User = require('../../app/api/v1/modules/models/users');
const constant = require('../lib/constants');
module.exports = async (req, res, next) => {
    try {
        const token = req.token;
        const decodedToken = jwt.verify(token, constant.cryptoConfig.secret);
        if (decodedToken) {
            let userInfo = await User.findOne({
                email: decodedToken.email,
                _id: decodedToken.userId
            });
            if (userInfo) {
                req.headers.decoded = decodedToken;
                next();
            } else {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Token is not valid'
                });
            }   
        } else {
            return res.status(401).json({
                statusCode: 401,
                message: 'Token is not valid'
            });
        }
    } catch (e) {
        return res.status(401).json({
            statusCode: 401,
            message: 'Auth token is not supplied'
        });
    }
};
