export const API_ENDPOINTS = {
  // BASE_URL: "http://172.16.1.224:8090",
  BASE_URL: "http://127.0.0.1:8000/api",

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
    AGENTENROLL: '/agent/enrollment'
  },

  PERSONAL_DETAILS: {
    CREATE: '/agent/personal-details',
    // UPDATE: (id) => `/agent/personal-details/${id}` // if you want update
  },

  ADDRESS_DETAILS: {
    CREATE: '/agent/address-details',
    // ...
  },

  LIVE_PHOTO: {
    CREATE: '/agent/live-photo',
  },

  APPLICATION_DOCUMENT: {
    CREATE: '/agent/application-document',
  },

  ACCOUNT_PERSONAL_DETAILS: {
    CREATE: '/agent/account-personal-details',
  },

  ACCOUNT_NOMINEE: {
    CREATE: '/agent/account-nominee',
  },

  SERVICE_TO_CUSTOMER: {
    CREATE: '/agent/service-to-customer',
  },

  ADMIN: {
    GET_ALL_APPLICATIONS: '/admin/applications',
    GET_ALL_PENDING_APPLICATIONS: '/admin/applications/pending',
    GET_ALL_APPLICATIONS_REJECTED: '/admin/applications/rejected',
  },

  BANK: {
    CREATE: "/auth/banks",
    GET_ALL: "/auth/banks",
    GET_BY_ID: (id) => `/auth/banks/${id}`,
    UPDATE: (id) => `/auth/banks/${id}`,
    DELETE: (id) => `/auth/banks/${id}`,
  },


  //users
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