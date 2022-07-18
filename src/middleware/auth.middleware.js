const jwt = require('jsonwebtoken');

const helpers = require('../helpers/jwt.helper');

//! authenticattion middleware
exports.Auth = (req, res, next) => {
        //verify x-auth-token via jwt
        const token = req.headers[process.env.AUTH_HEADER_NAME];

        if (!token) {
            res.status(401).json({ message: 'Unauthorized' })
        } else {
            try {
                const decoded = helpers.VerifyJWT(token);
                req.user = decoded;   //put decoded data into req.user to achieve authorization
                console.log(`user -> ${req.user.email} is authenticated with JWT token`);
                next();
            } catch (err) {
                res.status(401).json({ message: 'Unauthorized' })
            }
        }
    
}
