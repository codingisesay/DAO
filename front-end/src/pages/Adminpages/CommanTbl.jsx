import { useState } from "react";
import CommanInput from "../../components/CommanInput";
import { Link } from "react-router-dom";
const agentWiseData = [
    { id: 1, name: "Vaibhav Talekar", count: 10 },
    { id: 2, name: "Sushant Nikam", count: 15 },
    { id: 3, name: "Anjer Rane", count: 20 },
    { id: 4, name: "Shreyash Talwekar", count: 25 },
    { id: 5, name: "Aakash Singh", count: 30 },
    { id: 6, name: "Om Mahadalikar", count: 30 },
];

const allData = [
    {
        id: 1,
        name: "Vaibhav Talekar",
        applicationNo: "02120",
        date: "2/11/2025",
        customer: "Rajesh Tiwari",
        rejectedBy: "Neha Tembhe",
        reason: "PAN Card error",
    },
    {
        id: 2,
        name: "Sushant Nikam",
        applicationNo: "21021",
        date: "3/11/2025",
        customer: "Kanan Mandal",
        rejectedBy: "Niksha Jadhav",
        reason: "PAN Card error",
    },
    {
        id: 3,
        name: "Anjer Rane",
        applicationNo: "21021",
        date: "4/11/2025",
        customer: "Viraj Rai",
        rejectedBy: "Ankita Pansare",
        reason: "PAN Card error",
    },
    {
        id: 4,
        name: "Shreyash Talwekar",
        applicationNo: "21021",
        date: "5/11/2025",
        customer: "Mahesh Serdal",
        rejectedBy: "Om Mahadalilkar",
        reason: "PAN Card error",
    },
    {
        id: 5,
        name: "Aakash Singh",
        applicationNo: "21021",
        date: "6/11/2025",
        customer: "Sohel Shaikh",
        rejectedBy: "Aakash Singh",
        reason: "Aadhaar Card error",
    },
    {
        id: 6,
        name: "Om Mahadalikar",
        applicationNo: "21021",
        date: "7/11/2025",
        customer: "Paresh Hiwari",
        rejectedBy: "Rajesh Bane",
        reason: "Aadhaar Card error",
    },
];

const CommanTbl = ({ tbldata }) => {
    const [activeTab, setActiveTab] = useState("agent");
    console.log("data from main page to tbl page sent :", tbldata);
    return (
        <div >

            <div className="w-[300px] ms-auto mb-2">
                <CommanInput label="Search.." />
            </div>

            <table className="w-full border">
                <thead className="bg-green-600 text-white">
                    <tr>
                        <th className="p-2">Serial No.</th>
                        <th className="p-2">customer name</th>
                        <th className="p-2">Application No.</th>
                        <th className="p-2">customer id</th>
                        <th className="p-2">Date of Birth</th>
                        <th className="p-2">Auth Type</th>
                        {/* <th className="p-2">Rejected Reason</th> */}
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tbldata.map((tbldt, index) => (
                        <tr key={tbldt.id} className="text-center">
                            <td className="border p-2">0{index + 1}.</td>
                            <td className="border p-2">{tbldt.first_name}</td>
                            <td className="border p-2">{tbldt.application_no}</td>
                            <td className="border p-2">{tbldt.id}</td>
                            <td className="border p-2">{tbldt.DOB}</td>
                            <td className="border p-2">{tbldt.auth_type}</td>
                            {/* <td className="border p-2">{tbldt.reason}</td> */}
                            <td className="border p-2">
                                <button className="border px-3 py-1 rounded text-green-600 border-green-600">
                                    <Link to="/varify-account/01"> View</Link>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div >
    );
};

export default CommanTbl;
