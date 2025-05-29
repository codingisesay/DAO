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

const RejectedApplications = () => {
    const [activeTab, setActiveTab] = useState("agent");

    return (
        <div >
            {/* <h2 className="text-xl font-semibold mb-4">Total Rejected Application</h2> */}

            {/* Tab Buttons */}
            <div className="flex mb-4">
                <button
                    className={`w-[150px] py-2 rounded ${activeTab === "all" ? "bg-green-600 text-white" : "bg-gray-200"
                        }`}
                    onClick={() => setActiveTab("all")}
                >
                    All Accounts
                </button>
                <button
                    className={`w-[150px] py-2 rounded ${activeTab === "agent" ? "bg-green-600 text-white" : "bg-gray-200"
                        }`}
                    onClick={() => setActiveTab("agent")}
                >
                    Agent Wise
                </button>
            </div>
            <div className="w-[300px] ms-auto mb-2">
                <CommanInput label="Search.." />
            </div>
            {/* Tables */}
            {
                activeTab === "agent" ? (
                    <table className="w-full border">
                        <thead className="bg-green-600 text-white">
                            <tr>
                                <th className="p-2">Serial No.</th>
                                <th className="p-2">Agent Name</th>
                                <th className="p-2">Pending Count</th>
                                <th className="p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agentWiseData.map((agent, index) => (
                                <tr key={agent.id} className="text-center">
                                    <td className="border p-2">0{index + 1}.</td>
                                    <td className="border p-2">{agent.name}</td>
                                    <td className="border p-2">{agent.count}</td>
                                    <td className="border p-2">
                                        <button className="border px-3 py-1 rounded text-green-600 border-green-600">
                                            <Link to="/varify-account/01"> View</Link>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="w-full border">
                        <thead className="bg-green-600 text-white">
                            <tr>
                                <th className="p-2">Serial No.</th>
                                <th className="p-2">Agent Name</th>
                                <th className="p-2">Application No.</th>
                                <th className="p-2">Application Date</th>
                                <th className="p-2">Customer Name</th>
                                <th className="p-2">Rejected by</th>
                                <th className="p-2">Rejected Reason</th>
                                <th className="p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allData.map((app, index) => (
                                <tr key={app.id} className="text-center">
                                    <td className="border p-2">0{index + 1}.</td>
                                    <td className="border p-2">{app.name}</td>
                                    <td className="border p-2">{app.applicationNo}</td>
                                    <td className="border p-2">{app.date}</td>
                                    <td className="border p-2">{app.customer}</td>
                                    <td className="border p-2">{app.rejectedBy}</td>
                                    <td className="border p-2">{app.reason}</td>
                                    <td className="border p-2">
                                        <button className="border px-3 py-1 rounded text-green-600 border-green-600">
                                            <Link to="/varify-account/01"> View</Link>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </div >
    );
};

export default RejectedApplications;
