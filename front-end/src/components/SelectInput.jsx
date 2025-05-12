import React, { useState, useEffect } from 'react';
import clsx from 'clsx';

const SelectInput = ({
    label,
    name,
    value = '',
    onChange,
    options = [],
    required = false,
    className = '',
    placeholder = 'Select',
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasContent, setHasContent] = useState(!!value);

    useEffect(() => {
        setHasContent(!!value);
    }, [value]);

    const shouldFloat = isFocused || hasContent;

    return (
        <div className={clsx('floating-input-height relative w-full', className)}>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required={required}
                className={clsx(
                    'peer block w-full  border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-900 dark:text-white dark:border-gray-700 rounded-md transition-all',
                    'bg-transparent placeholder-transparent'
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
            <label
                htmlFor={name}
                className={clsx(
                    'absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-400 transition-all duration-200 pointer-events-none',
                    {
                        'bg-white dark:bg-gray-900 px-1 text-xs -translate-y-4': shouldFloat,
                        'bg-white w-4/6 text-gray-500 dark:text-gray-400  translate-y-0.5 ': !shouldFloat,
                    }
                )}
            >
                {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
        </div>
    );
};

export default SelectInput;
