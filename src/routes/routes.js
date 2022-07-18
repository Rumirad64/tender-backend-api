const express = require('express');
const router = express.Router();

const { Auth } = require('../middleware/auth.middleware.js');


// Require controller modules.
const user_controller = require('../controllers/user.controller.js');


router.post('/auth/validate-token', Auth, user_controller.validateToken);             //to validate jwt token anytime we need to validate
router.get('/hello', (req, res) => {
    res.json('Hello World! from hello route');
});                                              //to test if server is running


module.exports = router;
