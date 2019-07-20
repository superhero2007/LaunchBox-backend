const axios = require('axios');
const xml2js = require('xml2js');

const { parseString, Builder } = xml2js;


const END_POINT = 'https://brandguide.recurly.com/v2/';
const PLAN_END_POINT = `${END_POINT}plans`;
const ACCOUNT_END_POINT = `${END_POINT}accounts`;
const MEASURED_UNIT_END_POINT = `${END_POINT}measured_units`;
const SUBSCRIPTION_END_POINT = `${END_POINT}subscriptions`;
const INVOICE_END_POINT = `${END_POINT}invoices`;
const DEFAULT_CONFIG = {
  headers: {
    Authorization: 'Basic NDg5Mzk0ZGFhZjM0NGE0MmFhZDg3ZDgzN2NhMDc3MTE6',
    'X-Api-Version': '2.20',
    'Content-Type': 'application/xml; charset=utf-8',
    Accept: 'application/xml'
  }
};

const xmlToObj = (xmlData) => {
  let result;
  parseString(xmlData, { trim: true }, (err, data) => {
    result = data;
  });
  return result;
};

// List Plan
const listPlan = async () => {
  try {
    const res = await axios.get(PLAN_END_POINT, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).plans;
      console.log('[List Plan Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[List Plan Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Fetch Plan
const fetchPlan = async (planCode) => {
  try {
    const res = await axios.get(`${PLAN_END_POINT}/${planCode}`, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).plan;
      console.log('[Fetch Plan Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Fetch Plan Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Create Plan
const createPlan = async (plan) => {
  try {
    const builder = new Builder();
    const data = builder.buildObject(plan);
    const res = await axios.post(PLAN_END_POINT, data, DEFAULT_CONFIG);
    if (res.status === 201) {
      const result = xmlToObj(res.data).plan;
      console.log('[Create Plan Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Create Plan Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Update Plan
const updatePlan = async (plan, planCode) => {
  try {
    const builder = new Builder();
    const data = builder.buildObject(plan);
    const res = await axios.put(`${PLAN_END_POINT}/${planCode}`, data, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).plan;
      console.log('[Update Plan Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Update Plan Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Delete Plan
const deletePlan = async (planCode) => {
  try {
    const res = await axios.delete(`${PLAN_END_POINT}/${planCode}`, DEFAULT_CONFIG);
    if (res.status === 204) {
      console.log('[Delete Plan Success:] ');
      return 'Success';
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Delete Plan Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};


// List Plan Add On
const listPlanAddOn = async (planCode) => {
  try {
    const res = await axios.get(`${PLAN_END_POINT}/${planCode}/add_ons`, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).add_ons;
      console.log('[List Plan Add On Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[List Plan Add On Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Fetch Plan Add On
const fetchPlanAddOn = async (planCode, addOnCode) => {
  try {
    const res = await axios.get(`${PLAN_END_POINT}/${planCode}/add_ons/${addOnCode}`, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).add_on;
      console.log('[Fetch Plan Add On Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Fetch Plan Add On Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Create Plan Add On
const createPlanAddOn = async (planCode, addOn) => {
  try {
    const builder = new Builder();
    const data = builder.buildObject(addOn);
    console.log(data);
    const res = await axios.post(`${PLAN_END_POINT}/${planCode}/add_ons`, data, DEFAULT_CONFIG);
    if (res.status === 201) {
      const result = xmlToObj(res.data).add_on;
      console.log('[Create Plan Add On Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Create Plan Add On Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Update Plan Add On
const updatePlanAddOn = async (planCode, addOnCode, addOn) => {
  try {
    const builder = new Builder();
    const data = builder.buildObject(addOn);
    const res = await axios.put(`${PLAN_END_POINT}/${planCode}/add_ons/${addOnCode}`, data, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).add_on;
      console.log('[Update Plan Add On Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Update Plan Add On Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Delete Plan Add On
const deletePlanAddOn = async (planCode, addOnCode) => {
  try {
    const res = await axios.delete(`${PLAN_END_POINT}/${planCode}/add_ons/${addOnCode}`, DEFAULT_CONFIG);
    if (res.status === 204) {
      console.log('[Delete Plan Add On Success:] ');
      return 'Success';
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Delete Plan Add On Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};


// List Measured Unit
const listMeasuredUnit = async () => {
  try {
    const res = await axios.get(MEASURED_UNIT_END_POINT, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).measured_units;
      console.log('[List Measured Unit Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[List Measured Unit Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Fetch Measured Unit
const fetchMeasuredUnit = async (measuredUnitId) => {
  try {
    const res = await axios.get(`${MEASURED_UNIT_END_POINT}/${measuredUnitId}`, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).measured_unit;
      console.log('[Fetch Measured Unit Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Fetch Measured Unit Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Create Measured Unit
const createMeasuredUnit = async (measuredUnit) => {
  try {
    const builder = new Builder();
    const data = builder.buildObject(measuredUnit);
    const res = await axios.post(MEASURED_UNIT_END_POINT, data, DEFAULT_CONFIG);
    if (res.status === 201) {
      const result = xmlToObj(res.data).measured_unit;
      console.log('[Create Measured Unit Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Create Measured Unit Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Update Measured Unit
const updateMeasuredUnit = async (measuredUnit, measuredUnitId) => {
  try {
    const builder = new Builder();
    const data = builder.buildObject(measuredUnit);
    const res = await axios.put(`${MEASURED_UNIT_END_POINT}/${measuredUnitId}`, data, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).measured_unit;
      console.log('[Update Measured Unit Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Update Measured Unit Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Delete Measured Unit
const deleteMeasuredUnit = async (measuredUnitId) => {
  try {
    const res = await axios.delete(`${MEASURED_UNIT_END_POINT}/${measuredUnitId}`, DEFAULT_CONFIG);
    if (res.status === 204) {
      console.log('[Delete Measured Unit Success:] ');
      return 'Success';
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Delete Measured Unit Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};


// List Account
const listAccount = async () => {
  try {
    const res = await axios.get(ACCOUNT_END_POINT, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).accounts;
      console.log('[List Account Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[List Account Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Fetch Account
const fetchAccount = async (accountCode) => {
  try {
    const res = await axios.get(`${ACCOUNT_END_POINT}/${accountCode}`, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).account;
      console.log('[Fetch Account Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Fetch Account Error:] ', result.description[0]._);
    // throw new Error(result.description[0]._);
    return null;
  }
};

// Create Account
const createAccount = async (account) => {
  try {
    const builder = new Builder();
    const data = builder.buildObject(account);
    const res = await axios.post(ACCOUNT_END_POINT, data, DEFAULT_CONFIG);
    if (res.status === 201) {
      const result = xmlToObj(res.data).account;
      console.log('[Create Account Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).errors;
    console.log('[Create Account Error:] ', result.error[0]._);
    // throw new Error(result.error[0]._);
    return null;
  }
};

// Update Account
const updateAccount = async (account, accountCode) => {
  try {
    const builder = new Builder();
    const data = builder.buildObject(account);
    const res = await axios.put(`${ACCOUNT_END_POINT}/${accountCode}`, data, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).account;
      console.log('[Update Account Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Update Account Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Reopen Account
const reopenAccount = async (accountCode) => {
  try {
    const res = await axios.put(`${ACCOUNT_END_POINT}/${accountCode}/reopen`, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).account;
      console.log('[Update Account Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Update Account Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Delete Account
const deleteAccount = async (accountCode) => {
  try {
    const res = await axios.delete(`${ACCOUNT_END_POINT}/${accountCode}`, DEFAULT_CONFIG);
    if (res.status === 204) {
      console.log('[Delete Account Success:] ');
      return 'Success';
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Delete Account Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// List Subscription
const listSubscription = async () => {
  try {
    const res = await axios.get(SUBSCRIPTION_END_POINT, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).subscriptions;
      console.log('[List Subscription Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[List Subscription Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// List Account's Subscription
const listAccountSubscription = async (accountCode) => {
  try {
    const res = await axios.get(`${ACCOUNT_END_POINT}/${accountCode}/subscriptions`, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).subscriptions;
      console.log('[List Account\'s Subscription Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[List Account\'s Subscription Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Fetch Subscription
const fetchSubscription = async (uuid) => {
  try {
    const res = await axios.get(`${SUBSCRIPTION_END_POINT}/${uuid}`, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).subscription;
      console.log('[Fetch Subscription Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Fetch Subscription Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Create Subscription
const createSubscription = async (subscription) => {
  try {
    const builder = new Builder();
    const data = builder.buildObject(subscription);
    console.log(data);
    const res = await axios.post(SUBSCRIPTION_END_POINT, data, DEFAULT_CONFIG);
    if (res.status === 201) {
      const result = xmlToObj(res.data).subscription;
      console.log('[Create Subscription Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Create Subscription Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Update Subscription
const updateSubscription = async (subscription, uuid) => {
  try {
    const builder = new Builder();
    const data = builder.buildObject(subscription);
    const res = await axios.put(`${SUBSCRIPTION_END_POINT}/${uuid}`, data, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).subscription;
      console.log('[Update Subscription Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Update Subscription Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Cancel Subscription
const cancelSubscription = async (uuid) => {
  try {
    const res = await axios.put(`${SUBSCRIPTION_END_POINT}/${uuid}/cancel`, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).subscription;
      console.log('[Cancel Subscription Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Cancel Subscription Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// List Invoice
const listInvoice = async () => {
  try {
    const res = await axios.get(INVOICE_END_POINT, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).invoices;
      console.log('[List Invoice Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[List Invoice Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// List Account's Invoice
const listAccountInvoice = async (accountCode) => {
  try {
    const res = await axios.get(`${ACCOUNT_END_POINT}/${accountCode}/invoices`, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).invoices;
      console.log('[List Account\'s Invoice Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[List Account\'s Invoice Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};

// Fetch Invoice
const fetchInvoice = async (uuid) => {
  try {
    const res = await axios.get(`${INVOICE_END_POINT}/${uuid}`, DEFAULT_CONFIG);
    if (res.status === 200) {
      const result = xmlToObj(res.data).invoice;
      console.log('[Fetch Invoice Success:] ', result);
      return result;
    }
    return null;
  } catch (error) {
    const result = xmlToObj(error.response.data).error;
    console.log('[Fetch Invoice Error:] ', result.description[0]._);
    throw new Error(result.description[0]._);
  }
};


module.exports = {
  listPlan,
  fetchPlan,
  createPlan,
  updatePlan,
  deletePlan,
  listPlanAddOn,
  fetchPlanAddOn,
  createPlanAddOn,
  updatePlanAddOn,
  deletePlanAddOn,
  listMeasuredUnit,
  fetchMeasuredUnit,
  createMeasuredUnit,
  updateMeasuredUnit,
  deleteMeasuredUnit,
  listAccount,
  fetchAccount,
  createAccount,
  updateAccount,
  reopenAccount,
  deleteAccount,
  listSubscription,
  listAccountSubscription,
  fetchSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  listInvoice,
  listAccountInvoice,
  fetchInvoice
};
