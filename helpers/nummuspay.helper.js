const axios = require('axios');
const crypto = require('crypto');

let token = null;

// Get Token from User Credential Information
const getToken = async () => {
  if (token) {
    return token;
  }
  try {
    const res = await axios.post(`${process.env.NUMMUSPAY_API_ENDPOINT}Token`, {
      username: process.env.NUMMUSPAY_USERNAME,
      password: process.env.NUMMUSPAY_PASSWORD
    });
    token = res.data;
    // console.log('[Token:] ', token);
    return token;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

const createHmacEncryption = str => crypto.createHmac('sha256', process.env.NUMMUSPAY_HMAC_KEY).update(str).digest('hex');

// Charges a customer with a specific amount
const charge = async (data) => {
  try {
    const token = await getToken();
    const str = JSON.stringify(data);
    const hmac = createHmacEncryption(str);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        hmac,
        payload: str
      }
    };
    const result = await axios.post(`${process.env.NUMMUSPAY_API_ENDPOINT}Charge`, data, config);
    // console.log('[Vendor:] ', result.data);
    return result.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Retrieves the company's products
const getCompanyProducts = async () => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.get(`${process.env.NUMMUSPAY_API_ENDPOINT}Companies/264/Products`, config);
    // console.log('[Company Products:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Retrieves the company's customers
const getCompanyCustomers = async () => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.get(`${process.env.NUMMUSPAY_API_ENDPOINT}Companies/264/Customers`, config);
    // console.log('[Company Customers:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Retrieves the company's Transactions
const getCompanyTransactions = async () => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.get(`${process.env.NUMMUSPAY_API_ENDPOINT}Companies/264/Transactions`, config);
    // console.log('[Company Transactions:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Retrieves the company's Invoices
const getCompanyInvoices = async () => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.get(`${process.env.NUMMUSPAY_API_ENDPOINT}Companies/264/Invoices`, config);
    // console.log('[Company Invoices:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Retrieves the details of an existing customer By ID
const getCustomer = async (id) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.get(`${process.env.NUMMUSPAY_API_ENDPOINT}Customers/${id}`, config);
    // console.log('[Customer:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Retrieves the details of an existing customer By Token
const getCustomerByToken = async (customerToken) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.get(`${process.env.NUMMUSPAY_API_ENDPOINT}Customers/GetByToken/${customerToken}`, config);
    // console.log('[Customer:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Create a new customer
const createCustomer = async (customer) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.post(`${process.env.NUMMUSPAY_API_ENDPOINT}Customers`, customer, config);
    // console.log('[Customer:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Update a customer by token
const updateCustomer = async (customer) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.put(`${process.env.NUMMUSPAY_API_ENDPOINT}Customers`, customer, config);
    console.log('[Customer:] ', res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Delete a customer
const deleteCustomer = async (id) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    await axios.delete(`${process.env.NUMMUSPAY_API_ENDPOINT}Customers/${id}`, config);
    // console.log('[Customer Deleted]');
    return true;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Retrieves the customer's Transactions
const getCustomerTransactions = async (id) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.get(`${process.env.NUMMUSPAY_API_ENDPOINT}Customers/${id}/Transactions`, config);
    // console.log('[Customer Transactions:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Retrieves the customer's Invoices
const getCustomerInvoices = async (id) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.get(`${process.env.NUMMUSPAY_API_ENDPOINT}Customers/${id}/Invoices`, config);
    // console.log('[Customer Invoices:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Get a product
const getProduct = async (id) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.get(`${process.env.NUMMUSPAY_API_ENDPOINT}Products/${id}`, config);
    // console.log('[Product:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Create a product
const createProduct = async (product) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.post(`${process.env.NUMMUSPAY_API_ENDPOINT}Products`, product, config);
    // console.log('[Product:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Delete a product
const deleteProduct = async (id) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    await axios.delete(`${process.env.NUMMUSPAY_API_ENDPOINT}Products/${id}`, config);
    // console.log('[Product Deleted]');
    return true;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Retrieves the details of an existing vendor
const getVendor = async (id) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.get(`${process.env.NUMMUSPAY_API_ENDPOINT}Vendors/${id}`, config);
    // console.log('[Vendor:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Create a vendor
const createVendor = async (vendor) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.post(`${process.env.NUMMUSPAY_API_ENDPOINT}Vendors`, vendor, config);
    // console.log('[Vendor:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Update a vendor
const updateVendor = async (vendor) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const res = await axios.put(`${process.env.NUMMUSPAY_API_ENDPOINT}Vendors`, vendor, config);
    // console.log('[Vendor:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Delete a vendor
const deleteVendor = async (id) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    await axios.delete(`${process.env.NUMMUSPAY_API_ENDPOINT}Vendors/${id}`, config);
    // console.log('[Vendor Deleted]');
    return true;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// Create Vendor Release
const createVendorRelease = async (id, amount) => {
  try {
    const token = await getToken();
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const data = {
      id,
      amount,
    };
    const res = await axios.post(`${process.env.NUMMUSPAY_API_ENDPOINT}Vendors/ReleaseFunds`, data, config);
    // console.log('[Vendor:] ', res.data);
    return res.data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

module.exports = {
  getToken,
  charge,
  getCompanyProducts,
  getCompanyCustomers,
  getCompanyTransactions,
  getCompanyInvoices,
  getCustomer,
  getCustomerByToken,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerTransactions,
  getCustomerInvoices,
  getProduct,
  createProduct,
  deleteProduct,
  getVendor,
  createVendor,
  updateVendor,
  deleteVendor,
  createVendorRelease,
};
