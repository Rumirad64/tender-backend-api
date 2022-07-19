
const jwtHelper = require('../helpers/jwt.helper.js');

const userService = require('../services/user.service.js');

exports.validateToken = (req, res) => {
    res.json({
        message: 'Token is valid'
    });
};

exports.Register = async (req, res) => {
    try {
        const result = await userService.Register(req.body.email, req.body.password, req.body.fullname)
        res.json({
            message: 'User registered successfully',
            data: result,
            error: null,
        });
    } catch (err) {
        res.json({
            message: 'Error registering user',
            data: null,
            error: err,
        });
    }
}

exports.SignIn = async (req, res) => {
    try {
        const result = await userService.SignIn(req.body.email, req.body.password);
        const token = jwtHelper.SignJWT({
            id: result.id,
            email: result.email,
            fullname: result.fullname,
        });
        res.json({
            message: 'User signed in successfully',
            data: {
                token,
                user: result,
            },
            error: null,
        });
    } catch (err) {
        res.json({
            message: 'Error signing in user',
            data: null,
            error: err,
        });
    }
}


