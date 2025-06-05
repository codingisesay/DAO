import { daoApi } from "../utils/storage";
import { API_ENDPOINTS } from "./api";


export const agentService = {
  agentEnroll: (data) =>
    daoApi.post(API_ENDPOINTS.AGENT.AGENTENROLL, data)
}

export const personalDetailsService = {
  create: (data) => daoApi.post(API_ENDPOINTS.PERSONAL_DETAILS.CREATE, data),
  // update: (id, data) => daoApi.put(API_ENDPOINTS.PERSONAL_DETAILS.UPDATE(id), data),
};

export const addressDetailsService = {
  create: (data) => daoApi.post(API_ENDPOINTS.ADDRESS_DETAILS.CREATE, data),
  // update: (id, data) => daoApi.put(API_ENDPOINTS.ADDRESS_DETAILS.UPDATE(id), data),
};

export const livePhotoService = {
  upload: (formData) =>
    daoApi.post(API_ENDPOINTS.LIVE_PHOTO.CREATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const agentlivephotoSave = {
  upload: (formData) =>
    daoApi.post(API_ENDPOINTS.AGENT_LIVE_PHOTO.CREATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};


export const applicationDocumentService = {
  upload: (formData) =>
    daoApi.post(API_ENDPOINTS.APPLICATION_DOCUMENT.CREATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const accountPersonalDetailsService = {
  create: (data) => daoApi.post(API_ENDPOINTS.ACCOUNT_PERSONAL_DETAILS.CREATE, data),
};

export const accountNomineeService = {
  create: (data) => daoApi.post(API_ENDPOINTS.ACCOUNT_NOMINEE.CREATE, data),
};

export const serviceToCustomerService = {
  create: (data) => daoApi.post(API_ENDPOINTS.SERVICE_TO_CUSTOMER.CREATE, data),
};

export const applicationDetailsService = {
  getFullDetails: (id) =>
    daoApi.get(`/api/agent/full-application-details/${id}`),
};

export const applicationDetailsServices = {
  getByAadhar: (auth_code) =>
    daoApi.post('/api/application/by-aadhar', { auth_code }),
  // ...other methods
};

export const accountsStatusListService = {
  getList: () =>
    daoApi.get(API_ENDPOINTS.ACCOUNTS_STATUS_LIST.GET_LIST),
};










// om data below
export const adminService = {
  getAllApplications: () =>
    daoApi.get(API_ENDPOINTS.ADMIN.GET_ALL_APPLICATIONS),
  getAllApplicationsPending: () =>
    daoApi.get(API_ENDPOINTS.ADMIN.GET_ALL_PENDING_APPLICATIONS),
  getAllApllicationsRejected: () =>
    daoApi.get(API_ENDPOINTS.ADMIN.GET_ALL_APPLICATIONS_REJECTED),

  updateApplicationStatus: (id, status) =>
    daoApi.post(API_ENDPOINTS.ADMIN.UPDATE_APPLICATION_STATUS, { id, status }),
  updatePersonalDetailsStatus: (id, status) =>
    daoApi.post(API_ENDPOINTS.ADMIN.UPDATE_PERSONAL_DETAILS_STATUS, { id, status }),
  updateDocumentsStatus: (id, status) =>
    daoApi.post(API_ENDPOINTS.ADMIN.UPDATE_DOCUMENTS_STATUS, { id, status }),
  updateAddressDetailsStatus: (id, status) =>
    daoApi.post(API_ENDPOINTS.ADMIN.UPDATE_ADDRESS_DETAILS_STATUS, { id, status }),
  updateLivePhotosStatus: (id, status) =>
    daoApi.post(API_ENDPOINTS.ADMIN.UPDATE_LIVE_PHOTOS_STATUS, { id, status }),
  updateAccountPersonalDetailsStatus: (id, status) =>
    daoApi.post(API_ENDPOINTS.ADMIN.UPDATE_ACCOUNT_PERSONAL_DETAILS_STATUS, { id, status }),
  updateNomineesStatus: (id, status) =>
    daoApi.post(API_ENDPOINTS.ADMIN.UPDATE_NOMINEES_STATUS, { id, status }),
  // Clicking on the view button in the admin dashboard
  getFullApplicationDetails: (id) =>
    daoApi.get(API_ENDPOINTS.ADMIN.GET_FULL_APPLICATION_DETAILS(id)),

};
// om data above












export const forgotpass = {
  forgotPass: (identifier) =>
    daoApi.post(API_ENDPOINTS.AUTH.FORGOTPASS(identifier)),

  otpverify: (identifier, otp) =>
    daoApi.post(API_ENDPOINTS.AUTH.OTPVERIFY(identifier, otp)),

  setpass: (identifier, newPassword) =>
    daoApi.post(API_ENDPOINTS.AUTH.SETPASS(identifier, newPassword)),
};

export const branchService = {
  createBranch: (data) => daoApi.post(API_ENDPOINTS.BRANCH.CREATE, data),

  getAllBranches: (page = 0, size = 10) =>
    daoApi.get(API_ENDPOINTS.BRANCH.GET_ALL(page, size)),

  getBranchById: (id) => daoApi.get(API_ENDPOINTS.BRANCH.GET_BY_ID(id)),

  updateBranch: (id, data) =>
    daoApi.put(API_ENDPOINTS.BRANCH.UPDATE(id), data),

  deleteBranch: (id) => daoApi.delete(API_ENDPOINTS.BRANCH.DELETE(id)),

  duplicatebranchcheack: (id) =>
    daoApi.get(API_ENDPOINTS.BRANCH.BRANCH_DUPLICATION(id)),

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
    return daoApi.get(searchURL);
  },
};

export const userService = {
  createUsers: (data) => daoApi.post(API_ENDPOINTS.USER.CREATE, data),

  getAllUsers: (page = 0, size = 10) =>
    daoApi.get(API_ENDPOINTS.USER.GET_ALL(page, size)), // Pass page & size

  getUserById: (id) => daoApi.get(API_ENDPOINTS.USER.GET_BY_ID(id)),

  updateUser: (id, data) => daoApi.put(API_ENDPOINTS.USER.UPDATE(id), data),

  deleteUser: (id) => daoApi.delete(API_ENDPOINTS.USER.DELETE(id)),

  approveUser: (id) => daoApi.put(API_ENDPOINTS.USER.APPROVE(id)),

  duplicateusercheck: (id) =>
    daoApi.get(API_ENDPOINTS.USER.USER_DUPLICATION(id)),

  duplicateempcodecheck: (id) =>
    daoApi.get(API_ENDPOINTS.USER.EPM_CODE_DUPLICATE(id)),

  unapproveUser: (data, page = 0, size = 10) =>
    daoApi.get(API_ENDPOINTS.USER.UNAPPROVE(data, page, size)),

  getbranches: () => daoApi.get(API_ENDPOINTS.BRANCH.GETBRANCH),

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
    return daoApi.get(searchURL);
  },
};

export const dashbard1 = {
  getAccOpened: () => daoApi.get(API_ENDPOINTS.DASHBOARD.ACCOPENED),
  getAccClosed: () => daoApi.get(API_ENDPOINTS.DASHBOARD.ACCCLOSED),
  getEmiDue: () => daoApi.get(API_ENDPOINTS.DASHBOARD.EMIDUE),
  getLoanDisbursment: () =>
    daoApi.get(API_ENDPOINTS.DASHBOARD.LOANDISBERSMENTINSIGHTS),
  getRepaymentsPrinciple: () =>
    daoApi.get(API_ENDPOINTS.DASHBOARD.REPAYMENTSPRINCIPLE),
  getRepaymentsInterest: () =>
    daoApi.get(API_ENDPOINTS.DASHBOARD.REPAYMENTSINTEREST),
  getOrament: () => daoApi.get(API_ENDPOINTS.DASHBOARD.ORNAMENTS),
  getLoanSancioned: () =>
    daoApi.get(API_ENDPOINTS.DASHBOARD.NEWLOANSANCTION),
  getEmiDueList: () => daoApi.get(API_ENDPOINTS.DASHBOARD.EMIDUELIST),
  getLoanPotfolio: () => daoApi.get(API_ENDPOINTS.DASHBOARD.LOANPOTFOLIO),
};

export const overdueDashboard = {
  getMaturityPattern: () =>
    daoApi.get(API_ENDPOINTS.OVERDUEDASHBOARD.MATURITYPATTERN),
  getDisbursedAmountTrends: () =>
    daoApi.get(API_ENDPOINTS.OVERDUEDASHBOARD.DISBURSEDAMOUNTTREND),
  getTotelPladge: () =>
    daoApi.get(API_ENDPOINTS.OVERDUEDASHBOARD.TOTELPLLEDGE),
  getMonthlyNpaTrends: () =>
    daoApi.get(API_ENDPOINTS.OVERDUEDASHBOARD.MONTHLYNPATRENDS),
  getDefaulterAndNpa: () =>
    daoApi.get(API_ENDPOINTS.OVERDUEDASHBOARD.DEFAUULTERANDNPA),
  getOverdueLoans: () =>
    daoApi.get(API_ENDPOINTS.OVERDUEDASHBOARD.OVERDUELOANS),
  getKilogramWaight: () =>
    daoApi.get(API_ENDPOINTS.OVERDUEDASHBOARD.KILOGRAM),
};

export const stockApi = {
  createStock: (data) => daoApi.post(API_ENDPOINTS.STOCK.CREATE, data),
  // getAllStock: (page = 0, size = 10) =>
  //   daoApi.get(API_ENDPOINTS.STOCK.GETALLSTOCK(page, size)),
  getAllUnapproveStock: (page = 0, size = 10) =>
    daoApi.get(API_ENDPOINTS.STOCK.UNAPPROVE(page, size)),
  getUserById: (id) => daoApi.get(API_ENDPOINTS.STOCK.GET_BY_ID(id)),
  approveStock: (id) => daoApi.put(API_ENDPOINTS.STOCK.APPROVE(id)),
  updateStock: (id, data) =>
    daoApi.put(API_ENDPOINTS.STOCK.UPDATE(id), data),
  search: async ({ effectiveDate, page = 0, size = 10 }) => {
    const searchURL = API_ENDPOINTS.STOCK.SEARCH({
      effectiveDate,
      page,
      size,
    });
    return daoApi.get(searchURL);
  },
};

export const issue = {
  getFrom: () => daoApi.get(API_ENDPOINTS.ISSUE.FETCHFROM),
  checkAvailibility: (data) =>
    daoApi.post(API_ENDPOINTS.ISSUE.CHECKAVAILIBITY, data),
  createIssue: (data) => daoApi.put(API_ENDPOINTS.ISSUE.CREATE, data),
  viewIssue: (id, id2, page = 0, size = 10) =>
    daoApi.get(API_ENDPOINTS.ISSUE.VIEW(id, id2, page, size, 2)),
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
    return daoApi.get(searchURL);
  },
};

export const subloanDashboard = {
  getSummeryAcc: () => daoApi.get(API_ENDPOINTS.SUBLOANDASHBOARD.SUMMERY),
  getOrnamentCount: () =>
    daoApi.get(API_ENDPOINTS.SUBLOANDASHBOARD.ORNAMENTSCOUNT),
  getOrnamentWeight: () =>
    daoApi.get(API_ENDPOINTS.SUBLOANDASHBOARD.WEIGHTOFGOLD),
  getAccNoList: (id) =>
    daoApi.get(API_ENDPOINTS.SUBLOANDASHBOARD.GETACCNO(id)),
  accountWiseDetails: (accountNo) =>
    daoApi.get(
      API_ENDPOINTS.SUBLOANDASHBOARD.ACCOUNTWISEDETAILS(accountNo)
    ),
};

export const bankService = {
  createBank: (data) => daoApi.post(API_ENDPOINTS.BANK.CREATE, data),

  getAllBank: () => daoApi.get(API_ENDPOINTS.BANK.GET_ALL),

  getBankById: (id) => daoApi.get(API_ENDPOINTS.BANK.GET_BY_ID(id)),

  updateBank: (id, data) => daoApi.put(API_ENDPOINTS.BANK.UPDATE(id), data),

  deleteBank: (id) => daoApi.delete(API_ENDPOINTS.BANK.DELETE(id)),
};

export const ProductMasterService = {
  createProductMaster: (data) =>
    daoApi.post(API_ENDPOINTS.PRODUCT.CREATE, data),

  getAllProductMaster: (page = 0, size = 10) =>
    daoApi.get(API_ENDPOINTS.PRODUCT.GET_ALL(page, size)),

  // getBrowseProductMaster: () =>
  //   daoApi.get(API_ENDPOINTS.PRODUCT.GET_BROWSE(id)),

  getProductMById: (id) => daoApi.get(API_ENDPOINTS.PRODUCT.GET_BY_ID(id)),

  updateProductMaster: (id, data) =>
    daoApi.put(API_ENDPOINTS.PRODUCT.UPDATE(id), data),

  deleteProductMaster: (id) =>
    daoApi.delete(API_ENDPOINTS.PRODUCT.DELETE(id)),

  duplicateproductcheack: (id) =>
    daoApi.get(API_ENDPOINTS.PRODUCT.PRODUCT_DUPLICATION_CHECK(id)),

  unapproveproduct: (data, page = 0, size = 10) =>
    daoApi.get(API_ENDPOINTS.PRODUCT.UNAPPROVE(data, page, size)),

  approveproduct: (id) => daoApi.put(API_ENDPOINTS.PRODUCT.APPROVE(id)),

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
    return daoApi.get(searchURL);
  },
};
export const productInterestParamsService = {
  createproductInterestParams: (data) =>
    daoApi.post(API_ENDPOINTS.PRODUCTINTEREST.CREATE, data),

  getAllproductInterestParams: (page = 0, size = 10) =>
    daoApi.get(API_ENDPOINTS.PRODUCTINTEREST.GET_ALL(page, size)),

  getproductInterestParamsById: (branchcode, productcode) =>
    daoApi.get(
      API_ENDPOINTS.PRODUCTINTEREST.GET_BY_ID(branchcode, productcode)
    ),

  duplicateCheckProductParams: (id1, id2) =>
    daoApi.get(
      API_ENDPOINTS.PRODUCTINTEREST.PROD_PARAM_DUPLICATION_CHECK(id1, id2)
    ),

  updateproductInterestParams: (id1, id2, data) =>
    daoApi.put(API_ENDPOINTS.PRODUCTINTEREST.UPDATE(id1, id2), data),

  unapproveproductInterestParams: (data, page = 0, size = 10) =>
    daoApi.get(API_ENDPOINTS.PRODUCTINTEREST.UNAPPROVE(data, page, size)),

  approveproductInt: (id1, id2, data) =>
    daoApi.put(API_ENDPOINTS.PRODUCTINTEREST.APPROVE(id1, id2), data),

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
    return daoApi.get(searchURL);
  },
};

