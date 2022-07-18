const jwt = require('jsonwebtoken');

exports.SignJWT = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return token;
}

exports.VerifyJWT = (token) => {

    //regular expression to verify google auth token 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
}

