import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

const CommanSelect = ({
    label,
    name,
    value = '',
    onChange,
    options = [''],
    required = false,
    className = '',
    placeholder = 'Select',
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(!!value);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        setHasContent(!!value);
    }, [value]);

    const shouldFloat = isFocused || hasContent;
    const showError = required && touched && !value;
function toTitleCase(str) {
    return str
        .replace(/_/g, ' ')
        .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
    return (
        <div className={clsx('floating-input-height relative w-full', className)}>
            <div className={clsx(
                'border rounded-md transition-all',
                {
                    'border-gray-300 dark:border-gray-700': !isFocused && !showError,
                    'border-red-500': showError,
                }
            )}>
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={(e) => {
                        onChange(e);
                        setHasContent(!!e.target.value);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        setTouched(true);
                    }}
                    required={required}
                    className={clsx(
                        'peer block w-full bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white',
                        ' outline-none bg-transparent rounded-md',
                        {
                            'text-gray-400': !value,
                        }
                    )}
                    {...rest}
                >
                    <option value="" disabled hidden>{placeholder}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        
        <label
            htmlFor={name}
            className={clsx(
                'absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-400 transition-all duration-200 pointer-events-none',
                {
                    'bg-white dark:bg-gray-900 px-1 text-xs -translate-y-4': shouldFloat,
                    'bg-white dark:bg-gray-900 w-9/12 text-gray-500 dark:text-gray-200 translate-y-0.5': !shouldFloat,
                }
            )}
        >
            {toTitleCase(label)}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>


            {showError && (
                <p className="mt-1 text-xs text-red-500">
                    {label} Required
                </p>
            )}
        </div>
    );
};

export default CommanSelect;
 