import React from 'react';
import MUIDataTable from 'mui-datatables';

// Generate dummy user data
const createUserData = (id, name, phone, age, email, city) => ({
    id,
    name,
    phone,
    age,
    email: `${name.replace(/\s+/g, '').toLowerCase()}@example.com`,
    city
});

const dummyUsers = [
    createUserData(1, 'John Doe', '555-123-4567', 28, '', 'New York'),
    createUserData(2, 'Jane Smith', '555-987-6543', 34, '', 'Los Angeles'),
    createUserData(3, 'Michael Johnson', '555-456-7890', 45, '', 'Chicago'),
    createUserData(4, 'Emily Davis', '555-234-5678', 22, '', 'Houston'),
    createUserData(5, 'Robert Brown', '555-876-5432', 31, '', 'Phoenix'),
    createUserData(6, 'Sarah Wilson', '555-345-6789', 29, '', 'Philadelphia'),
    createUserData(7, 'David Taylor', '555-765-4321', 38, '', 'San Antonio'),
    createUserData(8, 'Jennifer Anderson', '555-567-8901', 27, '', 'San Diego'),
    createUserData(9, 'Thomas Martinez', '555-432-1098', 41, '', 'Dallas'),
    createUserData(10, 'Lisa Robinson', '555-678-9012', 33, '', 'San Jose'),
    createUserData(11, 'William Clark', '555-321-0987', 50, '', 'Austin'),
    createUserData(12, 'Jessica Rodriguez', '555-789-0123', 26, '', 'Jacksonville'),
    createUserData(13, 'James Lewis', '555-210-9876', 36, '', 'Fort Worth'),
    createUserData(14, 'Amanda Lee', '555-890-1234', 24, '', 'Columbus'),
    createUserData(15, 'Daniel Walker', '555-109-8765', 43, '', 'Charlotte'),
];

const UserDataTable = () => {
    // Prepare data for the table
    const data = dummyUsers.map(user => [
        user.id,
        user.name,
        user.phone,
        user.age,
        user.email,
        user.city
    ]);

    // Column definitions
    const columns = [
        {
            name: 'id',
            label: 'ID',
            options: {
                filter: false,
                sort: true,
            }
        },
        {
            name: 'name',
            label: 'Name',
            options: {
                filter: true,
                filterType: 'textField',
                sort: true,
            }
        },
        {
            name: 'phone',
            label: 'Phone',
            options: {
                filter: false,
                sort: true,
            }
        },
        {
            name: 'age',
            label: 'Age',
            options: {
                filter: true,
                filterType: 'dropdown',
                filterOptions: {
                    names: ['Under 30', '30-40', 'Over 40'],
                    logic(age, filterVal) {
                        const ageNum = parseInt(age, 10);
                        if (filterVal.indexOf('Under 30') >= 0 && ageNum < 30) {
                            return false;
                        }
                        if (filterVal.indexOf('30-40') >= 0 && (ageNum < 30 || ageNum > 40)) {
                            return false;
                        }
                        if (filterVal.indexOf('Over 40') >= 0 && ageNum <= 40) {
                            return false;
                        }
                        return true;
                    },
                },
                sort: true,
            }
        },
        {
            name: 'email',
            label: 'Email',
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: 'city',
            label: 'City',
            options: {
                filter: true,
                filterType: 'multiselect',
                sort: true,
            }
        },
    ];

    // Table options
    const options = {
        filterType: 'multiselect',
        responsive: 'standard',
        selectableRows: 'none',
        print: false,
        download: false,
        viewColumns: true,
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 15],
        search: true,
        searchPlaceholder: 'Search by name, email, or city...',
        textLabels: {
            body: {
                noMatch: "No matching records found",
                toolTip: "Sort",
            },
            pagination: {
                next: "Next Page",
                previous: "Previous Page",
                rowsPerPage: "Rows per page:",
                displayRows: "of",
            },
            toolbar: {
                search: "Search",
                downloadCsv: "Download CSV",
                print: "Print",
                viewColumns: "View Columns",
                filterTable: "Filter Table",
            },
            filter: {
                all: "All",
                title: "FILTERS",
                reset: "RESET",
            },
            viewColumns: {
                title: "Show Columns",
                titleAria: "Show/Hide Table Columns",
            },
            selectedRows: {
                text: "row(s) selected",
                delete: "Delete",
                deleteAria: "Delete Selected Rows",
            },
        },
        customFilterDialogFooter: (currentFilterList, applyNewFilters) => {
            return (
                <div style={{ marginTop: '40px' }}>
                    <button
                        onClick={() => applyNewFilters([])}
                        style={{ marginRight: '10px' }}
                    >
                        Reset Filters
                    </button>
                    <button
                        onClick={() => applyNewFilters(currentFilterList)}
                        style={{ marginRight: '10px' }}
                    >
                        Apply Filters
                    </button>
                </div>
            );
        }
    };

    return (
        <div style={{ padding: 24 }}>
            <h1>User Management</h1>
            <MUIDataTable
                title={"User List"}
                data={data}
                columns={columns}
                options={options}
            />
        </div>
    );
};

export default UserDataTable;