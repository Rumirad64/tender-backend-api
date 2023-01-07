
const tenderService = require('../services/tender.service');

exports.CreateTender = async (req, res) => {
  try {
    //title , description , category , location, expirydate, companyid, image, document
    const companyid = req.user.companyid;
    const ex = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(ex);
    //req.body.expirydate = ex;

    const result = await tenderService.CreateTender(req.body.title, req.body.description, req.body.category, req.body.location, req.body.expirydate, companyid, req.body.image, req.body.document);
    res.json({
      message: 'Tender created successfully',
      data: result,
      error: null,
    });
  } catch (err) {
    res.json({
      message: 'Error creating tender',
      data: null,
      error: err,
    });
  }
}

exports.GetTenderByID = async (req, res) => {
  try {
    const result = await tenderService.GetTenderByID(req.params.id);
    res.json({
      message: 'Tender found',
      data: result,
      error: null,
    });
  } catch (err) {
    res.json({
      message: 'Error finding tender',
      data: null,
      error: err,
    });
  }
}

exports.GetAllTenders = async (req, res) => {
  try {
    const search = req.query.search || '';
    const category = req.query.category || '';
    const result = await tenderService.GetAllTenders(search, category);
    res.json({
      message: 'Tenders found',
      data: result,
      error: null,
    });
  } catch (err) {
    res.json({
      message: 'Error finding tenders',
      data: null,
      error: err,
    });
  }
}


exports.GetMyTenders = async (req, res) => {
  try {
    const result = await tenderService.GetMyTenders(req.user.companyid);
    res.json({
      message: 'Tenders found',
      data: result,
      error: null,
    });
  } catch (err) {
    res.json({
      message: 'Error finding tenders',
      data: null,
      error: err,
    });
  }
}

exports.DeleteTender = async (req, res) => {
  try {
    const result = await tenderService.DeleteTender(req.user.companyid, req.params.id);
    res.json({
      message: 'Tender deleted successfully',
      data: result,
      error: null,
    });
  } catch (err) {
    res.json({
      message: 'Error deleting tender',
      data: null,
      error: err,
    });
  }
}

exports.BidOnTender = async (req, res) => {
  const tenderid = req.params.id;
  const companyid = req.user.companyid;
  const bidamount = req.body.bidamount;

  try {
    const result = await tenderService.BidOnTender(tenderid, companyid, bidamount);
    res.json({
      message: 'Bid created successfully',
      data: result,
      error: null,
    });
  }
  catch (err) {
    res.json({
      message: 'Bid already exists',
      data: null,
      error: err,
    });
  }
}

exports.GetBidsOnTender = async (req, res) => {
  const tenderid = req.params.id;
  try {
    const result = await tenderService.GetBidsOnTender(tenderid);
    res.json({
      message: 'Bids found',
      data: result,
      error: null,
    });
  } catch (err) {
    res.json({
      message: 'Error finding bids',
      data: null,
      error: err,
    });
  }
}

exports.GetBidCountOnTender = async (req, res) => {
  const tenderid = req.params.id;
  try {
    const result = await tenderService.GetBidCountOnTender(tenderid);
    res.json({
      message: 'Bids found',
      data: result,
      error: null,
    });
  } catch (err) {
    res.json({
      message: 'Error finding bids',
      data: null,
      error: err,
    });
  }
}

exports.GetMyBids = async (req, res) => {
  const companyid = req.user.companyid;
  try {
    const result = await tenderService.GetMyBids(companyid);
    res.json({
      message: 'Bids found',
      data: result,
      error: null,
    });
  } catch (err) {
    res.json({
      message: 'Error finding bids',
      data: null,
      error: err,
    });
  }
}