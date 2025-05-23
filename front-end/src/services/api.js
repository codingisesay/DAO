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



  ADMIN: {},


  DASHBOARD: {
    ACCOPENED: "/loan/accounts/counts",
    ACCCLOSED: "/loan/accounts/close-counts",
    EMIDUE: "/loan/repayments/emi/due/month",
    LOANDISBERSMENTINSIGHTS: "/loan/transaction/loan/disbursement/insights",
    REPAYMENTSPRINCIPLE: "/loan/repayments/principle",
    REPAYMENTSINTEREST: "/loan/repayments/interest",
    ORNAMENTS: "/loan/repayments/ornaments",
    NEWLOANSANCTION: "/loan/accounts/new/loan/sanction",
    EMIDUELIST: "/loan/repayments/emi/due/list",
    LOANPOTFOLIO: "loan/repayments/gold/loan/portfolio",
  },

  OVERDUEDASHBOARD: {
    MATURITYPATTERN: "/loan/repayments/maturity/pattern",
    DISBURSEDAMOUNTTREND: "/loan/repayments/disbursement/amount/trends",
    TOTELPLLEDGE: "loan/api/gold/graph/monthly",
    MONTHLYNPATRENDS: "loan/repayments/month/npa/trends",
    DEFAUULTERANDNPA: "loan/repayments/defaulter/npa",
    OVERDUELOANS: "loan//repayments/overdue/loan",
    KILOGRAM: "loan/api/gold/amount/kilogram",
  },

  STOCK: {
    CREATE: "loan/inventory/create",
    // GETALLSTOCK: (id, id1) =>
    //   `loan/inventory/pagination?page=${id}&size=${id1}`,
    GET_BY_ID: (id) => `loan/inventory/get/${id}`,
    UNAPPROVE: (id, id1) =>
      `/loan/inventory/unauthorized?page=${id}&size=${id1}`,
    SEARCH: ({ effectiveDate, page = 0, size = 10 }) => {
      const queryParams = new URLSearchParams({
        ...(effectiveDate && { effectiveDate }),
        page,
        size,
      }).toString();

      return `/loan/inventory/pagination?${queryParams}`;
    },
    UPDATE: (id) => `loan/inventory/update/${id}`,
    APPROVE: (id) => `/loan/inventory/approve/${id}`,
  },

  ISSUE: {
    FETCHFROM: "loan/inventory/range",
    CHECKAVAILIBITY: "loan/inventory/check-stock-availability",
    CREATE: "loan/inventory/issue/update-branch",
    VIEW: (id, id2, id3, id4) =>
      `loan/inventory/issues/packetrange/${id}/${id2}?page=${id3}&size=${id4}`,
    SEARCH: ({
      minPacketNo,
      maxPacketNo,
      effectiveDate,
      page = 0,
      size = 10,
    }) => {
      const queryParams = new URLSearchParams({
        page,
        size,
        ...(minPacketNo && { minPacketNo }),
        ...(maxPacketNo && { maxPacketNo }),
        ...(effectiveDate && { effectiveDate }),
      }).toString();

      return `/loan/inventory/issues/branch/pagination?${queryParams}`;
    },
  },

  SUBLOANDASHBOARD: {
    SUMMERY: "loan/cbs-subLoan/account/summary",
    ORNAMENTSCOUNT: "loan/cbs-subLoan/ornament-counts",
    WEIGHTOFGOLD: "/loan/cbs-subLoan/weight-summary",
    GETACCNO: (id) => `/loan/accounts/module-type/${id}`,
    ACCOUNTWISEDETAILS: (accountNo) =>
      `/loan/cbs-subLoan/account/wise/details/${accountNo}`,
  },

  BRANCH: {
    CREATE: "/auth/branches",
    GET_ALL: (id, id1) => `/auth/branches?page=${id}&size=${id1}`,
    GET_BY_ID: (id) => `/auth/branches/${id}`,
    UPDATE: (id) => `/auth/branches/${id}`,
    DELETE: (id) => `/auth/branches/${id}`,
    GETBRANCH: `/auth/branches/list`,
    BRANCH_DUPLICATION: (id) => `/auth/branches/check-duplicate/${id}`,
    SEARCH: ({ branchCode, branchName, city, state, page = 0, size = 10 }) => {
      const queryParams = new URLSearchParams({
        ...(branchCode && { branchCode }),
        ...(branchName && { branchName }),
        ...(city && { city }),
        ...(state && { state }),
        page,
        size,
      }).toString();

      return `/auth/branches/search?${queryParams}`;
    },
  },
  BANK: {
    CREATE: "/auth/banks",
    GET_ALL: "/auth/banks",
    GET_BY_ID: (id) => `/auth/banks/${id}`,
    UPDATE: (id) => `/auth/banks/${id}`,
    DELETE: (id) => `/auth/banks/${id}`,
  },
  PRODUCT: {
    CREATE: "/loan/products",
    GET_ALL: (id, id1) => `/loan/products?page=${id}&size=${id1}`,
    // GET_BROWSE:(id) `/loan/products/browse?productCode=${id}`,
    GET_BY_ID: (id) => `/loan/products/${id}`,
    UPDATE: (id) => `/loan/products/${id}`,
    DELETE: (id) => `/loan/products/${id}`,
    PRODUCT_DUPLICATION_CHECK: (id) => `/loan/products/check-duplicate/${id}`,
    UNAPPROVE: (id, id1) =>
      `/loan/products/unauthorized?page=${id}&size=${id1}`,
    APPROVE: (id) => `/loan/products/authorize/${id}`,
    SEARCH: ({
      productCode,
      productName,
      page = 0,
      size = 10,
      sortField,
      sortOrder,
    }) => {
      const queryParams = new URLSearchParams({
        ...(productCode && { productCode }),
        ...(productName && { productName }),
        page,
        size,
        sortField,
        sortOrder,
      }).toString();
      return `/loan/products/search?${queryParams}`;
    },
  },

  PRODUCTINTEREST: {
    CREATE: "/loan/product-interest-params",
    GET_ALL: (id, id1) =>
      `/loan/product-interest-params?page=${id}&size=${id1}`,
    GET_BY_ID: (id1, id2) => `/loan/product-interest-params/${id1}/${id2}`,
    UPDATE: (id1, id2) => `/loan/product-interest-params/${id1}/${id2}`,
    UNAPPROVE: (id, id1) =>
      `/loan/product-interest-params/unauthorized?page=${id}&size=${id1}`,
    APPROVE: (id1, id2) =>
      `/loan/product-interest-params/authorize/${id1}/${id2}`,
    PROD_PARAM_DUPLICATION_CHECK: (id1, id2) =>
      `/loan/product-interest-params/check-duplicate/${id1}/${id2}`,
    SEARCH: ({ branchCode, productCode, productName, page = 0, size = 10 }) => {
      const queryParams = new URLSearchParams({
        ...(branchCode && { branchCode }),
        ...(productCode && { productCode }),
        ...(productName && { productName }),
        page,
        size,
      }).toString();
      return `/loan/product-interest-params/search?${queryParams}`;
    },
  },

  PRODUCTINTERESTENTITY: {
    CREATE: "/loan/product/interests",
    GET_ALL: (id, id1) => `/loan/product/interests?page=${id}&size=${id1}`,
    GET_BY_ID: (id1, id2) => `/loan/product/interests/${id1}/${id2}`,
    INTEREST_UPDATE: (id1, id2) => `/loan/product/interests/${id1}/${id2}`,
    INTEREST_DUPLICATION_CHECK: (id1, id2) =>
      `/loan/product/interests/check-duplicate/${id1}/${id2}`,
    UNAPPROVE: "/loan/interest-details/unauthorized",
    SEARCH: ({ productCode, effectiveDate, page = 0, size = 10 }) => {
      const queryParams = new URLSearchParams({
        ...(productCode && { productCode }),
        ...(effectiveDate && { effectiveDate }),
        page,
        size,
      }).toString();
      return `/loan/product/interests/search?${queryParams}`;
    },
  },

  TAX_MASTER: {
    CREATE: "/loan/taxes",
    GET_ALL: (id, id1) => `/loan/taxes?page=${id}&size=${id1}`,
    GET_BY_ID: (id, id1) => `/loan/taxes/${id}/${id1}`,
    TAX_DUPLICATE: (id1, id2) => `/loan/taxes/check-duplicate/${id1}/${id2}`,
    UPDATE: (id, id1) => `/loan/taxes/${id}/${id1}`,
    DELETE: (id) => `/loan/taxes/${id}`,
    SEARCH: ({ taxType, description, page = 0, size = 10 }) => {
      const queryParams = new URLSearchParams({
        ...(taxType && { taxType }),
        ...(description && { description }),
        page,
        size,
      }).toString();
      return `/loan/taxes/search?${queryParams}`;
    },
    GET: "/loan/taxes/by-operation-date",
  },

  RATE: {
    CREATE: "/loan/rates",
    GET_ALL: (id, id1) => `/loan/rates?page=${id}&size=${id1}`,
    GET_BY_ID: (id, id1, id2) => `/loan/rates/${id}/${id1}/${id2}`,
    UPDATE: (id, id1, id2) => `/loan/rates/${id}/${id1}/${id2}`,
    DELETE: (id) => `/loan/rates/${id}`,
    GETRATE: `/loan/schemes/list`,
    SEARCH: ({ schemeCode, effectiveDate, page = 0, size = 10 }) => {
      const queryParams = new URLSearchParams({
        ...(schemeCode && { schemeCode }),
        ...(effectiveDate && { effectiveDate }),
        page,
        size,
      }).toString();
      return `/loan/rates/search?${queryParams}`;
    },
    RATE_DUPLICATE: (id, id1, id2) =>
      `/loan/rates/check-duplicate/${id}/${id1}/${id2}`,
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

  CHARGE_MASTER: {
    CREATE: "/loan/charges",
    GET_ALL: (id, id1) => `/loan/charges-details/all?page=${id}&size=${id1}`,
    GET_BY_ID: (id, id1) => `/loan/charges-details/${id}/${id1}`,
    UPDATE: (id, id1) => `/loan/charges-details/${id}/${id1}`,
    // GETTAX: `/loan/taxes/by-operation-date`,
    CHARGE_DUPLICATE: (chargeCode, effectiveDate) =>
      `/loan/charges-details/check-duplicate/${chargeCode}/${effectiveDate}`,
    SEARCH: ({
      branchCode,
      chargeCode,
      chargeDescription,
      page = 0,
      size = 10,
    }) => {
      const queryParams = new URLSearchParams({
        ...(branchCode && { branchCode }),
        ...(chargeCode && { chargeCode }),
        ...(chargeDescription && { chargeDescription }),
        page,
        size,
      }).toString();
      return `/loan/charges-details/search?${queryParams}`;
    },
  },

  DAY_PROCESS: {
    GET_ALL: "/loan/day/process/handover/summary",
    UPDATE: "/loan/day/process/handover/submit",
  },
  DAY_BEGIN: {
    CREATE: "/loan/day/process/day/begin/process",
    GET: "/loan/day/process/fetch/day/begin",
  },

  DAY_END: {
    CREATE: "/loan/day/process/day/end/process",
    GET: "/loan/day/process/fetch/day/end",
  },
  ACCOUNT: {
    ACCTNUMFORMAT: (productCode, effectiveDate, schemeCode) =>
      `/loan/accounts/generateAccountPrefix?productCode=${productCode}&effectiveDate=${effectiveDate}&schemeCode=${schemeCode}`,
    EXISTBYACCTNO: (accountPrefix, accountNumber, edate) =>
      `/loan/accounts/checkAccountNumber?accountPrefix=${accountPrefix}&serialNo=${accountNumber}&effectiveDate=${edate}`,
    CREATE: "/loan/accounts",
    GET_ALL: (id, id1) => `/loan/accounts?page=${id}&size=${id1}`,
    GET_BY_ID: (id) => `/loan/accounts/${id}`,
    UPDATE: (id) => `/loan/accounts/${id}`,
    DELETE: (id) => `/loan/accounts/${id}`,
    UNAPPROVE: (id, id1) =>
      `/loan/accounts/unauthorized?page=${id}&size=${id1}`,
    APPROVE: (id) => `/loan/accounts/authorize/${id}`,
    BALANCE: (id) => `/loan/accounts/${id}/closing-balance`,
    SEARCH: ({
      accountNo,
      customerNo,
      accountName,
      productCode,
      schemeCode,
      moduleTypes, // ✅ Add this
      page = 0,
      size = 10,
    }) => {
      const queryParams = new URLSearchParams({
        ...(accountNo && { accountNo }),
        ...(customerNo && { customerNo }),
        ...(accountName && { accountName }),
        ...(productCode && { productCode }),
        ...(schemeCode && { schemeCode }),
        page,
        size,
      });

      // ✅ Append moduleTypes array as repeated query params
      if (Array.isArray(moduleTypes)) {
        moduleTypes.forEach((mt) => {
          if (mt !== null && mt !== undefined) {
            queryParams.append("moduleTypesStr", mt);
          }
        });
      }

      return `/loan/accounts/search?${queryParams.toString()}`;
    },

    GETPLEDGED: (id) => `/loan/accounts/loan-details/${id}`,
    ACCOUNT_NOT_MODULETYPE_LOOKUP: (id) =>
      `/loan/accounts/not-module-type/${id}`,
    ACCOUNT_MODULETYPE: (id) => `/loan/accounts/module-type/${id} `,
  },

  //Role Master
  ROLE: {
    CREATE: "/loan/roles",
    GET_ALL: (id, id1) => `/loan/roles?page=${id}&size=${id1}`,
    GET_BY_ID: (id) => `/loan/roles/${id}`,
    UPDATE: (id) => `/loan/roles/${id}`,
    DELETE: (id) => `/loan/roles/${id}`,
    ROLE_DUPLICATION: (role) => `/loan/roles/check-duplicate/${role}`,
    SEARCH: ({ role, description, page = 0, size = 10 }) => {
      const queryParams = new URLSearchParams({
        ...(role && { role }),
        ...(description && { description }),
        page,
        size,
      }).toString();
      return `/loan/roles/search?${queryParams}`;
    },
  },

  ACTIVITY: {
    CREATE: "/loan/activity",
    GET_ALL: (id, id1) => `/loan/activity?page=${id}&size=${id1}`,
    GET_BY_ID: (id) => `/loan/activity/${id}`,
    UPDATE: (id) => `/loan/activity/${id}`,
    MAINACTIVITY: "/loan/activity/main/list",
    DELETE: (id) => `/loan/activity/${id}`,
    ROLE_DUPLICATION: (role) => `/loan/activity/check-duplicate/${role}`,
    SEARCH: ({ activity, name, page = 0, size = 10 }) => {
      const queryParams = new URLSearchParams({
        ...(activity && { activity }),
        ...(name && { name }),
        page,
        size,
      }).toString();
      return `/loan/activity/search?${queryParams}`;
    },
  },

  CBS: {
    GET_ALL: (id) => `/loan/cbs-info/${id}`,
    PREVIEW: "/loan/excel-upload/preview",
    SAVE: (id, id1) => `/loan/excel-upload/save/${id}/${id1}`,
    SEARCH: ({ accountNo, excelFileName, page = 0, size = 10 }) => {
      const queryParams = new URLSearchParams({
        ...(accountNo && { accountNo }),
        ...(excelFileName && { excelFileName }),
        page,
        size,
      }).toString();
      return `/loan/excel-upload/search?${queryParams}`;
    },
    FETCH: (id, id1) =>
      `/loan/excel-upload/fetch?accountNo=${id}&excelFileName=${id1}`,
    UNAPPROVE: (page, size, sortField = "uploadDate", sortOrder = "asc") =>
      `/loan/excel-upload/search-unapproved?page=${page}&size=${size}&sortField=${sortField}&sortOrder=${sortOrder}`,
    Approve: (id) => `/loan/excel-upload/approve/${id}`,
  },

  CUSTOMER: {
    CREATE: "/loan/cust",
    GET_ALL: "/loan/cust",
    GET_BY_ID: (id) => `/loan/cust/${id}`,
    UPDATE: (id) => `/loan/cust/${id}`,
    DELETE: (id) => `/loan/cust/${id}`,
    List: "/loan/cust/list",
  },

  ROLEACCESS: {
    CREATE: "/loan/role-access/create-all",
    GET_ALL: (id) => `/loan/role-access/enriched/${id}`,
    GET_BY_ID: (id) => `/loan/role-access/${id}`,
    UPDATE: (id) => `/loan/role-access/${id}`,
    DELETE: (id) => `/loan/role-access/${id}`,
    SEARCH: ({ roleCode, page = 0, size = 10 }) => {
      const queryParams = new URLSearchParams({
        ...(roleCode && { roleCode }),
        page,
        size,
      }).toString();
      return `/loan/role-access/search?${queryParams}`;
    },
  },

  LOOKUPSERVICES: {
    ROLEACCESS_ROLETYPE: () => `/loan/roles/list`,
    ROLEACCESS_ACTIVITY: (id) => `/loan/role-access/missing-activities/${id}`,
  },
  CUSTOMER_CREATION: {
    CREATE: "/loan/cust/create",
    GET_ALL: (id, id1) => `/loan/cust?page=${id}&size=${id1}`,
    GET_BY_ID: (id) => `/loan/cust/browse/${id}`,

    UPDATE: (id) => `/loan/cust/create/${id}`,
    DELETE: (id) => `/loan/cust/create/${id}`,
    UNAPPROVE: (id, id1) => `/loan/cust/unauthorized?page=${id}&size=${id1}`,
    Approve: (id) => `/loan/cust/authorize/${id}`,

    UPDATE: (id) => `/loan/cust/update/${id}`,
    DELETE: (id) => `/loan/cust/create/${id}`,
    GETPLEDGED: (id) => `/loan/cust/pledge/${id}`,
    SEARCH: ({
      customerNo,
      fullName,
      mobileNo,
      panNo,
      aadharNo,
      page = 0,
      size = 10,
    }) => {
      const queryParams = new URLSearchParams({
        ...(customerNo && { customerNo }),
        ...(fullName && { fullName }),
        ...(mobileNo && { mobileNo }),
        ...(panNo && { panNo }),
        ...(aadharNo && { aadharNo }),
        page,
        size,
      }).toString();
      return `/loan/cust/search?${queryParams}`;
    },
  },

  LOOKUPSERVICES: {
    ROLEACCESS_ROLETYPE: () => `/loan/roles/list`,
    ROLEACCESS_ACTIVITY: (id) => `/loan/role-access/missing-activities/${id}`,
  },

  LOOKUPSERVICES: {
    ROLEACCESS_ROLETYPE: () => `/loan/roles/list`,
    ROLEACCESS_ACTIVITY: (id) => `/loan/role-access/missing-activities/${id}`,
  },
  LOAN_APPLICATION: {
    CREATE: "/loan/applications/create",
    UPDATE: "/loan/applications/update",
    GET_ALL: (id, id1) => `/loan/applications?page=${id}&size=${id1}`,
    GET_BY_ID: (id) => `/loan/applications/${id}`,
    UNAPPROVE: (id, id1) =>
      `/loan/applications/unauthorized?page=${id}&size=${id1}`,
    Approve: (id) => `/loan/accounts/${id}/authorize`,
    SEARCH: ({
      applicationNo,
      customerNo,
      customerName,
      productCode,
      schemeCode,
      page = 0,
      size = 10,
    }) => {
      const queryParams = new URLSearchParams({
        ...(applicationNo && { applicationNo }),
        ...(customerNo && { customerNo }),
        ...(customerName && { customerName }),
        ...(productCode && { productCode }),
        ...(schemeCode && { schemeCode }),
        page,
        size,
      }).toString();

      return `/loan/applications/search?${queryParams}`;
    },
  },

  SCHEME: {
    CREATE: "/loan/schemes",
    GET_ALL: (id, id1) => `/loan/schemes?page=${id}&size=${id1}`,
    GET_BY_ID: (id) => `/loan/schemes/${id}`,
    UPDATE: (id) => `/loan/schemes/${id}`,
    DELETE: (id) => `/loan/schemes/${id}`,
    SCHEME_DUPLICATION: (id) => `/loan/schemes/check-duplicate/${id}`,
    SEARCH: ({
      schemeCode,
      schemeName,
      effectiveDate,
      page = 0,
      size = 10,
    }) => {
      const queryParams = new URLSearchParams({
        ...(schemeCode && { schemeCode }),
        ...(schemeName && { schemeName }),
        ...(effectiveDate && { effectiveDate }),
        page,
        size,
      }).toString();
      return `/loan/schemes/search?${queryParams}`;
    },
  },

  LOOKUPS_CHARGE: {
    CHARGE_LOOKUP: `/loan/charges-details/list`,
  },

  LOOKUPS_SERVICE: {
    CHARGE_LOOKUP: (id) => `/loan/charges-details/list/${id}`,
    SCHEME_BY_PRODUCT: (id1, id2) =>
      `/loan/schemes/list-by-product-and-expiry/${id1}/greater/${id2}`,
    PRODUCT_MODULETYPE_LOOKUP: (id) => `/loan/products/module-type/${id}`,
    PRODUCT_NOT_MODULETYPE_LOOKUP: (id) =>
      `/loan/products/not-module-type/${id}`,
    CUSTOMER_BROWSE: (id) => `/loan/cust/browse/${id}`,
    INTEREST_RATE: (productCode, periodMonth, periodDay, effectiveDate) =>
      `/loan/interest-details/nearest/${productCode}/${periodMonth}/${periodDay}/${effectiveDate}`,
    RATE_PRE_GRAM: (schemeCode, effectiveDate, itemnature) =>
      `/loan/rates/nearest-with-scheme/${schemeCode}/${effectiveDate}/${itemnature}`, // /greater/${effectiveDate}
  },

  TRANSACTION_PROCESS: {
    DAY_END_CHECK: "/loan/transaction/day/end/check",
    ACCOUNTS_NUMEBR_LIST: "/loan/accounts/list",
    CREATEVIEW: "/loan/transaction/view",
    CREATEPROCESS: "/loan/transaction/process",
    VALIDATESERVICE: (activity, acctno) =>
      `/loan/transaction/validate/account/${activity}/${acctno}`,
    GET_ALL: (id, id1) => `/loan/transaction/by-branch?page=${id}&size=${id1}`,
    GETDETAILSTRANSFER: (txnNo, entryDate, batchCode) =>
      `/loan/transaction/browse?txnNo=${txnNo}&entryDate=${entryDate}&batchCode=${batchCode}`,
    APPROVE_TRANSFER: (txnNo, entryDate, batchCode, branchCode) =>
      `/loan/transaction/authorize?txnNo=${txnNo}&=entryDate=${entryDate}&batchCode=${batchCode}&branchCode=${branchCode}`,
    CANCEL_TRANSFER: (txnNo, entryDate, batchCode, branchCode, data) =>
      `/loan/transaction/cancel?txnNo=${txnNo}&=entryDate=${entryDate}&batchCode=${batchCode}&branchCode=${branchCode}&cancelReason=${data}`,
    Add_MORE_TRANSACTION: (txnNo, branchCode, entryDate, batchCode) =>
      `/loan/transaction/check?txnNo=${txnNo}&branchCode=${branchCode}&entryDate=${entryDate}&batchCode=${batchCode}`,
    UNAPPROVE: (id, id1) =>
      `/loan/transaction/by-branch/unauthorize?page=${id}&size=${id1}`,
    SEARCH: ({
      branchCode,
      entryDate,
      txnNo,
      accountNo,
      page = 0,
      size = 10,
    }) => {
      const queryParams = new URLSearchParams({
        ...(branchCode && { branchCode }),
        ...(entryDate && { entryDate }),
        ...(txnNo && { txnNo }),
        ...(accountNo && { accountNo }),
        page,
        size,
      }).toString();
      return `/loan/transaction/search?${queryParams}`;
    },
    PACKET_AMOUNT: (id, id1) =>
      `/loan/cbs-info/loan-amount?accountNo=${id}&packetNo=${id1}`,
  },

  LOOKUPS: {
    CREATE: "/auth/api/lookup/create",
    GET_ALL: "/auth/api/lookup/all",
    GET_BY_ID: (id) => `/auth/api/lookup/browse/${id}`,
    UPDATE: (id) => `/auth/api/lookup/update/${id}`,
    SEARCH: ({ codeType, codeDesc, page = 0, size = 10 }) => {
      const queryParams = new URLSearchParams({
        ...(codeType && { codeType }),
        ...(codeDesc && { codeDesc }),

        page,
        size,
      }).toString();
      return `/auth/api/lookup/search?${queryParams}`;
    },
    LOOKUP_DUPLICATION: (codeType) =>
      `/auth/api/lookup/check-duplicate/${codeType}`,
  },

  EXCEPTION: {
    CREATE: "/loan/role-exceptions",
    GET_ALL: (id, id1) => `/loan/role-exceptions?page=${id}&size=${id1}`,
    GET_BY_ID: (id, id1) => `/loan/role-exceptions/${id}/${id1}`,
    UPDATE: (id, id1) => `/loan/role-exceptions/${id}/${id1}`,
    SEARCH: ({ role, exceptionCode, page = 0, size = 10 }) => {
      const queryParams = new URLSearchParams({
        ...(role && { role }),
        ...(exceptionCode && { exceptionCode }),

        page,
        size,
      }).toString();
      return `/loan/role-exceptions/search?${queryParams}`;
    },
  },

  LICENCE: {
    CREATE: "loan/register",
  },

  PINCODE: {
    GET: (id, id2) => `/loan/pincode/${id}/${id2}`,
    GET_COUNTRI: `/loan/pincode/countries`,
    GET_PINCODE: (id) => `/loan/pincode/pincodes?country=${id}`,
  },

  INTERESTCALCULATION: {
    CREATE: (date, mode) =>
      `/loan/interest/month/interest/calculation/pdf?date=${date}&mode=${mode}`,
  },

  BALANCESHEET: {
    GET: (id, id1) => `/loan/interest/summary?date=${id}&moduleType=${id1}`,
    GETINTEREST: (id, id1, id2) =>
      `/loan/report/interest/application?endDate=${id}&mode=${id1}&branchCode=${id2}`,
    GETOVERDUE: (id, id1, id2) =>
      `/loan/report/details?productCode=${id}&status=${id1}&overdueDate=${id2}`,
    GETJOTTINGR: (productCode, status, toDate) =>
      `/loan/report/jotting/report?productCode=${productCode}&status=${status}&toDate=${toDate}`,
    GETJOTTING: (productCode, status, toDate, page, size) =>
      `/loan/report/jotting/pageination?productCode=${productCode}&status=${status}&toDate=${toDate}&page=${page}&size=${size}`,
    GETSTATEMENT: (id, id1, id2) =>
      `/loan/report/statemenetofaccount?accountNo=${id}&startDate=${id1}&endDate=${id2}`,
    SOCLOAN: (page, size) =>
      `/loan/cbs-subLoan/report?page=${page}&size=${size}`,
  },

  TOPUPPARTRELESE: {
    CREATE: "/loan/transaction/account/part/topup/release/process",
  },
};
