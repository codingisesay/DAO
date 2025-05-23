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

export const forgotpass = {
  forgotPass: (identifier) =>
    apiService.post(API_ENDPOINTS.AUTH.FORGOTPASS(identifier)),

  otpverify: (identifier, otp) =>
    apiService.post(API_ENDPOINTS.AUTH.OTPVERIFY(identifier, otp)),

  setpass: (identifier, newPassword) =>
    apiService.post(API_ENDPOINTS.AUTH.SETPASS(identifier, newPassword)),
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
