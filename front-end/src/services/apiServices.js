import api, { apiService } from "../utils/storage";
import { API_ENDPOINTS } from "./api";



export const createAccountService = {
  enrollment_s1: (data) => apiService.post(API_ENDPOINTS.CREATE_ACCOUNT.ENROLLMENT_S1, data),
  personalDetails_s2a: (data) => apiService.post(API_ENDPOINTS.CREATE_ACCOUNT.PERSONAL_DETAILS_S2A, data),
  addressDetails_s2b: (data) => apiService.post(API_ENDPOINTS.CREATE_ACCOUNT.ADDRESS_DETAILS_S2B, data),
  livePhoto_s2c: (formData) =>
    apiService.post(API_ENDPOINTS.CREATE_ACCOUNT.LIVE_PHOTO_S2C, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  applicationDocument_s3: (formData) =>
    apiService.post(API_ENDPOINTS.CREATE_ACCOUNT.APPLICATION_DOCUMENT_S3, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  accountPersonalDetails_s5a: (data) =>
    apiService.post(API_ENDPOINTS.CREATE_ACCOUNT.ACCOUNT_PERSONAL_DETAILS_S5A, data),
  accountNominee_s5b: (data) =>
    apiService.post(API_ENDPOINTS.CREATE_ACCOUNT.ACCOUNT_NOMINEE_S5B, data),
  serviceToCustomer_s5c: (data) =>
    apiService.post(API_ENDPOINTS.CREATE_ACCOUNT.SERVICE_TO_CUSTOMER_S5C, data),
  agentLivePhoto_s6b: (formData) =>
    apiService.post(API_ENDPOINTS.CREATE_ACCOUNT.AGENT_LIVE_PHOTO_S6B, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getBankingFacilitiesService: () =>
    apiService.get(API_ENDPOINTS.CREATE_ACCOUNT.GET_BANKING_FACILITIES_SERVICE),
}

export const agentService = {
  agentEnroll: (data) =>
    apiService.post(API_ENDPOINTS.AGENT.AGENTENROLL, data),
  // applications for the agent
  getFullApplicationsByAgent: (agentId) =>
    apiService.get(API_ENDPOINTS.AGENT.GET_FULL_APPLICATIONS_BY_AGENT(agentId)),


  applicationcountbyagent: (id) =>
    apiService.get(API_ENDPOINTS.AGENT.GET_APPLICATION_COUNT(id)),
  kycapplicationstatus: (id) =>  
    apiService.get(API_ENDPOINTS.AGENT.KYC_APPLICATION_STATUS(id)),
  approvedAccounts: (id) =>
    apiService.get(API_ENDPOINTS.AGENT.APPROVED_ACCOUNTS(id)),
  pendingAccounts: (id) =>
    apiService.get(API_ENDPOINTS.AGENT.PENDING_ACCOUNTS(id)),
  reviewAccounts: (id) =>
    apiService.get(API_ENDPOINTS.AGENT.REVIEW_ACCOUNTS(id)),
  rejectAccounts: (id) =>
    apiService.get(API_ENDPOINTS.AGENT.REJECT_ACCOUNTS(id)),
  
    
  demographicReport:(id)=> apiService.get(API_ENDPOINTS.AGENT.DEMOGRAPHIC_AGE_GRAPH(id)),

  vkycpendingtable:(id) => apiService.get(API_ENDPOINTS.AGENT.VKYC_PENDING_TABLE(id)),

  refillApplication:(id)=> apiService.get(API_ENDPOINTS.AGENT.APPLICATION_REWORK(id)),

  agentapplicationmonthly:(id)=> apiService.get(API_ENDPOINTS.AGENT.AGENT_APPLICATION_MONTHLY(id)),
  agentapplicationyearly:(id)=> apiService.get(API_ENDPOINTS.AGENT.AGENT_APPLICATION_YEARLY(id)),
}

export const personalDetailsService = {
  create: (data) => apiService.post(API_ENDPOINTS.PERSONAL_DETAILS.CREATE, data),
  // update: (id, data) => apiService.post(API_ENDPOINTS.PERSONAL_DETAILS.UPDATE(id), data),
};

export const addressDetailsService = {
  create: (data) => apiService.post(API_ENDPOINTS.ADDRESS_DETAILS.CREATE, data),
  // update: (id, data) => apiService.post(API_ENDPOINTS.ADDRESS_DETAILS.UPDATE(id), data),
};

export const livePhotoService = {
  upload: (formData) =>
    apiService.post(API_ENDPOINTS.LIVE_PHOTO.CREATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const agentlivephotoSave = {
  upload: (formData) =>
    apiService.post(API_ENDPOINTS.AGENT_LIVE_PHOTO.CREATE, formData, {
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

export const applicationDetailsService = {
  getFullDetails: (id) =>
    apiService.get(API_ENDPOINTS.ADMIN.GET_DETAILS_BY_APPLICATION_ID(id)),
};

export const applicationDetailsServices = {
  getByAadhar: (auth_code) =>
    apiService.post('/api/application/by-aadhar', { auth_code }),
  // ...other methods
};

export const accountsStatusListService = {
  getList: () =>
    apiService.get(API_ENDPOINTS.ACCOUNTS_STATUS_LIST.GET_LIST),
};

export const kycaccountsStatusListService = {
  getList: () =>
    apiService.get(API_ENDPOINTS.KYC_ACCOUNTS_STATUS_LIST.GET_LIST),
};

export const kycApprovedApplicationsService = {
  getList: () =>
    apiService.get(API_ENDPOINTS.KYC_APPROVED_APPLICATIONS.GET_LIST),
};
export const kycPendingApplicationsService = {
  getList: () =>
    apiService.get(API_ENDPOINTS.KYC_PENDING_APPLICATIONS.GET_LIST),
};
export const kycRjectedApplicationsService = {
  getList: () =>
    apiService.get(API_ENDPOINTS.KYC_REJECTED_APPLICATIONS.GET_LIST),
};
export const kycReviewApplicationsService = {
  getList: () =>
    apiService.get(API_ENDPOINTS.KYC_REVIEW_APPLICATIONS.GET_LIST),
};
export const recentPendingApplicationsService = {
  getList: () =>
    apiService.get(API_ENDPOINTS.RECENT_PENDING_APPLICATIONS.GET_LIST),
};

export const pendingAccountData = {
  getDetailsS1: (id) =>
    apiService.get(API_ENDPOINTS.PENDING_ACCOUNT.GET_DATAILS_S1(id)),
  getDetailsS2A: (id) =>
    apiService.get(API_ENDPOINTS.PENDING_ACCOUNT.GET_DATAILS_S2A(id)),
  getDetailsS2B: (id) =>
    apiService.get(API_ENDPOINTS.PENDING_ACCOUNT.GET_DATAILS_S2B(id)),
  getDetailsS2C: (id) =>
    apiService.get(API_ENDPOINTS.PENDING_ACCOUNT.GET_DATAILS_S2C(id)),

  getDetailsS3: (id) =>
    apiService.get(API_ENDPOINTS.PENDING_ACCOUNT.GET_DATAILS_S3(id)),
  getDetailsS5A: (id) =>
    apiService.get(API_ENDPOINTS.PENDING_ACCOUNT.GET_DATAILS_S5A(id)),
  getDetailsS5B: (id) =>
    apiService.get(API_ENDPOINTS.PENDING_ACCOUNT.GET_DATAILS_S5B(id)),
  getDetailsS5C: (id) =>
    apiService.get(API_ENDPOINTS.PENDING_ACCOUNT.GET_DATAILS_S5C(id)),
  getDetailsS6B: (id) =>
    apiService.get(API_ENDPOINTS.PENDING_ACCOUNT.GET_DATAILS_S6B(id)),

}

export const pendingAccountStatusUpdate = {
  updateS1: (id, data) =>
    apiService.post(API_ENDPOINTS.PENDING_ACCOUNT_STATUS_UPDATE.UPDATE_S1(id), data),
  updateS2A: (id, data) =>
    apiService.post(API_ENDPOINTS.PENDING_ACCOUNT_STATUS_UPDATE.UPDATE_S2A(id), data),
  updateS2B: (id, data) =>
    apiService.post(API_ENDPOINTS.PENDING_ACCOUNT_STATUS_UPDATE.UPDATE_S2B(id), data),
  updateS2C: (id, data) =>
    apiService.post(API_ENDPOINTS.PENDING_ACCOUNT_STATUS_UPDATE.UPDATE_S2C(id), data),
  updateS3: (id, data) =>
    apiService.post(API_ENDPOINTS.PENDING_ACCOUNT_STATUS_UPDATE.UPDATE_S3(id), data),
  updateS5A: (id, data) =>
    apiService.post(API_ENDPOINTS.PENDING_ACCOUNT_STATUS_UPDATE.UPDATE_S5A(id), data),
  updateS5B: (id, data) =>
    apiService.post(API_ENDPOINTS.PENDING_ACCOUNT_STATUS_UPDATE.UPDATE_S5B(id), data),
  updateS5C: (id, data) =>
    apiService.post(API_ENDPOINTS.PENDING_ACCOUNT_STATUS_UPDATE.UPDATE_S5C(id), data),
  updateS6B: (id, data) =>
    apiService.post(API_ENDPOINTS.PENDING_ACCOUNT_STATUS_UPDATE.UPDATE_S6B(id), data),
};
export const getsignabstract={ 
    upload: (formData) =>
    apiService.post(API_ENDPOINTS.DOCUMENT_SIGN_ABSTRACTION.UPLOAD_DOC, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    
}




// om data below
export const adminService = {
  getAllApplications: () =>
    apiService.get(API_ENDPOINTS.ADMIN.GET_ALL_APPLICATIONS),
  getAllApplicationsPending: () =>
    apiService.get(API_ENDPOINTS.ADMIN.GET_ALL_PENDING_APPLICATIONS),
  getAllApllicationsRejected: () =>
    apiService.get(API_ENDPOINTS.ADMIN.GET_ALL_APPLICATIONS_REJECTED),

  // Add these for approved applications
  getAllApprovedApplications: () =>
    apiService.get(API_ENDPOINTS.ADMIN.APPROVED_ENROLLMENT_LIST),
  getApprovedApplicationsAgentCount: () =>
    apiService.get(API_ENDPOINTS.ADMIN.GET_APPROVED_APPLICATIONS_AGENT_COUNT),
  getApprovedApplicationsDetailsByAgent: (agentId) =>
    apiService.get(API_ENDPOINTS.ADMIN.GET_APPROVED_APPLICATIONS_DETAILS_BY_AGENT(agentId)),
  // Add these for review applications
  getAllReviewApplications: () =>
    apiService.get(API_ENDPOINTS.ADMIN.GET_ALL_REVIEW_APPLICATIONS),
  getReviewApplicationsAgentCount: () =>
    apiService.get(API_ENDPOINTS.ADMIN.GET_REVIEW_APPLICATIONS_AGENT_COUNT),
  getReviewApplicationsDetailsByAgent: (agentId) =>
    apiService.get(API_ENDPOINTS.ADMIN.GET_REVIEW_APPLICATIONS_DETAILS_BY_AGENT(agentId)),
  //  Add these for kycreview applicationss
  getAllKycReviewApplications: () =>
    apiService.get(API_ENDPOINTS.ADMIN.GET_ALL_KYC_REVIEW_APPLICATIONS),
  /// working above 


  updateApplicationStatus: (id, status) =>
    apiService.post(API_ENDPOINTS.ADMIN.UPDATE_APPLICATION_STATUS, { id, status }),
  updatePersonalDetailsStatus: (id, status) =>
    apiService.post(API_ENDPOINTS.ADMIN.UPDATE_PERSONAL_DETAILS_STATUS, { id, status }),
  updateDocumentsStatus: (id, status) =>
    apiService.post(API_ENDPOINTS.ADMIN.UPDATE_DOCUMENTS_STATUS, { id, status }),
  updateAddressDetailsStatus: (id, status) =>
    apiService.post(API_ENDPOINTS.ADMIN.UPDATE_ADDRESS_DETAILS_STATUS, { id, status }),
  updateLivePhotosStatus: (id, status) =>
    apiService.post(API_ENDPOINTS.ADMIN.UPDATE_LIVE_PHOTOS_STATUS, { id, status }),
  updateAccountPersonalDetailsStatus: (id, status) =>
    apiService.post(API_ENDPOINTS.ADMIN.UPDATE_ACCOUNT_PERSONAL_DETAILS_STATUS, { id, status }),
  updateNomineesStatus: (id, status) =>
    apiService.post(API_ENDPOINTS.ADMIN.UPDATE_NOMINEES_STATUS, { id, status }),
  // Clicking on the view button in the admin dashboard
  getFullApplicationDetails: (id) =>
    apiService.get(API_ENDPOINTS.ADMIN.GET_FULL_APPLICATION_DETAILS(id)),
  pendingApplicationCountByAgent: apiService.get(API_ENDPOINTS.ADMIN.PENDING_APPLICATION_COUNT_BY_AGENT),

  /// dashobard charts
  monthlyLineChart:  apiService.get(API_ENDPOINTS.ADMIN.MONTHLY_LINE_CHART),
  monthlyauthbarchart: apiService.get(API_ENDPOINTS.ADMIN.MONTHLY_AUTH_BARCHART),
  weeklyauthbarchart: apiService.get(API_ENDPOINTS.ADMIN.WEEKLY_AUTH_BARCHART),
  kycstatusperyear: apiService.get(API_ENDPOINTS.ADMIN.KYC_STATUS_FOR_CURRENT_YEAR),
   
 
};
// om data above


export const kycService = {
  startkyc: (data) =>
    apiService.post(API_ENDPOINTS.KYC.START_KYC, data),
  saveAllKycData: (data) =>
    apiService.post(API_ENDPOINTS.KYC.SAVE_ALL_KYC_DATA, data),
  // document upload kyc
  kycDocumentUpload: (formData) =>
    apiService.post('/dao/api/agent/kycDocumentUpload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};


export const pendingKyc= {
  pedingKyc1: ( id) =>
    apiService.get(API_ENDPOINTS.PENDING_KYC.GET_DATAILS_KYC1(id)),
  pendingKyc2: ( id) =>
    apiService.get(API_ENDPOINTS.PENDING_KYC.GET_DATAILS_KYC2(id)), 
};


export const pendingKycStusUpdate = {
  updateKyc1: ( data) =>
    apiService.post(API_ENDPOINTS.PENDING_KYC_UPDATE.UPDATE_KYC1, data),
  updateKyc2: ( data) =>
    apiService.post(API_ENDPOINTS.PENDING_KYC_UPDATE.UPDATE_KYC2, data), 
  updateKyc3: ( data) =>
    apiService.post(API_ENDPOINTS.PENDING_KYC_UPDATE.update_KYC3, data), 
};


export const videoKycServie = {
  createMeeting: (id) =>
    apiService.post(API_ENDPOINTS.VKYC_CREATE_MEETING(id)),
}






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
    apiService.post(API_ENDPOINTS.BRANCH.UPDATE(id), data),

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

  updateUser: (id, data) => apiService.post(API_ENDPOINTS.USER.UPDATE(id), data),

  deleteUser: (id) => apiService.delete(API_ENDPOINTS.USER.DELETE(id)),

  approveUser: (id) => apiService.post(API_ENDPOINTS.USER.APPROVE(id)),

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
    apiService.post(API_ENDPOINTS.ACCOUNT.UPDATE(id), data),

  deleteAccount: (id) => apiService.delete(API_ENDPOINTS.ACCOUNT.DELETE(id)),

  unapproveAccounts: (page = 0, size = 10) =>
    apiService.get(API_ENDPOINTS.ACCOUNT.UNAPPROVE(page, size)),

  approveAccount: (id) => apiService.post(API_ENDPOINTS.ACCOUNT.APPROVE(id)),

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


























 