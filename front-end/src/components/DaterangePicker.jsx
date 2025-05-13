// src/components/DateRangePicker.jsx
import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // default styles
import "react-date-range/dist/theme/default.css"; // theme styles

const DateRangePicker = ({ onChange }) => {
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: "selection",
        },
    ]);

    const handleSelect = (ranges) => {
        setRange([ranges.selection]);
        if (onChange) {
            onChange(ranges.selection);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "auto" }}>
            <DateRange
                editableDateInputs={false}
                onChange={handleSelect}
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={1}
                direction="horizontal"
                showMonthAndYearPickers={true}
                rangeColors={["#27ae60"]}
            />
        </div>
    );
};

export default DateRangePicker;
