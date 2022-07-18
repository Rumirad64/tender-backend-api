
const jwtHelper = require('../helpers/jwt.helper.js');

const userService = require('../services/user.service.js');

exports.validateToken = (req, res) => {
    res.json({
        message: 'Token is valid'
    });
};

