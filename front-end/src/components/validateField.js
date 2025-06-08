import { pattern } from "framer-motion/client";

export const VALIDATION_PATTERNS = {
    TEXT_ONLY: {
        pattern: /^[A-Za-z\s]*$/,
        message: "Only alphabets allowed",
    },
    NUMBER_ONLY: {
        pattern: /^[0-9]*$/,
        message: "Only numbers allowed",
    },
    EMAIL: {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: "Please enter a valid email address (e.g., user@example.com)",
    },
    PHONE: {
        pattern: /^[0-9]*$/,
        message: "Invalid phone number",
    },
    PAN: {
        pattern: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
        message: "e.g.ABCDE1234F",
        // message: "Please enter a valid PAN number (e.g., ABCDE1234F)",/
    },
    ALPHANUMERIC: {
        pattern: /^[A-Za-z0-9\s]*$/,
        message: "Only letters and numbers allowed",
    },
    ALL_CAPITAL: {
        pattern: /^[a-zA-Z\s]*$/,
        message: "Only capital letters and spaces allowed",
    },
    LOGIN_CODE: {
        pattern: /^[A-Za-z0-9]*$/,
        message: "No special characters or spaces allowed",
    },
    PASSWORD: {
        pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@\#$&\-_])[A-Za-z0-9\s@\#$&\-_]*$/,
        message:
            "Minimum 8 characters, at least one letter and one number eg. Abcd@123",
    },
    DECIMAL: {
        pattern: /^\d*(\.\d{1,2})?$/, // Allows up to 2 decimal places
        message: "Only numeric values allowed (up to 2 decimal places)",
    },
    AMOUNT: {
        pattern: /^\d{1,15}(\.\d{1,2})?$/,
        message:
            "Invalid amount. Only up to 12 digits before decimal and 2 decimal places allowed",
    },
    PERCENTAGE: {
        pattern: /^(100(\.0{1,2})?|[0-9]{1,2}(\.[0-9]{1,2})?)$/,
        message:
            "Invalid percentage format. Must be between 0 and 100 with up to 2 decimal places",
    },
    ACCOUNT_NUMBER: {
        pattern: /^[A-Za-z0-9]+$/,
        message: "Account number must be between 9 and 20 digits",
    },
    ALPHABETS_AND_SPACE: {
        pattern: /^[A-Za-z\s]*$/,
        message: "Only alphabets and spaces allowed",
    },

    GRADE: {
        pattern: /^[A-F][+-]?$/,
        message:
            "Invalid grade format. Must be A, B, C, D, E, F with optional + or -",
    },
    IFSC_CODE: {
        pattern: /^[A-Za-z0-9]*$/,
        message: "Special Characters are not allowed.",
    },
    TAN: {
        pattern: /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/,
        message: "Invalid TAN format.(e.g., ABCD12345E)",
    },
    REGISTRATION_NO: {
        pattern: /^[a-zA-Z0-9_\/\\-]*$/,
        message: "Only letters, numbers, and _ / \\ - characters allowed",
    },

    EVERYTHING: {
        pattern: /^.*$/,
    },
    DATE: {
        pattern: /^\d{4}-\d{2}-\d{2}$/,
        message: "Invalid date format. Use YYYY-MM-DD",
    },
    DAY: {
        pattern: /^(?:[0-9]|[12][0-9]|3[01])$/,
        message: "Day should be between 0 to 31",
    },
    DRIVINGLICENCE: {
        pattern: /^[A-Z]{2}\d{2}\s\d{11}$/,
        // message: "e.g., 'RJ19 20190012345",
        message: "",
    },
    // All: {
    //   pattern: '/.*/',
    //   // message:""
    // }
};

export const validateField = (fieldName, value, required = false) => {
    // If the field is required but empty, return error
    if (required && (!value || value.toString().trim() === "")) {
        return " is required";
    }

    // Check if the field has a validation pattern defined
    if (VALIDATION_PATTERNS[fieldName]) {
        const { pattern, message } = VALIDATION_PATTERNS[fieldName];
        if (!pattern.test(value)) {
            return message;
        }
    }

    return ""; // No error
};