export const productInterestEntity = {
  createproductInterestEntity: (data) =>
    daoApi.post(API_ENDPOINTS.PRODUCTINTERESTENTITY.CREATE, data),

  getAllproductInterestParams: (page = 0, size = 10) =>
    daoApi.get(API_ENDPOINTS.PRODUCTINTERESTENTITY.GET_ALL(page, size)),

  getproductInterestParamsById: (productcode, effectiveDate) =>
    daoApi.get(
      API_ENDPOINTS.PRODUCTINTERESTENTITY.GET_BY_ID(productcode, effectiveDate)
    ),

  updateproductInterestMasterParams: (productcode, effectiveDate, data) =>
    daoApi.put(
      API_ENDPOINTS.PRODUCTINTERESTENTITY.INTEREST_UPDATE(
        productcode,
        effectiveDate
      ),
      data
    ),

  duplicateinterestcheack: (id1, id2) =>
    daoApi.get(
      API_ENDPOINTS.PRODUCTINTERESTENTITY.INTEREST_DUPLICATION_CHECK(id1, id2)
    ),

  unapproveproductInterest: (data) =>
    daoApi.get(API_ENDPOINTS.PRODUCTINTERESTENTITY.UNAPPROVE, data),
  search: async ({ productCode, effectiveDate, page = 0, size = 10 }) => {
    const searchURL = API_ENDPOINTS.PRODUCTINTERESTENTITY.SEARCH({
      productCode,
      effectiveDate,
      page,
      size,
    });
    return daoApi.get(searchURL);
  },
};

