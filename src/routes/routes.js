const express = require('express');
const router = express.Router();

const { Auth } = require('../middleware/auth.middleware.js');


// Require controller modules.
const user_controller = require('../controllers/user.controller.js');
const company_controller = require('../controllers/company.controller.js');
const tender_controller = require('../controllers/tender.controller.js');

const filehandling_controller = require('../controllers/filehandling.controller.js');

router.post('/auth/validate-token', Auth, user_controller.validateToken); 

router.get('/hello', (req, res) => {
    res.json('Hello World! from hello route');
});                  

router.post('/user/register', user_controller.Register);
router.post('/user/sign-in', user_controller.SignIn);
router.get('/user/me', Auth, user_controller.Me);
router.get('/user/all', Auth, user_controller.All);
router.delete('/user/:id', Auth, user_controller.Delete);
router.post('/user/is-email-available', user_controller.IsEmailAvailable);

router.post('/company', Auth, company_controller.CreateCompany);
router.get('/company', Auth, company_controller.All);
/* router.post('/company/assign', Auth, company_controller.AssignCompanyToUser); */
router.get('/company/:id', Auth, company_controller.GetCompanyByID);

router.get('/tender', Auth, tender_controller.GetAllTenders);
router.get('/tender/my', Auth, tender_controller.GetMyTenders);  //related to my company
router.post('/tender', Auth, tender_controller.CreateTender);
router.get('/tender/:id', Auth, tender_controller.GetTenderByID);
router.delete('/tender/:id', Auth, tender_controller.DeleteTender);

router.post('/file-upload', Auth, filehandling_controller.UploadFile);
    




module.exports = router;
