import { apiService } from "../utils/storage";
import { API_ENDPOINTS } from "./api";


export const agentService = {
  agentEnroll: (data) =>
    apiService.post(API_ENDPOINTS.AGENT.AGENTENROLL, data)
}

export const personalDetailsService = {
  create: (data) => apiService.post(API_ENDPOINTS.PERSONAL_DETAILS.CREATE, data),
  // update: (id, data) => apiService.put(API_ENDPOINTS.PERSONAL_DETAILS.UPDATE(id), data),
};

export const addressDetailsService = {
  create: (data) => apiService.post(API_ENDPOINTS.ADDRESS_DETAILS.CREATE, data),
  // update: (id, data) => apiService.put(API_ENDPOINTS.ADDRESS_DETAILS.UPDATE(id), data),
};

export const livePhotoService = {
  upload: (formData) =>
    apiService.post(API_ENDPOINTS.LIVE_PHOTO.CREATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};


export const applicationDocumentService = {
  upload: (formData) =>
    apiService.post(API_ENDPOINTS.APPLICATION_DOCUMENT.CREATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const accountPersonalDetailsService = {
  create: (data) => apiService.post(API_ENDPOINTS.ACCOUNT_PERSONAL_DETAILS.CREATE, data),
};

export const accountNomineeService = {
  create: (data) => apiService.post(API_ENDPOINTS.ACCOUNT_NOMINEE.CREATE, data),
};

export const serviceToCustomerService = {
  create: (data) => apiService.post(API_ENDPOINTS.SERVICE_TO_CUSTOMER.CREATE, data),
};

export const forgotpass = {
  forgotPass: (identifier) =>
    apiService.post(API_ENDPOINTS.AUTH.FORGOTPASS(identifier)),

  otpverify: (identifier, otp) =>
    apiService.post(API_ENDPOINTS.AUTH.OTPVERIFY(identifier, otp)),

  setpass: (identifier, newPassword) =>
    apiService.post(API_ENDPOINTS.AUTH.SETPASS(identifier, newPassword)),
};

export const branchService = {
  createBranch: (data) => apiService.post(API_ENDPOINTS.BRANCH.CREATE, data),

  getAllBranches: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.BRANCH.GET_ALL(page, size)),

  getBranchById: (id) => apiService.get(API_ENDPOINTS.BRANCH.GET_BY_ID(id)),

  updateBranch: (id, data) =>
    apiService.put(API_ENDPOINTS.BRANCH.UPDATE(id), data),

  deleteBranch: (id) => apiService.delete(API_ENDPOINTS.BRANCH.DELETE(id)),

  duplicatebranchcheack: (id) =>
    apiService.get(API_ENDPOINTS.BRANCH.BRANCH_DUPLICATION(id)),

  search: async ({
    branchCode,
    branchName,
    city,
    state,
    page = 0,
    size = 10,
  }) => {
    const searchURL = API_ENDPOINTS.BRANCH.SEARCH({
      branchCode,
      branchName,
      city,
      state,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const userService = {
  createUsers: (data) => apiService.post(API_ENDPOINTS.USER.CREATE, data),

  getAllUsers: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.USER.GET_ALL(page, size)), // Pass page & size

  getUserById: (id) => apiService.get(API_ENDPOINTS.USER.GET_BY_ID(id)),

  updateUser: (id, data) => apiService.put(API_ENDPOINTS.USER.UPDATE(id), data),

  deleteUser: (id) => apiService.delete(API_ENDPOINTS.USER.DELETE(id)),

  approveUser: (id) => apiService.put(API_ENDPOINTS.USER.APPROVE(id)),

  duplicateusercheck: (id) =>
    apiService.get(API_ENDPOINTS.USER.USER_DUPLICATION(id)),

  duplicateempcodecheck: (id) =>
    apiService.get(API_ENDPOINTS.USER.EPM_CODE_DUPLICATE(id)),

  unapproveUser: (data, page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.USER.UNAPPROVE(data, page, size)),

  getbranches: () => apiService.get(API_ENDPOINTS.BRANCH.GETBRANCH),

  search: async ({
    userName,
    employeeCode,
    workingBranchCode,
    page = 0,
    size = 10,
  }) => {
    const searchURL = API_ENDPOINTS.USER.SEARCH({
      userName,
      employeeCode,
      workingBranchCode,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const dashbard1 = {
  getAccOpened: () => apiService.get(API_ENDPOINTS.DASHBOARD.ACCOPENED),
  getAccClosed: () => apiService.get(API_ENDPOINTS.DASHBOARD.ACCCLOSED),
  getEmiDue: () => apiService.get(API_ENDPOINTS.DASHBOARD.EMIDUE),
  getLoanDisbursment: () =>
    apiService.get(API_ENDPOINTS.DASHBOARD.LOANDISBERSMENTINSIGHTS),
  getRepaymentsPrinciple: () =>
    apiService.get(API_ENDPOINTS.DASHBOARD.REPAYMENTSPRINCIPLE),
  getRepaymentsInterest: () =>
    apiService.get(API_ENDPOINTS.DASHBOARD.REPAYMENTSINTEREST),
  getOrament: () => apiService.get(API_ENDPOINTS.DASHBOARD.ORNAMENTS),
  getLoanSancioned: () =>
    apiService.get(API_ENDPOINTS.DASHBOARD.NEWLOANSANCTION),
  getEmiDueList: () => apiService.get(API_ENDPOINTS.DASHBOARD.EMIDUELIST),
  getLoanPotfolio: () => apiService.get(API_ENDPOINTS.DASHBOARD.LOANPOTFOLIO),
};

export const overdueDashboard = {
  getMaturityPattern: () =>
    apiService.get(API_ENDPOINTS.OVERDUEDASHBOARD.MATURITYPATTERN),
  getDisbursedAmountTrends: () =>
    apiService.get(API_ENDPOINTS.OVERDUEDASHBOARD.DISBURSEDAMOUNTTREND),
  getTotelPladge: () =>
    apiService.get(API_ENDPOINTS.OVERDUEDASHBOARD.TOTELPLLEDGE),
  getMonthlyNpaTrends: () =>
    apiService.get(API_ENDPOINTS.OVERDUEDASHBOARD.MONTHLYNPATRENDS),
  getDefaulterAndNpa: () =>
    apiService.get(API_ENDPOINTS.OVERDUEDASHBOARD.DEFAUULTERANDNPA),
  getOverdueLoans: () =>
    apiService.get(API_ENDPOINTS.OVERDUEDASHBOARD.OVERDUELOANS),
  getKilogramWaight: () =>
    apiService.get(API_ENDPOINTS.OVERDUEDASHBOARD.KILOGRAM),
};

export const stockApi = {
  createStock: (data) => apiService.post(API_ENDPOINTS.STOCK.CREATE, data),
  // getAllStock: (page = 0, size = 10) =>
  //   apiService.get(API_ENDPOINTS.STOCK.GETALLSTOCK(page, size)),
  getAllUnapproveStock: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.STOCK.UNAPPROVE(page, size)),
  getUserById: (id) => apiService.get(API_ENDPOINTS.STOCK.GET_BY_ID(id)),
  approveStock: (id) => apiService.put(API_ENDPOINTS.STOCK.APPROVE(id)),
  updateStock: (id, data) =>
    apiService.put(API_ENDPOINTS.STOCK.UPDATE(id), data),
  search: async ({ effectiveDate, page = 0, size = 10 }) => {
    const searchURL = API_ENDPOINTS.STOCK.SEARCH({
      effectiveDate,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const issue = {
  getFrom: () => apiService.get(API_ENDPOINTS.ISSUE.FETCHFROM),
  checkAvailibility: (data) =>
    apiService.post(API_ENDPOINTS.ISSUE.CHECKAVAILIBITY, data),
  createIssue: (data) => apiService.put(API_ENDPOINTS.ISSUE.CREATE, data),
  viewIssue: (id, id2, page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.ISSUE.VIEW(id, id2, page, size, 2)),
  search: async ({
    page = 0,
    size = 10,
    minPacketNo,
    maxPacketNo,
    effectiveDate,
  }) => {
    const searchURL = API_ENDPOINTS.ISSUE.SEARCH({
      page,
      size,
      minPacketNo,
      maxPacketNo,
      effectiveDate,
    });
    return apiService.get(searchURL);
  },
};

export const subloanDashboard = {
  getSummeryAcc: () => apiService.get(API_ENDPOINTS.SUBLOANDASHBOARD.SUMMERY),
  getOrnamentCount: () =>
    apiService.get(API_ENDPOINTS.SUBLOANDASHBOARD.ORNAMENTSCOUNT),
  getOrnamentWeight: () =>
    apiService.get(API_ENDPOINTS.SUBLOANDASHBOARD.WEIGHTOFGOLD),
  getAccNoList: (id) =>
    apiService.get(API_ENDPOINTS.SUBLOANDASHBOARD.GETACCNO(id)),
  accountWiseDetails: (accountNo) =>
    apiService.get(
      API_ENDPOINTS.SUBLOANDASHBOARD.ACCOUNTWISEDETAILS(accountNo)
    ),
};

export const bankService = {
  createBank: (data) => apiService.post(API_ENDPOINTS.BANK.CREATE, data),

  getAllBank: () => apiService.get(API_ENDPOINTS.BANK.GET_ALL),

  getBankById: (id) => apiService.get(API_ENDPOINTS.BANK.GET_BY_ID(id)),

  updateBank: (id, data) => apiService.put(API_ENDPOINTS.BANK.UPDATE(id), data),

  deleteBank: (id) => apiService.delete(API_ENDPOINTS.BANK.DELETE(id)),
};

export const ProductMasterService = {
  createProductMaster: (data) =>
    apiService.post(API_ENDPOINTS.PRODUCT.CREATE, data),

  getAllProductMaster: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.PRODUCT.GET_ALL(page, size)),

  // getBrowseProductMaster: () =>
  //   apiService.get(API_ENDPOINTS.PRODUCT.GET_BROWSE(id)),

  getProductMById: (id) => apiService.get(API_ENDPOINTS.PRODUCT.GET_BY_ID(id)),

  updateProductMaster: (id, data) =>
    apiService.put(API_ENDPOINTS.PRODUCT.UPDATE(id), data),

  deleteProductMaster: (id) =>
    apiService.delete(API_ENDPOINTS.PRODUCT.DELETE(id)),

  duplicateproductcheack: (id) =>
    apiService.get(API_ENDPOINTS.PRODUCT.PRODUCT_DUPLICATION_CHECK(id)),

  unapproveproduct: (data, page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.PRODUCT.UNAPPROVE(data, page, size)),

  approveproduct: (id) => apiService.put(API_ENDPOINTS.PRODUCT.APPROVE(id)),

  search: async ({
    productCode,
    productName,
    page = 0,
    size = 10,
    sortField,
    sortOrder,
  }) => {
    const searchURL = API_ENDPOINTS.PRODUCT.SEARCH({
      productCode,
      productName,
      page,
      size,
      sortField,
      sortOrder,
    });
    return apiService.get(searchURL);
  },
};
export const productInterestParamsService = {
  createproductInterestParams: (data) =>
    apiService.post(API_ENDPOINTS.PRODUCTINTEREST.CREATE, data),

  getAllproductInterestParams: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.PRODUCTINTEREST.GET_ALL(page, size)),

  getproductInterestParamsById: (branchcode, productcode) =>
    apiService.get(
      API_ENDPOINTS.PRODUCTINTEREST.GET_BY_ID(branchcode, productcode)
    ),

  duplicateCheckProductParams: (id1, id2) =>
    apiService.get(
      API_ENDPOINTS.PRODUCTINTEREST.PROD_PARAM_DUPLICATION_CHECK(id1, id2)
    ),

  updateproductInterestParams: (id1, id2, data) =>
    apiService.put(API_ENDPOINTS.PRODUCTINTEREST.UPDATE(id1, id2), data),

  unapproveproductInterestParams: (data, page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.PRODUCTINTEREST.UNAPPROVE(data, page, size)),

  approveproductInt: (id1, id2, data) =>
    apiService.put(API_ENDPOINTS.PRODUCTINTEREST.APPROVE(id1, id2), data),

  search: async ({
    branchCode,
    productCode,
    productName,
    page = 0,
    size = 10,
  }) => {
    const searchURL = API_ENDPOINTS.PRODUCTINTEREST.SEARCH({
      branchCode,
      productCode,
      productName,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const productInterestEntity = {
  createproductInterestEntity: (data) =>
    apiService.post(API_ENDPOINTS.PRODUCTINTERESTENTITY.CREATE, data),

  getAllproductInterestParams: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.PRODUCTINTERESTENTITY.GET_ALL(page, size)),

  getproductInterestParamsById: (productcode, effectiveDate) =>
    apiService.get(
      API_ENDPOINTS.PRODUCTINTERESTENTITY.GET_BY_ID(productcode, effectiveDate)
    ),

  updateproductInterestMasterParams: (productcode, effectiveDate, data) =>
    apiService.put(
      API_ENDPOINTS.PRODUCTINTERESTENTITY.INTEREST_UPDATE(
        productcode,
        effectiveDate
      ),
      data
    ),

  duplicateinterestcheack: (id1, id2) =>
    apiService.get(
      API_ENDPOINTS.PRODUCTINTERESTENTITY.INTEREST_DUPLICATION_CHECK(id1, id2)
    ),

  unapproveproductInterest: (data) =>
    apiService.get(API_ENDPOINTS.PRODUCTINTERESTENTITY.UNAPPROVE, data),
  search: async ({ productCode, effectiveDate, page = 0, size = 10 }) => {
    const searchURL = API_ENDPOINTS.PRODUCTINTERESTENTITY.SEARCH({
      productCode,
      effectiveDate,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const accountService = {
  getAccountNoformat: (productCode, effectiveDate, schemeCode) =>
    apiService.get(
      API_ENDPOINTS.ACCOUNT.ACCTNUMFORMAT(
        productCode,
        effectiveDate,
        schemeCode
      )
    ),

  existByAcctNo: (accountPrefix, accountNumber, edate) =>
    apiService.get(
      API_ENDPOINTS.ACCOUNT.EXISTBYACCTNO(accountPrefix, accountNumber, edate)
    ),

  createAccount: (data) => apiService.post(API_ENDPOINTS.ACCOUNT.CREATE, data),

  getAllAccounts: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.ACCOUNT.GET_ALL(page, size)),

  getAccountById: (id) => apiService.get(API_ENDPOINTS.ACCOUNT.GET_BY_ID(id)),

  updateAccount: (id, data) =>
    apiService.put(API_ENDPOINTS.ACCOUNT.UPDATE(id), data),

  deleteAccount: (id) => apiService.delete(API_ENDPOINTS.ACCOUNT.DELETE(id)),

  unapproveAccounts: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.ACCOUNT.UNAPPROVE(page, size)),

  approveAccount: (id) => apiService.put(API_ENDPOINTS.ACCOUNT.APPROVE(id)),

  closingbalance: (id) => apiService.get(API_ENDPOINTS.ACCOUNT.BALANCE(id)),

  search: async ({
    accountNo,
    customerNo,
    accountName,
    productCode,
    schemeCode,
    moduleTypes, // ✅ Add this
    page = 0,
    size = 10,
  }) => {
    const searchURL = API_ENDPOINTS.ACCOUNT.SEARCH({
      accountNo,
      customerNo,
      accountName,
      productCode,
      schemeCode,
      moduleTypes, // ✅ Pass it here too
      page,
      size,
    });
    return apiService.get(searchURL);
  },

  getPledged: (id) => apiService.get(API_ENDPOINTS.ACCOUNT.GETPLEDGED(id)),

  notmoduletypelist: (id) =>
    apiService.get(API_ENDPOINTS.ACCOUNT.ACCOUNT_NOT_MODULETYPE_LOOKUP(id)),

  moduletype: (id) =>
    apiService.get(API_ENDPOINTS.ACCOUNT.ACCOUNT_MODULETYPE(id)),
};

export const taxService = {
  createTaxMaster: (data) =>
    apiService.post(API_ENDPOINTS.TAX_MASTER.CREATE, data),

  getAllTaxMaster: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.TAX_MASTER.GET_ALL(page, size)),

  getTaxMasterById: (id, id1) =>
    apiService.get(API_ENDPOINTS.TAX_MASTER.GET_BY_ID(id, id1)),

  updateTaxMaster: (id, id1, data) =>
    apiService.put(API_ENDPOINTS.TAX_MASTER.UPDATE(id, id1), data),

  deleteTaxMaster: (id) =>
    apiService.delete(API_ENDPOINTS.TAX_MASTER.DELETE(id)),

  duplicatetax: (id1, id2) =>
    apiService.get(API_ENDPOINTS.TAX_MASTER.TAX_DUPLICATE(id1, id2)),

  search: async ({ taxType, description, page = 0, size = 10 }) => {
    const searchURL = API_ENDPOINTS.TAX_MASTER.SEARCH({
      taxType,
      description,
      page,
      size,
    });
    return apiService.get(searchURL);
  },

  listTaxMaster: () => apiService.get(API_ENDPOINTS.TAX_MASTER.GET),
};

export const rateService = {
  createrate: (data) => apiService.post(API_ENDPOINTS.RATE.CREATE, data),
  getAllrate: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.RATE.GET_ALL(page, size)),

  getrate: (id, id1, id2) =>
    apiService.get(API_ENDPOINTS.RATE.GET_BY_ID(id, id1, id2)),

  updaterate: (id, id1, id2, data) =>
    apiService.put(API_ENDPOINTS.RATE.UPDATE(id, id1, id2), data),

  deleterate: (id) => apiService.delete(API_ENDPOINTS.RATE.DELETE(id)),

  getRate: () => apiService.get(API_ENDPOINTS.RATE.GETRATE),

  duplicaterate: (id, id1, id2) =>
    apiService.get(API_ENDPOINTS.RATE.RATE_DUPLICATE(id, id1, id2)),

  search: async ({ schemeCode, effectiveDate, page = 0, size = 10 }) => {
    const searchURL = API_ENDPOINTS.RATE.SEARCH({
      schemeCode,
      effectiveDate,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const roleService = {
  createroles: (data) => apiService.post(API_ENDPOINTS.ROLE.CREATE, data),

  getAllroles: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.ROLE.GET_ALL(page, size)),

  getrolesById: (id) => apiService.get(API_ENDPOINTS.ROLE.GET_BY_ID(id)),

  updateroles: (id, data) =>
    apiService.put(API_ENDPOINTS.ROLE.UPDATE(id), data),

  deleteroles: (id) => apiService.delete(API_ENDPOINTS.ROLE.DELETE(id)),

  duplicaterolecheack: (role) =>
    apiService.get(API_ENDPOINTS.ROLE.ROLE_DUPLICATION(role)),

  search: async ({ role, description, page = 0, size = 10 }) => {
    const searchURL = API_ENDPOINTS.ROLE.SEARCH({
      role,
      description,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const chargesMasterService = {
  createChargesMaster: (data) =>
    apiService.post(API_ENDPOINTS.CHARGE_MASTER.CREATE, data),

  getAllChargesMaster: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.CHARGE_MASTER.GET_ALL(page, size)),

  getChargesMaster: (id, id1) =>
    apiService.get(API_ENDPOINTS.CHARGE_MASTER.GET_BY_ID(id, id1)),

  updateChargesMaster: (id, id1, data) =>
    apiService.put(API_ENDPOINTS.CHARGE_MASTER.UPDATE(id, id1), data),

  duplicatecharge: (id, id1) =>
    apiService.get(API_ENDPOINTS.CHARGE_MASTER.CHARGE_DUPLICATE(id, id1)),

  getTax: apiService.get(API_ENDPOINTS.CHARGE_MASTER.GETTAX),

  search: async ({
    branchCode,
    chargeCode,
    chargeDescription,
    page = 0,
    size = 10,
  }) => {
    const searchURL = API_ENDPOINTS.CHARGE_MASTER.SEARCH({
      branchCode,
      chargeCode,
      chargeDescription,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const customerService = {
  createCustomer: (data) =>
    apiService.post(API_ENDPOINTS.CUSTOMER.CREATE, data),

  getAllCustomers: () => apiService.get(API_ENDPOINTS.CUSTOMER.GET_ALL),

  getCustomerById: (id) => apiService.get(API_ENDPOINTS.CUSTOMER.GET_BY_ID(id)),

  updateCustomer: (id, data) =>
    apiService.put(API_ENDPOINTS.CUSTOMER.UPDATE(id), data),

  deleteCustomer: (id) => apiService.delete(API_ENDPOINTS.CUSTOMER.DELETE(id)),
};

export const daysService = {
  getAlldays: () => apiService.get(API_ENDPOINTS.DAY_PROCESS.GET_ALL),
  updatehandover: () => apiService.put(API_ENDPOINTS.DAY_PROCESS.UPDATE),
  createdaybegin: (data) =>
    apiService.post(API_ENDPOINTS.DAY_BEGIN.CREATE, data),
  createdayend: (data) => apiService.post(API_ENDPOINTS.DAY_END.CREATE, data),
  getDaysBegin: () => apiService.get(API_ENDPOINTS.DAY_BEGIN.GET),
  getDaysEnd: () => apiService.get(API_ENDPOINTS.DAY_END.GET),
};

export const activityService = {
  createactivity: (data) =>
    apiService.post(API_ENDPOINTS.ACTIVITY.CREATE, data),

  getAllactivity: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.ACTIVITY.GET_ALL(page, size)),

  getactivityById: (id) => apiService.get(API_ENDPOINTS.ACTIVITY.GET_BY_ID(id)),

  updateactivity: (id, data) =>
    apiService.put(API_ENDPOINTS.ACTIVITY.UPDATE(id), data),

  mainactivity: (data) =>
    apiService.get(API_ENDPOINTS.ACTIVITY.MAINACTIVITY, data),

  deleteactivity: (id) => apiService.delete(API_ENDPOINTS.ACTIVITY.DELETE(id)),

  duplicateactivitycheack: (role) =>
    apiService.get(API_ENDPOINTS.ACTIVITY.ACTIVITY_DUPLICATION(role)),

  search: async ({ activity, name, page = 0, size = 10 }) => {
    const searchURL = API_ENDPOINTS.ACTIVITY.SEARCH({
      activity,
      name,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const cbsService = {
  getcbs: (id) => apiService.get(API_ENDPOINTS.CBS.GET_ALL(id)),
  getall: (data) => apiService.postMultipart(API_ENDPOINTS.CBS.PREVIEW, data),
  excelsave: (id, id1, data) =>
    apiService.post(API_ENDPOINTS.CBS.SAVE(id, id1), data),
  search: async ({ accountNo, excelFileName, page = 0, size = 10 }) => {
    const searchURL = API_ENDPOINTS.CBS.SEARCH({
      accountNo,
      excelFileName,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
  fetchexcel: (id, id1) => apiService.get(API_ENDPOINTS.CBS.FETCH(id, id1)),

  unapproveexceldata: (
    data,
    page = 0,
    size = 10,
    sortField = "uploadDate",
    sortOrder = "asc"
  ) =>
    apiService.get(
      API_ENDPOINTS.CBS.UNAPPROVE(data, page, size, sortField, sortOrder)
    ),

  approveexcel: (id, data) =>
    apiService.post(API_ENDPOINTS.CBS.Approve(id), data),
};

export const roleaccessService = {
  createroleaccess: (data) =>
    apiService.post(API_ENDPOINTS.ROLEACCESS.CREATE, data),

  getAllroleaccess: (id) =>
    apiService.get(API_ENDPOINTS.ROLEACCESS.GET_ALL(id)),

  getroleaccessById: (id) =>
    apiService.get(API_ENDPOINTS.ROLEACCESS.GET_BY_ID(id)),

  updateroleaccess: (id, data) =>
    apiService.put(API_ENDPOINTS.ROLEACCESS.UPDATE(id), data),

  deleteroleaccess: (id) =>
    apiService.delete(API_ENDPOINTS.ROLEACCESS.DELETE(id)),

  duplicateroleaccesscheack: (role) =>
    apiService.get(API_ENDPOINTS.ROLEACCESS.ROLEACCESS_DUPLICATION(role)),

  search: async ({ roleCode, page = 0, size = 10 }) => {
    const searchURL = API_ENDPOINTS.ROLEACCESS.SEARCH({
      roleCode,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};
export const lookupService = {
  roletypelist: () => apiService.get("/loan/roles/list"),
  activitylist: (id) =>
    apiService.get(`/loan/role-access/missing-activities/${id}`),
};

export const goaldapplication = {};

export const lookupsServices = {
  moduletypelist: (id) =>
    apiService.get(API_ENDPOINTS.LOOKUPS_SERVICE.PRODUCT_MODULETYPE_LOOKUP(id)),
  notmoduletypelist: (id) =>
    apiService.get(
      API_ENDPOINTS.LOOKUPS_SERVICE.PRODUCT_NOT_MODULETYPE_LOOKUP(id)
    ),
  chargelist: (id) => apiService.get(`/loan/charges-details/list/${id}`),
  schemeDetailsArray: (id1, id2) =>
    apiService.get(API_ENDPOINTS.LOOKUPS_SERVICE.SCHEME_BY_PRODUCT(id1, id2)),

  customerDetailsArray: (id) =>
    apiService.get(API_ENDPOINTS.LOOKUPS_SERVICE.CUSTOMER_BROWSE(id)),
  getInterestRate: (productCode, periodMonth, periodDay, effectiveDate) =>
    apiService.get(
      API_ENDPOINTS.LOOKUPS_SERVICE.INTEREST_RATE(
        productCode,
        periodMonth,
        periodDay,
        effectiveDate
      )
    ),
  getRatePerGram: (schemeCode, effectiveDate, itemnature) =>
    apiService.get(
      API_ENDPOINTS.LOOKUPS_SERVICE.RATE_PRE_GRAM(
        schemeCode,
        effectiveDate,
        itemnature
      )
    ),
};
export const lookuppServices = {
  chargelist: () => apiService.get(API_ENDPOINTS.LOOKUPS_CHARGE.CHARGE_LOOKUP),
};

export const customerCreation = {
  createCustomer: (data) =>
    apiService.post(API_ENDPOINTS.CUSTOMER_CREATION.CREATE, data),

  getAllCustomers: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.CUSTOMER_CREATION.GET_ALL(page, size)),

  getCustomerById: (id) =>
    apiService.get(API_ENDPOINTS.CUSTOMER_CREATION.GET_BY_ID(id)),

  updateCustomer: (id, data) =>
    apiService.put(API_ENDPOINTS.CUSTOMER_CREATION.UPDATE(id), data),

  deleteCustomer: (id) =>
    apiService.delete(API_ENDPOINTS.CUSTOMER_CREATION.DELETE(id)),

  unapproveCustCreation: (data, page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.CUSTOMER_CREATION.UNAPPROVE(data, page, size)),

  approveCustomer: (id) =>
    apiService.put(API_ENDPOINTS.CUSTOMER_CREATION.Approve(id)),

  getPledged: (id) =>
    apiService.get(API_ENDPOINTS.CUSTOMER_CREATION.GETPLEDGED(id)),

  listofcust: () => apiService.get(API_ENDPOINTS.CUSTOMER.List),

  search: async ({
    customerNo,
    fullName,
    mobileNo,
    panNo,
    aadharNo,
    page = 0,
    size = 10,
  }) => {
    const searchURL = API_ENDPOINTS.CUSTOMER_CREATION.SEARCH({
      customerNo,
      fullName,
      mobileNo,
      panNo,
      aadharNo,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const schemeService = {
  createScheme: (data) => apiService.post(API_ENDPOINTS.SCHEME.CREATE, data),

  getAllScheme: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.SCHEME.GET_ALL(page, size)),

  getSchemeById: (id) => apiService.get(API_ENDPOINTS.SCHEME.GET_BY_ID(id)),

  updateScheme: (id, data) =>
    apiService.put(API_ENDPOINTS.SCHEME.UPDATE(id), data),

  deleteScheme: (id) => apiService.delete(API_ENDPOINTS.SCHEME.DELETE(id)),

  duplicateSchemecheack: (role) =>
    apiService.get(API_ENDPOINTS.SCHEME.SCHEME_DUPLICATION(role)),

  search: async ({
    schemeCode,
    schemeName,
    effectiveDate,
    page = 0,
    size = 10,
  }) => {
    const searchURL = API_ENDPOINTS.SCHEME.SEARCH({
      schemeCode,
      schemeName,
      effectiveDate,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const loanApplicationService = {
  createLoanApplication: (data) =>
    apiService.post(API_ENDPOINTS.LOAN_APPLICATION.CREATE, data),

  updateLoanApplication: (data) =>
    apiService.put(API_ENDPOINTS.LOAN_APPLICATION.UPDATE, data),

  getAllApplications: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.LOAN_APPLICATION.GET_ALL(page, size)),

  getApplicaionById: (id) =>
    apiService.get(API_ENDPOINTS.LOAN_APPLICATION.GET_BY_ID(id)),

  updateLoan: (data) =>
    apiService.get(API_ENDPOINTS.LOAN_APPLICATION.CREATE, data),

  unapproveLoanApplication: (data, page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.LOAN_APPLICATION.UNAPPROVE(data, page, size)),

  getApplicaionById: (id) =>
    apiService.get(API_ENDPOINTS.LOAN_APPLICATION.GET_BY_ID(id)),

  approveloan: (id) =>
    apiService.post(API_ENDPOINTS.LOAN_APPLICATION.Approve(id)),

  search: async ({
    applicationNo,
    customerNo,
    customerName,
    productCode,
    schemeCode,
    page = 0,
    size = 10,
  }) => {
    const searchURL = API_ENDPOINTS.LOAN_APPLICATION.SEARCH({
      applicationNo,
      customerNo,
      customerName,
      productCode,
      schemeCode,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const transactionService = {
  getdayendcheck: () =>
    apiService.get(API_ENDPOINTS.TRANSACTION_PROCESS.DAY_END_CHECK),
  getaccountlist: () =>
    apiService.get(API_ENDPOINTS.TRANSACTION_PROCESS.ACCOUNTS_NUMEBR_LIST),

  createtransactionview: (data) =>
    apiService.post(API_ENDPOINTS.TRANSACTION_PROCESS.CREATEVIEW, data),

  createtransactionprocess: (data) =>
    apiService.post(API_ENDPOINTS.TRANSACTION_PROCESS.CREATEPROCESS, data),

  validateTransaction: (activity, acctno) =>
    apiService.get(
      API_ENDPOINTS.TRANSACTION_PROCESS.VALIDATESERVICE(activity, acctno)
    ),

  getAllTransfer: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.TRANSACTION_PROCESS.GET_ALL(page, size)),

  getTransferDetail: (txnNo, entryDate, batchCode) =>
    apiService.get(
      API_ENDPOINTS.TRANSACTION_PROCESS.GETDETAILSTRANSFER(
        txnNo,
        entryDate,
        batchCode
      )
    ),

  approveTransafer: (txnNo, entryDate, batchCode, branchCode) =>
    apiService.put(
      API_ENDPOINTS.TRANSACTION_PROCESS.APPROVE_TRANSFER(
        txnNo,
        entryDate,
        batchCode,
        branchCode
      )
    ),

  cancelTransafer: (txnNo, entryDate, batchCode, branchCode, data) =>
    apiService.put(
      API_ENDPOINTS.TRANSACTION_PROCESS.CANCEL_TRANSFER(
        txnNo,
        entryDate,
        batchCode,
        branchCode,
        data
      )
    ),

  addMoreTransafer: (txnNo, branchCode, entryDate, batchCode) =>
    apiService.get(
      API_ENDPOINTS.TRANSACTION_PROCESS.Add_MORE_TRANSACTION(
        txnNo,
        branchCode,
        entryDate,
        batchCode
      )
    ),

  unapproveTransaction: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.TRANSACTION_PROCESS.UNAPPROVE(page, size)),

  search: async ({
    branchCode,
    entryDate,
    txnNo,
    accountNo,
    page = 0,
    size = 10,
  }) => {
    const searchURL = API_ENDPOINTS.TRANSACTION_PROCESS.SEARCH({
      branchCode,
      entryDate,
      txnNo,
      accountNo,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
  packetamount: (id, id1) =>
    apiService.get(API_ENDPOINTS.TRANSACTION_PROCESS.PACKET_AMOUNT(id, id1)),
};
// CANCEL_TRANSFER
export const logout = {
  logout: () => apiService.post(API_ENDPOINTS.AUTH.LOGOUT),
};
export const licence = {
  licence: (data) => apiService.post(API_ENDPOINTS.LICENCE.CREATE, data),
};
export const lookupMasterService = {
  createLookupMaster: (data) =>
    apiService.post(API_ENDPOINTS.LOOKUPS.CREATE, data),
  getAllLookupMaster: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.LOOKUPS.GET_ALL(page, size)),
  getLookupMasterById: (id) =>
    apiService.get(API_ENDPOINTS.LOOKUPS.GET_BY_ID(id)),
  updateLookupMaster: (id, data) =>
    apiService.put(API_ENDPOINTS.LOOKUPS.UPDATE(id), data),
  search: async ({ codeType, codeDesc, page = 0, size = 10 }) => {
    const searchURL = API_ENDPOINTS.LOOKUPS.SEARCH({
      codeType,
      codeDesc,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const lookUp = {
  lookUp: (id) => apiService.post(API_ENDPOINTS.LOOKUPS.GET, id),
  duplicatecodetypecheack: (codeType) =>
    apiService.get(API_ENDPOINTS.LOOKUPS.LOOKUP_DUPLICATION(codeType)),

  lookUp: (id, id2) => apiService.get(API_ENDPOINTS.PINCODE.GET(id, id2)),
  getCountries: () => apiService.get(API_ENDPOINTS.PINCODE.GET_COUNTRI),
  getPincodes: (id, id2) =>
    apiService.get(API_ENDPOINTS.PINCODE.GET_PINCODE(id, id2)),
};

export const exceptionpMasterService = {
  createExceptionMaster: (data) =>
    apiService.post(API_ENDPOINTS.EXCEPTION.CREATE, data),
  getAllExceptionMaster: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.EXCEPTION.GET_ALL(page, size)),
  getExceptionMasterById: (id, id1) =>
    apiService.get(API_ENDPOINTS.EXCEPTION.GET_BY_ID(id, id1)),
  updateExceptionMaster: (id, id1, data) =>
    apiService.put(API_ENDPOINTS.EXCEPTION.UPDATE(id, id1), data),
  search: async ({ role, exceptionCode, page = 0, size = 10 }) => {
    const searchURL = API_ENDPOINTS.EXCEPTION.SEARCH({
      role,
      exceptionCode,
      page,
      size,
    });
    return apiService.get(searchURL);
  },
};

export const interestCalculation = {
  creteInterestcalculation: (date, mode, data) =>
    apiService.post(API_ENDPOINTS.INTERESTCALCULATION.CREATE(date, mode, data)),
};

export const balanceSheet = {
  getbalance: (id, id1) =>
    apiService.get(API_ENDPOINTS.BALANCESHEET.GET(id, id1)),
  getInterest: (id, id1, id2) =>
    apiService.get(API_ENDPOINTS.BALANCESHEET.GETINTEREST(id, id1, id2)),
  getOverdue: (id, id1, id2) =>
    apiService.get(API_ENDPOINTS.BALANCESHEET.GETOVERDUE(id, id1, id2)),

  getJotting: (productCode, status, toDate, page = 0, size = 10) =>
    apiService.get(
      API_ENDPOINTS.BALANCESHEET.GETJOTTING(
        productCode,
        status,
        toDate,
        page,
        size
      )
    ),
  getJottingR: (productCode, status, toDate) =>
    apiService.get(
      API_ENDPOINTS.BALANCESHEET.GETJOTTINGR(productCode, status, toDate)
    ),
  getStatement: (id, id1, id2) =>
    apiService.get(API_ENDPOINTS.BALANCESHEET.GETSTATEMENT(id, id1, id2)),
  getSocLoan: (data, page = 0, size = 10) =>
    apiService.post(API_ENDPOINTS.BALANCESHEET.SOCLOAN(page, size), data),
};

export const pincodeService = {};

export const topupPartrelese = {
  createTopupPartrelese: (data) =>
    apiService.post(API_ENDPOINTS.TOPUPPARTRELESE.CREATE, data),
};
