const express = require('express');
const passportConfig = require('../config/passport');

const router = express.Router();

const Company = require('../models/Company');
const recurly = require('../helpers/recurly.helper');

// const subscribe = async (req, res) => {
//   try {
//     const { company } = req.user;
//
//     if (!company.method) {
//       res.status(400).json({ errors: { global: { message: 'Invalid Payment Method' } } });
//     }
//
//     const productsResult = await nummus.getCompanyProducts();
//     const companyProducts = productsResult.$values;
//
//     if (!companyProducts.length) {
//       res.status(400).json({ errors: { global: { message: 'No Subscription' } } });
//     }
//
//     const data = {
//       PaymentToken: req.body.paymentToken,
//       Amount: req.body.amount,
//       Tax: companyProducts[0].Tax,
//       Currency: 'USD',
//       ProductTitle: companyProducts[0].Title,
//       ProductDescription: companyProducts[0].Description
//     };
//     await nummus.charge(data);
//     company.subscription = {
//       amount: req.body.amount,
//       method: req.body.method,
//       users: req.body.users,
//       brands: req.body.brands,
//       status: 1,
//       date: new Date(),
//     };
//     company.method = req.body.method ? 'Paypal' : 'Credit Card';
//     await company.save();
//     return res.send({ user: req.user.toAuthJSON() });
//   } catch (error) {
//     return res.status(400).json({ errors: error.errors });
//   }
// };

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

const addPayment = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.user.company,
      { $set: req.body },
      { new: true });
    res.send({ company });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const updatePayment = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.user.company,
      { $set: req.body },
      { new: true });
    res.send({ company });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const createSubscribe = async (req, res, next) => {
  const { subscription } = req.body;
  try {
    const company = await Company.findByIdAndUpdate(req.user.company,
      { $set: req.body },
      { new: true });

    const accountCode = `${company._id}`;
    const account = await recurly.fetchAccount(accountCode);
    if (account) {
      const data = {
        subscription: {
          plan_code: 'monthly',
          currency: 'USD',
          account: {
            account_code: accountCode,
          },
          subscription_add_ons: {
            subscription_add_on: [
              {
                add_on_code: 'monthly_user',
                quantity: 1,
                unit_amount_in_cents: 600
              },
              {
                add_on_code: 'monthly_brand',
                quantity: 1,
                unit_amount_in_cents: 900
              }
            ]
          }
        }
      };
      if (company.method === 'Credit Card') {
        data.subscription.account.billing_info = {
          number: company.creditCard.cardNumber,
          month: company.creditCard.expiry.split('/')[1],
          year: company.creditCard.expiry.split('/')[0],
          address1: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94105',
          country: 'US'
        };
      }
      const selectedSubscription = await recurly.createSubscription(data);
      console.log(selectedSubscription);
    }
    res.send({ company });
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};

const updateSubscribe = async (req, res, next) => {
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
router.post('/payment', passportConfig.authorize(), addPayment);
router.put('/payment', passportConfig.authorize(), updatePayment);
router.post('/subscribe', passportConfig.authorize(), createSubscribe);
router.put('/subscribe', passportConfig.authorize(), updateSubscribe);
// router.post('/subscribe', passportConfig.authorize(), subscribe);

module.exports = router;
