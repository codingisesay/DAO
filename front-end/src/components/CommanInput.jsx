import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { validateField, VALIDATION_PATTERNS } from "./validateField";

const CommanInput = ({
    label,
    name,
    value = '',
    onChange,
    type = 'text',
    required = false,
    className = '',
    validationType,
    errorMessage,
    onValidation,
    max,
    disabled,
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(value?.toString().length > 0);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const input = document.getElementById(name);
            if (input && input.value) {
                setHasContent(true);
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [name]);

    useEffect(() => {
        setHasContent(value?.toString().length > 0);
    }, [value]);

    useEffect(() => {
        // Only validate if the field has been touched
        if (touched && validationType) {
            const validationError = validateField(
                validationType,
                value,
                required
            );
            setError(validationError);

            if (onValidation) {
                onValidation(name, !validationError);
            }
        }
    }, [value, validationType, required, name, onValidation, touched]);

    const shouldFloat = isFocused || hasContent;

    const handleChange = (e) => {
        const newValue = e.target.value;

        if (max && newValue.length > max) {
            return;
        }

        if (onChange) {
            onChange(e);
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        setTouched(true); // Mark as touched when field loses focus
    };

    return (
        <div className={clsx('floating-input-height relative w-full border border-gray-300 dark:border-gray-700 rounded-md', className)}>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                required={required}
                className={clsx(
                    'peer block w-full bg-transparent px-4 py-2 text-sm rounded-md',
                    ' transition-all ',
                    {
                        'border-red-500': error && touched,
                    }
                )}
                placeholder={label}
                maxLength={max}
                disabled={disabled}
                {...rest}
            />
            <label
                htmlFor={name}
                className={clsx(
                    'absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-300 transition-all duration-200 pointer-events-none',
                    {
                        'bg-white dark:bg-gray-900 px-1 text-xs -translate-y-4': shouldFloat,
                        'bg-white dark:bg-gray-900 w-9/12 text-gray-500 dark:text-gray-200 translate-y-0.5': !shouldFloat,
                    }
                )}
            >
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>

            {error && touched && (
                <p className="mt-1 text-xs text-red-500">
                    {label} : {errorMessage || error}
                </p>
            )}
        </div>
    );
};

export default CommanInput;