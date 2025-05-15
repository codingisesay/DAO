export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = (error) => {
  if (error.response) {
    console.log("Response Error:-", error.response)
    throw new ApiError(
      error.response.data || 'Server Error',
      error.response.status,
      error.response.data
    );
  }
  throw new ApiError(error.message || 'Network Error', 500);
};