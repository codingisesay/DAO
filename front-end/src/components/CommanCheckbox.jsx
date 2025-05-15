import React from 'react';
import clsx from 'clsx';

const CommanCommanCheckbox = ({
    label,
    name,
    checked = false,
    onChange,
    required = false,
    className = '',
    labelPosition = 'right', // 'left' or 'right'
    ...rest
}) => {
    return (
        <div className={clsx('flex items-center', className)}>
            {labelPosition === 'left' && (
                <label htmlFor={name} className="mr-2 text-sm text-gray-700 dark:text-gray-300">
                    {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}

            <input
                id={name}
                name={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                required={required}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                {...rest}
            />

            {labelPosition === 'right' && (
                <label htmlFor={name} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {label}{required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}
        </div>
    );
};

export default CommanCommanCheckbox;
