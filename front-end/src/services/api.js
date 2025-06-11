

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

  AGENT: {
    AGENTENROLL: '/api/agent/enrollment',
    GET_FULL_APPLICATIONS_BY_AGENT: (agentId) => `/api/agent/full-applications/${agentId}`,
  },

  PERSONAL_DETAILS: {
    CREATE: '/api/agent/personal-details',
  },

  ADDRESS_DETAILS: {
    CREATE: '/api/agent/address-details',
    // ...
  },

  LIVE_PHOTO: {
    CREATE: '/api/agent/live-photo',
  },

  APPLICATION_DOCUMENT: {
    CREATE: '/api/agent/application-document',
  },

  ACCOUNT_PERSONAL_DETAILS: {
    CREATE: '/api/agent/account-personal-details',
  },

  ACCOUNT_NOMINEE: {
    CREATE: '/api/agent/account-nominee',
  },

  SERVICE_TO_CUSTOMER: {
    CREATE: '/api/agent/service-to-customer',
  },

  AGENT_LIVE_PHOTO: {
    CREATE: '/api/agent/agent-live-photo',
  },

  ACCOUNTS_STATUS_LIST: { GET_LIST: '/api/admin/accountSatus', },

  KYC_ACCOUNTS_STATUS_LIST: {
    GET_LIST: '/api/admin/kycaccountsStatus',  // Updated endpoint path
  },

  RECENT_PENDING_APPLICATIONS: {
    GET_LIST: '/api/admin/pendingApplication',
  },

  KYC: {
    START_KYC: '/api/agent/kyc/start',
    SAVE_ALL_KYC_DATA: '/api/agent/save-all-kyc-data',
    UPDATE_KYC_DOCUMENT_STATUS: '/api/agent/update-kyc-document-status',
    UPDATE_KYC_AFTER_VS_CBS_STATUS: '/api/agent/update-kyc-after-vs-cbs-status',
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

  }

  ,






  // om data below
  ADMIN: {
    GET_ALL_APPLICATIONS: '/api/admin/applications',
    GET_ALL_PENDING_APPLICATIONS: '/api/admin/applications/pending',
    GET_ALL_APPLICATIONS_REJECTED: '/api/admin/applications/rejected',
    UPDATE_APPLICATION_STATUS: '/api/admin/application/update-status',
    UPDATE_PERSONAL_DETAILS_STATUS: '/api/admin/personal-details/update-status',
    UPDATE_DOCUMENTS_STATUS: '/api/admin/documents/update-status',
    UPDATE_ADDRESS_DETAILS_STATUS: '/api/admin/address-details/update-status',
    UPDATE_LIVE_PHOTOS_STATUS: '/api/admin/live-photos/update-status',
    UPDATE_ACCOUNT_PERSONAL_DETAILS_STATUS: '/api/admin/account-personal-details/update-status',
    UPDATE_NOMINEES_STATUS: '/api/admin/nominees/update-status',
    //clicking on the view button in the admin dashboard
    GET_FULL_APPLICATION_DETAILS: (id) => `/admin/application-details/${id}`,
    // Add these for approved applications
    GET_ALL_APPROVED_APPLICATIONS: '/api/admin/approvedApplication',
    GET_APPROVED_APPLICATIONS_AGENT_COUNT: '/api/admin/approvedApplicationCount',
    GET_APPROVED_APPLICATIONS_DETAILS_BY_AGENT: (agentId) => `/api/admin/approvedApplicationDetails/${agentId}`,
    // Add these for Reviews applications
    GET_ALL_REVIEW_APPLICATIONS: '/api/admin/reviewApplication',
    GET_REVIEW_APPLICATIONS_AGENT_COUNT: '/api/admin/reviewApplicationCount',
    GET_REVIEW_APPLICATIONS_DETAILS_BY_AGENT: (agentId) => `/api/admin/reviewApplicationDetails/${agentId}`,
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