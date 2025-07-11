export const API_ENDPOINTS = {
  // BASE_URL_LOGIN: "http://127.0.0.1:8090", // For login only

  BASE_URL_LOGIN: import.meta.env.VITE_BASE_URL_LOGIN,
  AUTH: {
    LOGIN: "/auth/api/login",
    FORGOTPASS: (id) => `/auth/api/forgot-password?identifier=${id}`,
    OTPVERIFY: (id, id1) =>
      `/auth/api/validate-otp?identifier=${id}&otp=${id1}`,
    SETPASS: (id, id1) =>
      `/auth/api/reset-password?identifier=${id}&newPassword=${id1}`,
    LOGOUT: "/auth/api/logout",
  },

  CREATE_ACCOUNT: {
    ENROLLMENT_S1: "/dao/api/agent/enrollment",
    PERSONAL_DETAILS_S2A: "/dao/api/agent/personal-details",
    ADDRESS_DETAILS_S2B: "/dao/api/agent/address-details",
    LIVE_PHOTO_S2C: "/dao/api/agent/live-photo",
    APPLICATION_DOCUMENT_S3: "/dao/api/agent/application-document",
    ACCOUNT_PERSONAL_DETAILS_S5A: "/dao/api/agent/account-personal-details",
    ACCOUNT_NOMINEE_S5B: "/dao/api/agent/account-nominee",
    SERVICE_TO_CUSTOMER_S5C: "/dao/api/agent/service-to-customer",
    AGENT_LIVE_PHOTO_S6B: "/dao/api/agent/agent-live-photo",
    GET_BANKING_FACILITIES_SERVICE: "/dao/api/agent/bankingServices",
  VCALL_GUIDLINE_ACCEPTANCE: (id) => `/dao/api/video-kyc/guidline/${id}`,
  },

  AGENT: {
    GET_FULL_APPLICATIONS_BY_AGENT: (agentId) =>
      `/dao/api/agent/full-applications/${agentId}`,

    ///for agent dashboard
    GET_APPLICATION_COUNT: (id) =>
      `/dao/api/account-status-by-agent?agent_id=${id}`,
    APPROVED_ACCOUNTS: (id) => `dao/api/agent/applications/approved/${id}`,
    PENDING_ACCOUNTS: (id) => `dao/api/agent/applications/pending/${id}`,
    REVIEW_ACCOUNTS: (id) => `dao/api/agent/applications/review/${id}`,
    REJECT_ACCOUNTS: (id) => `dao/api/agent/applications/rejected/${id}`,
    KYC_APPLICATION_STATUS: (id) =>
      `/dao/api/kyc-applications/trends?kyc_agent_id=${id}`,
    AGENT_APPLICATION_MONTHLY: (id) =>
      `/dao/api/agent-applications-grouped/${id}`,
    AGENT_APPLICATION_YEARLY: (id) =>
      `/dao/api/agent-applications-yearly/${id}`,
    DEMOGRAPHIC_AGE_GRAPH: (id) =>
      `dao/api/applications/age-groups?agent_id=${id}`,
    VKYC_PENDING_TABLE: (id) =>
      `dao/api/kyc-applications/pending-by-agent?agent_id=${id}`,

    APPLICATION_REWORK: (id) => `dao/api/admin/applications/reson/review/${id}`,
  },

  PERSONAL_DETAILS: {
    CREATE: "/dao/api/agent/personal-details",
  },

  ADDRESS_DETAILS: {
    CREATE: "/dao/api/agent/address-details",
  },

  LIVE_PHOTO: {
    CREATE: "/dao/api/agent/live-photo",
  },

  APPLICATION_DOCUMENT: {
    CREATE: "/dao/api/agent/application-document",
  },

  ACCOUNT_PERSONAL_DETAILS: {
    CREATE: "/dao/api/agent/account-personal-details",
  },

  ACCOUNT_NOMINEE: {
    CREATE: "/dao/api/agent/account-nominee",
  },

  SERVICE_TO_CUSTOMER: {
    CREATE: "/dao/api/agent/service-to-customer",
  },

  AGENT_LIVE_PHOTO: {
    CREATE: "/dao/api/agent/agent-live-photo",
  },

  ACCOUNTS_STATUS_LIST: { GET_LIST: "/dao/api/admin/accountSatus" },

  KYC_APPROVED_APPLICATIONS: {
    GET_LIST: "/dao/api/admin/kyc-applications/approved",
  },
  KYC_PENDING_APPLICATIONS: {
    GET_LIST: "/dao/api/admin/kyc-applications/pending", // Updated endpoint path ]
  },
  KYC_REVIEW_APPLICATIONS: {
    GET_LIST: "/dao/api/admin/kyc-applications/rejected/review", // Updated endpoint path ]
  },
  KYC_REJECTED_APPLICATIONS: {
    GET_LIST: "/dao/api/admin/kyc-applications/rejected/Rejected", // Updated endpoint path ]
  },

  KYC_ACCOUNTS_STATUS_LIST: {
    GET_LIST: "/dao/api/admin/kycaccountsStatus", // Updated endpoint path
  },

  RECENT_PENDING_APPLICATIONS: {
    GET_LIST: "/dao/api/admin/pendingApplication",
  },

  KYC: {
    START_KYC: "/dao/api/agent/kyc/start",
    SAVE_ALL_KYC_DATA: "/dao/api/agent/save-all-kyc-data",
    UPDATE_KYC_DOCUMENT_STATUS: "/dao/api/agent/update-kyc-document-status",
    UPDATE_KYC_AFTER_VS_CBS_STATUS:
      "/dao/api/agent/update-kyc-after-vs-cbs-status",
  },

  PENDING_ACCOUNT: {
    GET_DATAILS_S1: (id) =>
      `/dao/api/admin/pendingApplicationDetailsByID/${id}`,
    GET_DATAILS_S2A: (id) =>
      `/dao/api/admin/fetchApplicationPersonalDetails/${id}`,
    GET_DATAILS_S2B: (id) =>
      `/dao/api/admin/fetchApplicationAddressDetails/${id}`,
    GET_DATAILS_S2C: (id) =>
      `/dao/api/admin/fetchApplicantLivePhotosDetails/${id}`,

    GET_DATAILS_S3: (id) => `/dao/api/admin/fetchApplicationDocuments/${id}`,

    GET_DATAILS_S5A: (id) => `/dao/api/admin/fetchAccountPersonalDetails/${id}`,
    GET_DATAILS_S5B: (id) => `/dao/api/admin/fetchAccountNominees/${id}`,
    GET_DATAILS_S5C: (id) => `/dao/api/admin/fetchServiceToCustomer/${id}`,
    GET_DATAILS_S6B: (id) => `/dao/api/admin/fetchAgentLivePhotos/${id}`,
  },
  PENDING_ACCOUNT_STATUS_UPDATE: {
    UPDATE_S1: (id) => `/dao/api/admin/updateCustomerApplicationDetails/${id}`,
    UPDATE_S2A: (id) => `/dao/api/admin/updateApplicationPersonalDetails/${id}`,
    UPDATE_S2B: (id) => `/dao/api/admin/updateApplicationAddressDetails/${id}`,
    UPDATE_S2C: (id) => `/dao/api/admin/updateApplicantLivePhotos/${id}`,

    UPDATE_S3: (id) => `/dao/api/admin/updateApplicationDocuments/${id}`,

    UPDATE_S5A: (id) => `/dao/api/admin/updateAccountPersonalDetails/${id}`,
    UPDATE_S5B: (id) => `/dao/api/admin/updateAccountNominees/${id}`,
    UPDATE_S5C: (id) => `/dao/api/admin/updateServiceToCustomer/${id}`,
    UPDATE_S6B: (id) => `/dao/api/admin/updateAgentLivePhotos/${id}`,
  },
  DOCUMENT_SIGN_ABSTRACTION: {
    UPLOAD_DOC: "ext/api/detect",
  },
  PENDING_KYC: {
    GET_DATAILS_KYC1: (id) => `/dao/api/admin/kyc/details/${id}`,
    GET_DATAILS_KYC2: (id) => `/dao/api/admin/kyc/details/${id}`, // Updated endpoint path
  },

  PENDING_KYC_UPDATE: {
    UPDATE_KYC1: `/dao/api/agent/update-kyc-after-vs-cbs-status`,
    UPDATE_KYC2: `/dao/api/agent/update-kyc-document-status`,
    update_KYC3: `/dao/api/admin/kyc-application-status/update`,
  },

  // /video-kyc/create/{id}
  VKYC_CREATE_MEETING: (id) => `/dao/api/video-kyc/create/${id}`,

  // om data below
  ADMIN: {
    GET_ALL_APPLICATIONS: "/dao/api/admin/applications",
    GET_ALL_PENDING_APPLICATIONS: "/dao/api/admin/pendingApplication",
    GET_ALL_APPLICATIONS_REJECTED:
      "/dao/api/admin/applications/rejected/Rejected",
    // GET_ALL_APPLICATIONS_REJECTED: '/dao/api/admin/applications/rejected/review',
    UPDATE_APPLICATION_STATUS: "/dao/api/admin/application/update-status",
    UPDATE_PERSONAL_DETAILS_STATUS:
      "/dao/api/admin/personal-details/update-status",
    UPDATE_DOCUMENTS_STATUS: "/dao/api/admin/documents/update-status",
    UPDATE_ADDRESS_DETAILS_STATUS:
      "/dao/api/admin/address-details/update-status",
    UPDATE_LIVE_PHOTOS_STATUS: "/dao/api/admin/live-photos/update-status",
    UPDATE_ACCOUNT_PERSONAL_DETAILS_STATUS:
      "/dao/api/admin/account-personal-details/update-status",
    UPDATE_NOMINEES_STATUS: "/dao/api/admin/nominees/update-status",
    //clicking on the view button in the admin dashboard
    GET_FULL_APPLICATION_DETAILS: (id) => `/admin/application-details/${id}`,
    // Add these for Reviews applications
    GET_ALL_REVIEW_APPLICATIONS: "/dao/api/admin/applications/rejected/Review",

    GET_REVIEW_APPLICATIONS_DETAILS_BY_AGENT: (agentId) =>
      `/dao/api/admin/reviewApplicationDetails/${agentId}`,
    GET_APPROVED_APPLICATIONS_DETAILS_BY_AGENT: (agentId) =>
      `/dao/api/admin/approvedApplicationDetails/${agentId}`,
    GET_PENDING_APPLICATIONS_DETAILS_BY_AGENT: (agentId) =>
      `/dao/api/admin/pendingApplicationDetails/${agentId}`,
    GET_REJECTED_APPLICATIONS_DETAILS_BY_AGENT: (agentId) =>
      `/dao/api/admin/applications/rejected/agent/${agentId}/rejected`,

    // Add these for kyc review applications
    GET_ALL_KYC_REVIEW_APPLICATIONS: "/dao/api/admin/kycReviewApplication",

    // /// By ankitka
    APPROVED_ENROLLMENT_LIST: "/dao/api/admin/approvedApplication",
    GET_DETAILS_BY_APPLICATION_ID: (id) =>
      `/dao/api/agent/full-application-details/${id}`,
    // total application count by agent
    REVIEW_APPLICATION_COUNT_BY_AGENT: "dao/api/admin/reviewApplicationCount",
    APPROVED_APPLICATION_COUNT_BY_AGENT:
      "dao/api/admin/approvedApplicationCount",
    PENDING_APPLICATION_COUNT_BY_AGENT: "dao/api/admin/pendingApplicationCount",
    REJECTED_APPLICATION_COUNT_BY_AGENT:
      "dao/api/admin/applications/rejected/count-by-agent",

    KYC_REVIEW_APPLICATION_COUNT_BY_AGENT: "dao/api/kyc/review/count-by-agent",
    KYC_APPROVED_APPLICATION_COUNT_BY_AGENT:
      "dao/api/kyc/approved/count-by-agent",
    KYC_PENDING_APPLICATION_COUNT_BY_AGENT:
      "dao/api/admin/kyc/pending/count-by-agent",
    KYC_REJECTED_APPLICATION_COUNT_BY_AGENT:
      "dao/api/admin/kyc/rejected/count-by-agent",

    //////////For DAshboard Admin
    MONTHLY_LINE_CHART: "dao/api/admin/kyc-applications/approved/monthly",
    MONTHLY_AUTH_BARCHART: "dao/api/admin/applications/approved/monthly-auth",
    WEEKLY_AUTH_BARCHART: "dao/api/admin/applications/approved/weekly-auth",
    KYC_STATUS_FOR_CURRENT_YEAR:
      "dao/api/admin/kyc-applications/status-summary",
  },

  // om data above
  PINCODE: {
    GET: (id, id2) => `/loan/pincode/${id}/${id2}`,
    GET_COUNTRI: `/loan/pincode/countries`,
    GET_PINCODE: (id) => `/loan/pincode/pincodes?country=${id}`,
  },
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
};
 