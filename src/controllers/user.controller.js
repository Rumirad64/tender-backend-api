
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

exports.Me = async (req, res) => {
  try {
    const result = await userService.GetUserByID(req.user.id);
    res.json({
      message: 'User found',
      data: result,
      error: null,
    });
  } catch (err) {
    res.json({
      message: 'Error finding user',
      data: null,
      error: err,
    });
  }
}


exports.All = async (req, res) => {
  try {
    const result = await userService.GetAllUsers();
    res.json({
      message: 'Users found',
      data: result,
      error: null,
    });
  } catch (err) {
    res.json({
      message: 'Error finding users',
      data: null,
      error: err,
    });
  }
};

exports.Delete = async (req, res) => {
  try {
    const result = await userService.DeleteUser(req.user.id, req.params.id);
    res.json({
      message: 'User deleted successfully',
      data: result,
      error: null,
    });
  } catch (err) {
    res.json({
      message: 'Error deleting user',
      data: null,
      error: err,
    });
  }
}