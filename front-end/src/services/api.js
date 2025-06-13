

export const API_ENDPOINTS = {
  // BASE_URL_LOGIN: "http://127.0.0.1:8090", // For login only

  BASE_URL_LOGIN: import.meta.env.VITE_BASE_URL_LOGIN,
  BASE_URL_DAO: import.meta.env.VITE_BASE_URL_DAO,
  AUTH: {
    LOGIN: "/auth/api/login",
    FORGOTPASS: (id) => `/api/auth/api/forgot-password?identifier=${id}`,
    OTPVERIFY: (id, id1) =>
      `/api/auth/api/validate-otp?identifier=${id}&otp=${id1}`,
    SETPASS: (id, id1) =>
      `/auth/api/reset-password?identifier=${id}&newPassword=${id1}`,
    LOGOUT: "/auth/api/logout",
  },

  CREATE_ACCOUNT:{
    ENROLLMENT_S1: '/dao/api/agent/enrollment', 
    PERSONAL_DETAILS_S2A: '/dao/api/agent/personal-details',
    ADDRESS_DETAILS_S2B: '/dao/api/agent/address-details',
    LIVE_PHOTO_S2C: '/dao/api/agent/live-photo',
    APPLICATION_DOCUMENT_S3: '/dao/api/agent/application-document',
    ACCOUNT_PERSONAL_DETAILS_S5A: '/dao/api/agent/account-personal-details',
    ACCOUNT_NOMINEE_S5B: '/dao/api/agent/account-nominee',
    SERVICE_TO_CUSTOMER_S5C: '/dao/api/agent/service-to-customer',
    AGENT_LIVE_PHOTO_S6B: '/dao/api/agent/agent-live-photo',
  },

  AGENT: {
    GET_FULL_APPLICATIONS_BY_AGENT: (agentId) => `/api/agent/full-applications/${agentId}`,
  },

  PERSONAL_DETAILS: {
    CREATE: '/dao/api/agent/personal-details',
  },

  ADDRESS_DETAILS: {
    CREATE: '/dao/api/agent/address-details', 
  },

  LIVE_PHOTO: {
    CREATE: '/dao/api/agent/live-photo',
  },

  APPLICATION_DOCUMENT: {
    CREATE: '/dao/api/agent/application-document',
  },

  ACCOUNT_PERSONAL_DETAILS: {
    CREATE: '/dao/api/agent/account-personal-details',
  },

  ACCOUNT_NOMINEE: {
    CREATE: '/dao/api/agent/account-nominee',
  },

  SERVICE_TO_CUSTOMER: {
    CREATE: '/dao/api/agent/service-to-customer',
  },

  AGENT_LIVE_PHOTO: {
    CREATE: '/dao/api/agent/agent-live-photo',
  },

  ACCOUNTS_STATUS_LIST: { GET_LIST: '/dao/api/admin/accountSatus', },

  KYC_PENDING_APPLICATIONS: {
    GET_LIST: '/dao/api/admin/kyc-applications/pending',  // Updated endpoint path ]
  },
  KYC_ACCOUNTS_STATUS_LIST: {
    GET_LIST: '/dao/api/admin/kycaccountsStatus',  // Updated endpoint path
  },

  RECENT_PENDING_APPLICATIONS: {
    GET_LIST: '/dao/api/admin/pendingApplication',
  },

  KYC: {
    START_KYC: '/dao/api/agent/kyc/start',
    SAVE_ALL_KYC_DATA: '/dao/api/agent/save-all-kyc-data',
    UPDATE_KYC_DOCUMENT_STATUS: '/dao/api/agent/update-kyc-document-status',
    UPDATE_KYC_AFTER_VS_CBS_STATUS: '/dao/api/agent/update-kyc-after-vs-cbs-status',
  },

  PENDING_ACCOUNT: {
    GET_DATAILS_S1: (id) => `/api/admin/pendingApplicationDetailsByID/${id}`,
    GET_DATAILS_S2A: (id) => `/api/admin/fetchApplicationPersonalDetails/${id}`,
    GET_DATAILS_S2B: (id) => `/api/admin/fetchApplicationAddressDetails/${id}`,
    GET_DATAILS_S2C: (id) => `/api/admin/fetchApplicantLivePhotosDetails/${id}`,

    GET_DATAILS_S3: (id) => `/api/admin/fetchApplicationDocuments/${id}`,

    GET_DATAILS_S5A: (id) => `/api/admin/fetchAccountPersonalDetails/${id}`,
    GET_DATAILS_S5B: (id) => `/api/admin/fetchAccountNominees/${id}`,
    GET_DATAILS_S5C: (id) => `/api/admin/fetchServiceToCustomer/${id}`,
    GET_DATAILS_S6B: (id) => `/api/admin/fetchAgentLivePhotos/${id}`,
  },
  PENDING_ACCOUNT_STATUS_UPDATE: {
    UPDATE_S1: (id) => `/api/admin/updateCustomerApplicationDetails/${id}`,
    UPDATE_S2A: (id) => `/api/admin/updateApplicationPersonalDetails/${id}`,
    UPDATE_S2B: (id) => `/api/admin/updateApplicationAddressDetails/${id}`,
    UPDATE_S2C: (id) => `/api/admin/updateApplicantLivePhotos/${id}`,

    UPDATE_S3: (id) => `/api/admin/updateApplicationDocuments/${id}`,

    UPDATE_S5A: (id) => `/api/admin/updateAccountPersonalDetails/${id}`,
    UPDATE_S5B: (id) => `/api/admin/updateAccountNominees/${id}`,
    UPDATE_S5C: (id) => `/api/admin/fetchServiceToCustomer/${id}`,
    UPDATE_S6B: (id) => `/api/admin/updateAgentLivePhotos/${id}`,

  },
  
  PENDING_KYC: {
    GET_DATAILS_KYC1:(id)=> `/api/admin/kyc/details/${id}`,
    GET_DATAILS_KYC2:(id)=> `api/admin/kyc/details/${id}`, // Updated endpoint path
  },

  PENDING_KYC_UPDATE: {
    UPDATE_KYC1: `/api/agent/update-kyc-after-vs-cbs-status`,
    UPDATE_KYC2: `/api/agent/update-kyc-document-status`, 
    update_KYC3: `/api/admin/kyc-application-status/update`
  },

// /video-kyc/create/{id}
  VKYC_CREATE_MEETING: (id) => `/api/video-kyc/create/${id}`,




  // om data below
  ADMIN: {
    GET_ALL_APPLICATIONS: '/dao/api/admin/applications',

    GET_ALL_PENDING_APPLICATIONS: '/dao/api/admin/pendingApplication', 
    GET_ALL_APPLICATIONS_REJECTED: '/dao/api/admin/applications/rejected',
    UPDATE_APPLICATION_STATUS: '/dao/api/admin/application/update-status',
    UPDATE_PERSONAL_DETAILS_STATUS: '/dao/api/admin/personal-details/update-status',
    UPDATE_DOCUMENTS_STATUS: '/dao/api/admin/documents/update-status',
    UPDATE_ADDRESS_DETAILS_STATUS: '/dao/api/admin/address-details/update-status',
    UPDATE_LIVE_PHOTOS_STATUS: '/dao/api/admin/live-photos/update-status',
    UPDATE_ACCOUNT_PERSONAL_DETAILS_STATUS: '/dao/api/admin/account-personal-details/update-status',
    UPDATE_NOMINEES_STATUS: '/dao/api/admin/nominees/update-status',
    //clicking on the view button in the admin dashboard
    GET_FULL_APPLICATION_DETAILS: (id) => `/admin/application-details/${id}`,
    // Add these for Reviews applications
    GET_ALL_REVIEW_APPLICATIONS: '/dao/api/admin/reviewApplication',
    GET_REVIEW_APPLICATIONS_AGENT_COUNT: '/dao/api/admin/reviewApplicationCount',
    GET_REVIEW_APPLICATIONS_DETAILS_BY_AGENT: (agentId) => `/api/admin/reviewApplicationDetails/${agentId}`,
    // Add these for kyc review applications
    GET_ALL_KYC_REVIEW_APPLICATIONS: '/dao/api/admin/kycReviewApplication',

    // /// By ankitka
    APPROVED_ENROLLMENT_LIST:'/dao/api/admin/approvedApplication',
  },



  // om data above


 

  BANK: {
    CREATE: "/auth/banks",
    GET_ALL: "/auth/banks",
    GET_BY_ID: (id) => `/auth/banks/${id}`,
    UPDATE: (id) => `/auth/banks/${id}`,
    DELETE: (id) => `/auth/banks/${id}`,
  },


  //users required handeled as agent registeration
  USER: {
    CREATE: "/auth/users",
    GET_ALL: (id, id1) => `/auth/users?page=${id}&size=${id1}`,
    GET_BY_ID: (id) => `/auth/users/${id}`,
    UPDATE: (id) => `/auth/users/${id}`,
    USER_DUPLICATION: (id) => `auth/users/check-duplicate/${id}`,
    EPM_CODE_DUPLICATE: (id) => `auth/users/check-duplicate-employe/${id}`,
    DELETE: (id) => `/auth/users/${id}`,
    UNAPPROVE: (id, id1) => `/auth/users/unauthorized?page=${id}&size=${id1}`,
    APPROVE: (id) => `/auth/users/authorize/${id}`,
    SEARCH: ({
      userName,
      employeeCode,
      workingBranchCode,
      page = 0,
      size = 10,
    }) => {
      const queryParams = new URLSearchParams({
        ...(userName && { userName }),
        ...(employeeCode && { employeeCode }),
        ...(workingBranchCode && { workingBranchCode }),
        page,
        size,
      }).toString();
      return `/auth/users/search?${queryParams}`;
    },
  },
}


































 







  

  //   //approved
  //   Route::get('/admin/approvedApplication', [AdminController::class, 'getApprovedApplications']);
  //   Route::get('/admin/approvedApplicationCount', [AdminController::class, 'getApprovedApplicationsAgentCount']);
  //   Route::get('/admin/approvedApplicationDetails/{agentId}', [AdminController::class, 'getApprovedApplicationsDetailsAgentById']);
  //   //review
  //   Route::get('/admin/reviewApplication', [AdminController::class, 'getReviewApplications']);
  //   Route::get('/admin/reviewApplicationCount', [AdminController::class, 'getReviewApplicationsAgentCount']);
  //   Route::get('/admin/reviewApplicationDetails/{agentId}', [AdminController::class, 'getReviewApplicationsDetailsAgentById']);
  //   //rejected
  //   Route::get('admin/applications/rejected', [AdminController::class, 'getRejectedApplications']);
  //   Route::get('admin/applications/rejected/count-by-agent', [AdminController::class, 'getRejectedApplicationsAgentCount']);
  //   Route::get('admin/applications/rejected/agent/{agentId}', [AdminController::class, 'getRejectedApplicationsDetailsAgentById']);
  //   //kyc review 
  //   Route::get('/admin/kycReviewApplication', [AdminController::class, 'getKycReviewApplications']);
  //   Route::get('/kyc/review/count-by-agent', [AdminController::class, 'getKycReviewApplicationsAgentCount']);
  //  Route::get('/kyc/review/agent/{agentId}', [AdminController::class, 'getKycReviewApplicationsByAgentId']);
  //   // kyc approved table 
  //   Route::get('/admin/kyc-applications/approved', [AdminController::class, 'getKycApprovedApplications']);
  //   Route::get('/kyc/approved/count-by-agent', [AdminController::class, 'getKycApprovedApplicationsAgentCount']);
  //   Route::get('/kyc/approved/agent/{agentId}', [AdminController::class, 'getKycApprovedApplicationsByAgentId']);
