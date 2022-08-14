const userService = require('../services/user.service.js');
const companyService = require('../services/company.service.js');


exports.CreateCompany = async (req, res) => {
  try {
    const userid = req.user.id;
    const result = await companyService.CreateCompany(req.body.name, req.body.ownername, req.body.address, req.body.city, req.body.url, req.body.tel, req.body.type, req.body.category);
    const ret = await companyService.AssignCompanyToUser(userid, result.id);
    res.json({
      message: 'Company created successfully',
      data: result,
      error: null,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: 'Error creating company',
      data: null,
      error: err,
    });
  }
};

exports.AssignCompanyToUser = async (req, res) => {
  try {
    console.log("req.body) ", req.body);
    const result = await companyService.AssignCompanyToUser(req.user.id, req.body.companyid);
    res.json({
      message: 'Company assigned to user successfully',
      data: result,
      error: null,
    });
  } catch (err) {
    console.log(err);
    res.json({
      message: 'Error assigning company to user',
      data: null,
      error: err,
    });
  }
}

exports.All = async (req, res) => {
  try {
    const result = await companyService.GetAllCompanies();
    res.json({
      message: 'Companies found',
      data: result,
      error: null,
    });
  } catch (err) {
    res.json({
      message: 'Error finding companies',
      data: null,
      error: err,
    });
  }
}

exports.GetCompanyByID = async (req, res) => {
  try {
    const result = await companyService.GetCompanyByID(req.params.id);
    res.json({
      message: 'Company found',
      data: result,
      error: null,
    });
  }
  catch (err) {
    res.json({
      message: 'Error finding company',
      data: null,
      error: err,
    });
  }
}