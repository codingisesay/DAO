export const AUTH_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_CODE: 'userCode',
    USER_NAME: 'userName',
    BRANCH_CODE: 'branchCode',
    BRANCH_NAME: 'branchName',
    LOOKUPS_ARRAY: 'lookupsArray',
    SUBSCRIPTION_INFO: 'subscriptionInfo',
    OPERATION_DATE:'operationDate', 
    BANK_CODE: 'bankCode',
    BANK_NAME: 'bankName',
    LAST_LOGIN_DATE: 'lastLogin',
    ROLE_ACCESS_DATA: 'roleAccess',
    ROLE_NAME: 'roleName',
};


export const setAuthData = (data) => { 
    Object.entries(data).forEach(([key, value]) => { 
        if(key === 'subscriptionInfo'){
            localStorage.setItem(AUTH_KEYS.SUBSCRIPTION_INFO, JSON.stringify(value));
        }
        else if(key === 'lookups'){
            localStorage.setItem(AUTH_KEYS.LOOKUPS_ARRAY, JSON.stringify(value));
        } else if(key === 'roleAccess'){
            localStorage.setItem(AUTH_KEYS.ROLE_ACCESS_DATA, JSON.stringify(value));
        }
        else{
            localStorage.setItem(key, value);
        } 
    });
    
}; 