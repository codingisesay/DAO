import React from 'react';

const KYCpendingTbl = () => {
    return (
        <>

            <div className="table-container">

                <table>
                    <thead>
                        <tr>
                            {/* <th>Sr. No.</th> */}
                            <th>Applicant Name</th>
                            <th>Date</th>
                            <th>Application No.</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {/* <td>01</td> */}
                            <td className="applicant-name">
                                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Rakesh Sharma" />
                                Rakesh Sharma
                            </td>
                            <td>12-01-2025</td>
                            <td>12150</td>
                            <td><button className="click-button">View</button></td>
                        </tr>
                        <tr>
                            {/* <td>02</td>/ */}
                            <td className="applicant-name">
                                <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="Mahesh Singh" />
                                Mahesh Singh
                            </td>
                            <td>16-02-2025</td>
                            <td>25321</td>
                            <td><button className="click-button">View</button></td>
                        </tr>
                        <tr>
                            {/* <td>03</td> */}
                            <td className="applicant-name">
                                <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="Rohit Verma" />
                                Rohit Verma
                            </td>
                            <td>18-03-2025</td>
                            <td>30254</td>
                            <td><button className="click-button">View</button></td>
                        </tr>
                        <tr>
                            {/* <td>04</td> */}
                            <td className="applicant-name">
                                <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="Nakul Ahire" />
                                Nakul Ahire
                            </td>
                            <td>18-03-2025</td>
                            <td>75542</td>
                            <td><button className="click-button">View</button></td>
                        </tr>
                        <tr>
                            {/* <td>05</td> */}
                            <td className="applicant-name">
                                <img src="https://randomuser.me/api/portraits/men/5.jpg" alt="Kunal Pagare" />
                                Kunal Pagare
                            </td>
                            <td>18-03-2025</td>
                            <td>96545</td>
                            <td><button className="click-button">View</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default KYCpendingTbl;
