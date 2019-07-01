const express = require('express');
const passportConfig = require('../config/passport');

const router = express.Router();

const nummus = require('../helpers/nummuspay.helper');

const Company = require('../models/Company');

const subscribe = async (req, res) => {
  try {
    const { company } = req.user;

    if (!company.method) {
      res.status(400).json({ errors: { global: { message: 'Invalid Payment Method' } } });
    }

    const productsResult = await nummus.getCompanyProducts();
    const companyProducts = productsResult.$values;

    if (!companyProducts.length) {
      res.status(400).json({ errors: { global: { message: 'No Subscription' } } });
    }

    const data = {
      PaymentToken: req.body.paymentToken,
      Amount: req.body.amount,
      Tax: companyProducts[0].Tax,
      Currency: 'USD',
      ProductTitle: companyProducts[0].Title,
      ProductDescription: companyProducts[0].Description
    };
    await nummus.charge(data);
    company.subscription = {
      amount: req.body.amount,
      method: req.body.method,
      users: req.body.users,
      brands: req.body.brands,
      status: 1,
      date: new Date(),
    };
    company.method = req.body.method ? 'Paypal' : 'Credit Card';
    await company.save();
    return res.send({ user: req.user.toAuthJSON() });
  } catch (error) {
    return res.status(400).json({ errors: error.errors });
  }
};

const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ _id: req.user.company });
    res.send({ company });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.user.company,
      { $set: req.body },
      { new: true });
    res.send({ company });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

router.get('/', passportConfig.authorize(), getCompany);
router.post('/', passportConfig.authorize(), updateCompany);
router.post('/subscribe', passportConfig.authorize(), subscribe);

module.exports = router;
