const express = require('express');

const router = express.Router({ mergeParams: true });

const recurly = require('../helpers/recurly.helper');

const listPlan = async (req, res, next) => {
  try {
    const plans = await recurly.listPlan();
    return res.send({ plans });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const fetchPlan = async (req, res, next) => {
  const { planCode } = req.params;
  try {
    const plan = await recurly.fetchPlan(planCode);
    return res.send({ plan });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const createPlan = async (req, res, next) => {
  const { plan } = req.body;
  // const plan = {
  //   plan: {
  //     plan_code: 'yearly',
  //     name: 'Yearly Plan',
  //     unit_amount_in_cents: {
  //       EUR: 10800,
  //     },
  //     plan_interval_length: 12,
  //     plan_interval_unit: 'months',
  //     tax_exempt: 'false',
  //     auto_renew: 'true'
  //   }
  // };
  try {
    const result = await recurly.createPlan(plan);
    return res.send({ plan: result });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const updatePlan = async (req, res, next) => {
  const { planCode } = req.params;
  const { plan } = req.body;
  // const plan = {
  //   plan: {
  //     trial_interval_unit: 'days',
  //     trial_interval_length: 7,
  //   }
  // };
  try {
    const result = await recurly.updatePlan(plan, planCode);
    return res.send({ plan: result });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const deletePlan = async (req, res, next) => {
  const { planCode } = req.params;
  try {
    await recurly.deletePlan(planCode);
    return res.send({ success: true });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const listPlanAddOn = async (req, res, next) => {
  const { planCode } = req.params;
  try {
    const addOns = await recurly.listPlanAddOn(planCode);
    return res.send({ addOns });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const fetchPlanAddOn = async (req, res, next) => {
  const { planCode, addOnCode } = req.params;
  try {
    const addOn = await recurly.fetchPlanAddOn(planCode, addOnCode);
    return res.send({ addOn });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const createPlanAddOn = async (req, res, next) => {
  const { planCode } = req.params;
  // const { addOn } = req.body;
  const addOn = {
    add_on: {
      add_on_code: 'monthly_brand',
      name: 'Monthly Brand AddOn',
      add_on_type: 'usage',
      measured_unit_id: '2790366595220205586',
      usage_type: 'price',
      unit_amount_in_cents: {
        USD: 600,
      }
    }
  };
  try {
    const result = await recurly.createPlanAddOn(planCode, addOn);
    return res.send({ addOn: result });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const updatePlanAddOn = async (req, res, next) => {
  const { planCode, addOnCode } = req.params;
  const { addOn } = req.body;
  // const addOn = {
  //   add_on: {
  //     trial_interval_unit: 'days',
  //     trial_interval_length: 7,
  //   }
  // };
  try {
    const result = await recurly.updatePlanAddOn(addOn, planCode, addOnCode);
    return res.send({ addOn: result });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const deletePlanAddOn = async (req, res, next) => {
  const { planCode, addOnCode } = req.params;
  try {
    await recurly.deletePlanAddOn(planCode, addOnCode);
    return res.send({ success: true });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};


const listMeasuredUnit = async (req, res, next) => {
  try {
    const measuredUnits = await recurly.listMeasuredUnit();
    return res.send({ measuredUnits });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const fetchMeasuredUnit = async (req, res, next) => {
  const { measuredUnitId } = req.params;
  try {
    const measuredUnit = await recurly.fetchMeasuredUnit(measuredUnitId);
    return res.send({ measuredUnit });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const createMeasuredUnit = async (req, res, next) => {
  const { measuredUnit } = req.body;
  // const measuredUnit = {
  //   measured_unit: {
  //     name: 'Monthly User Add On Unit'.
  //     display_name: 'Monthly User Add On Unit'
  //   }
  // };
  try {
    const result = await recurly.createMeasuredUnit(measuredUnit);
    return res.send({ measuredUnit: result });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const updateMeasuredUnit = async (req, res, next) => {
  const { measuredUnitId } = req.params;
  const { measuredUnit } = req.body;
  // const measuredUnit = {
  //   measured_unit: {
  //     name: 'Monthly User Add On Unit'.
  //     display_name: 'Monthly User Add On Unit'
  //   }
  // };
  try {
    const result = await recurly.updateMeasuredUnit(measuredUnit, measuredUnitId);
    return res.send({ measuredUnit: result });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const deleteMeasuredUnit = async (req, res, next) => {
  const { measuredUnitId } = req.params;
  try {
    await recurly.deleteMeasuredUnit(measuredUnitId);
    return res.send({ success: true });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const listAccount = async (req, res, next) => {
  try {
    const accounts = await recurly.listAccount();
    return res.send({ accounts });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const fetchAccount = async (req, res, next) => {
  const { accountCode } = req.params;
  try {
    const account = await recurly.fetchAccount(accountCode);
    return res.send({ account });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const createAccount = async (req, res, next) => {
  const { account } = req.body;
  // const account = {
  //   account: {
  //     account_code: '1',
  //     parent_account_code: '2',
  //     email: 'verena@example.com',
  //     first_name: 'Verena',
  //     last_name: 'Example',
  //     username: 'verena1234',
  //     company_name: 'Recurly Inc',
  //     preferred_locale: 'en-US',
  //     address: {
  //       address1: '123 Main St.',
  //       city: 'San Francisco',
  //       state: 'CA',
  //       zip: '94105',
  //       country: 'US'
  //     }
  //   }
  // };
  try {
    const result = await recurly.createAccount(account);
    return res.send({ account: result });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const updateAccount = async (req, res, next) => {
  const { accountCode } = req.params;
  const { account } = req.body;
  // const account = {
  //   account: {
  //     trial_interval_unit: 'days',
  //     trial_interval_length: 7,
  //   }
  // };
  try {
    const result = await recurly.updateAccount(account, accountCode);
    return res.send({ account: result });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const reopenAccount = async (req, res, next) => {
  const { accountCode } = req.params;
  // const account = {
  //   account: {
  //     trial_interval_unit: 'days',
  //     trial_interval_length: 7,
  //   }
  // };
  try {
    const result = await recurly.reopenAccount(accountCode);
    return res.send({ account: result });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};

const deleteAccount = async (req, res, next) => {
  const { accountCode } = req.params;
  try {
    await recurly.deleteAccount(accountCode);
    return res.send({ success: true });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: { global: { message: error.message } } });
  }
};


router.get('/plans', listPlan);
router.get('/plans/:planCode', fetchPlan);
router.post('/plans', createPlan);
router.put('/plans/:planCode', updatePlan);
router.delete('/plans/:planCode', deletePlan);

router.get('/plans/:planCode/add_ons', listPlanAddOn);
router.get('/plans/:planCode/add_ons/:addOnCode', fetchPlanAddOn);
router.post('/plans/:planCode/add_ons', createPlanAddOn);
router.put('/plans/:planCode/add_ons/:addOnCode', updatePlanAddOn);
router.delete('/plans/:planCode/add_ons/:addOnCode', deletePlanAddOn);


router.get('/measured_units', listMeasuredUnit);
router.get('/measured_units/:measuredUnitId', fetchMeasuredUnit);
router.post('/measured_units', createMeasuredUnit);
router.put('/measured_units/:measuredUnitId', updateMeasuredUnit);
router.delete('/measured_units/:measuredUnitId', deleteMeasuredUnit);


router.get('/accounts', listAccount);
router.get('/accounts/:accountCode', fetchAccount);
router.post('/accounts', createAccount);
router.put('/accounts/:accountCode', updateAccount);
router.put('/accounts/:accountCode/reopen', reopenAccount);
router.delete('/accounts/:accountCode', deleteAccount);

module.exports = router;
