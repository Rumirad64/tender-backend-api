const express = require('express');
const router = express.Router();

const { Auth } = require('../middleware/auth.middleware.js');


// Require controller modules.
const user_controller = require('../controllers/user.controller.js');


router.post('/auth/validate-token', Auth, user_controller.validateToken); 

router.get('/hello', (req, res) => {
    res.json('Hello World! from hello route');
});                  

router.post('/user/register', user_controller.Register);
router.post('/user/sign-in', user_controller.SignIn);
router.get('/user/me', Auth, user_controller.Me);
router.get('/user/all', Auth, user_controller.All);
router.delete('/user/:id', Auth, user_controller.Delete);


module.exports = router;
