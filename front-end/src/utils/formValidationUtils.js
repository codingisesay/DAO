// src/utils/formValidationUtils.js

/**
 * Checks if the form is valid based on field values and their corresponding errors.
 * @param {Object} formData - An object containing all form field values.
 * @param {Object} validationErrors - An object containing all validation errors.
 * @returns {boolean} - True if the form is valid, false otherwise.
 */
export const isFormValid = (formData, validationErrors) => {
  const missingFields = [];
  const errorFields = [];

  // Check for missing fields
  // Object.entries(formData).forEach(([field, value]) => {
  //   if (value === null || value === undefined || value.toString().trim() === '') {
  //     missingFields.push(field);
  //   }
  // });

  // Check for fields with validation errors
  Object.entries(validationErrors).forEach(([field, error]) => {
    if (error !== '') {
      errorFields.push({ field, error });
    }
  });

  // Log the missing and error fields

  /*if (missingFields.length > 0) {
    console.log("Missing Fields:", missingFields);
    alert(missingFields.toString());
  }*/


  if (errorFields.length > 0) {
    console.log("Fields with Validation Errors:", errorFields);
    alert("Please correct the fields with validation errors.", errorFields);
  }

  // Return true if no missing fields and no validation errors
  return  errorFields.length === 0;


}