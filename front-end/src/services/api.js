export const API_ENDPOINTS = {
  // BASE_URL_LOGIN: "http://127.0.0.1:8090", // For login only
  BASE_URL_LOGIN: "http://172.16.1.224:8084", // For login only
  BASE_URL_DAO: "http://127.0.0.1:8000",  // For everything else

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
    AGENTENROLL: '/api/agent/enrollment'
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

  RECENT_PENDING_APPLICATIONS: {
    GET_LIST: '/api/admin/pendingApplication',
  },

  PENDING_ACCOUNT: {
    GET_DATAILS_S1: (id) => `/api/admin/pendingApplicationDetailsByID/${id}`,
  },









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