import React, { useState } from 'react';
import clsx from 'clsx';

const FloatingInput = ({
    label,
    name,
    value = '',
    onChange,
    type = 'text',
    required = false,
    className = '',
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const shouldFloat = isFocused || value?.toString().length > 0;

    return (
        <div className={clsx('floating-input-height relative w-full', className)}>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required={required}
                className={clsx(
                    'peer block w-full appearance-none border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-900 placeholder-transparent  dark:text-white dark:border-gray-700',
                    'rounded-md transition-all'
                )}
                placeholder={label}
                {...rest}
            />
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

export default FloatingInput;