export const accountService = {
  getAccountNoformat: (productCode, effectiveDate, schemeCode) =>
    daoApi.get(
      API_ENDPOINTS.ACCOUNT.ACCTNUMFORMAT(
        productCode,
        effectiveDate,
        schemeCode
      )
    ),

  existByAcctNo: (accountPrefix, accountNumber, edate) =>
    daoApi.get(
      API_ENDPOINTS.ACCOUNT.EXISTBYACCTNO(accountPrefix, accountNumber, edate)
    ),

  createAccount: (data) => daoApi.post(API_ENDPOINTS.ACCOUNT.CREATE, data),

  getAllAccounts: (page = 0, size = 10) =>
    daoApi.get(API_ENDPOINTS.ACCOUNT.GET_ALL(page, size)),

  getAccountById: (id) => daoApi.get(API_ENDPOINTS.ACCOUNT.GET_BY_ID(id)),

  updateAccount: (id, data) =>
    daoApi.put(API_ENDPOINTS.ACCOUNT.UPDATE(id), data),

  deleteAccount: (id) => daoApi.delete(API_ENDPOINTS.ACCOUNT.DELETE(id)),

  unapproveAccounts: (page = 0, size = 10) =>
    daoApi.get(API_ENDPOINTS.ACCOUNT.UNAPPROVE(page, size)),

  approveAccount: (id) => daoApi.put(API_ENDPOINTS.ACCOUNT.APPROVE(id)),

  closingbalance: (id) => daoApi.get(API_ENDPOINTS.ACCOUNT.BALANCE(id)),

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
    return daoApi.get(searchURL);
  },

  getPledged: (id) => daoApi.get(API_ENDPOINTS.ACCOUNT.GETPLEDGED(id)),

  notmoduletypelist: (id) =>
    daoApi.get(API_ENDPOINTS.ACCOUNT.ACCOUNT_NOT_MODULETYPE_LOOKUP(id)),

  moduletype: (id) =>
    daoApi.get(API_ENDPOINTS.ACCOUNT.ACCOUNT_MODULETYPE(id)),
}; 