import  api  from "../utils/storage";
import { API_ENDPOINTS } from "../services/api";
import { setAuthData } from "../services/authService";

export const loginUser = async (userCode, password, loginBranchId) => {
  try {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      userCode,
      password,
      loginBranchId,
    });

    setAuthData({
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      userCode: response.data.userCode,
      userName: response.data.userName,
      branchCode: response.data.branchCode,
      branchName: response.data.branchName,
      lookups: response.data.lookups,
      subscriptionInfo: response.data.subscriptionInfo,
      operationDate: response.data.operationDate,
      bankCode: response.data.bankCode,
      bankCode: response.data.bankCode,
      bankName: response.data.bankName,
      lastLogin: response.data.lastLogin,
      roleAccess: response.data.roleAccess,
      roleName: response.data.roleName,
    });

    return response.data;
  } catch (error) {
    console.log( 'my print : ', error)
    throw   error.response?.data  || error.data || error.message ||  'Login Failed';
  }
};

export const getLookupValue = (type, code) => {
  const lookups = JSON.parse(localStorage.getItem("lookups"));
  const lookup = lookups?.[type]?.find((item) => item.code === code);
  return lookup?.value || code;
};
