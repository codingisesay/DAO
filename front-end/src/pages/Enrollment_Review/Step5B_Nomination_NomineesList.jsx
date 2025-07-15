import React from "react";

const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const NomineesList = ({ nominees, removeNominee }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Nominees List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Name of the Nominee</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">Relationship</th>
              <th className="py-2 px-4 border-b">Date of Birth</th>
              <th className="py-2 px-4 border-b">Age</th>
              <th className="py-2 px-4 border-b">Percentage</th>
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {nominees.map((nominee) => (
              <tr key={nominee.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {toTitleCase(nominee.details.nomineeSalutation)}{" "}
                  {toTitleCase(nominee.details.nomineeFirstName)}{" "}
                  {toTitleCase(nominee.details.nomineeLastName)}
                </td>
                <td className="py-2 px-4 border-b">
                  {nominee.address.nomineeComplexName},{" "}
                  {nominee.address.nomineeBuildingName},{" "}
                  {nominee.address.nomineeArea}
                </td>
                <td className="py-2 px-4 border-b">
                  {nominee.details.nomineeRelation}
                </td>
                <td className="py-2 px-4 border-b">
                  {(() => {
                    const date = new Date(nominee.details.nomineeDOB);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                  })()}
                </td>
                <td className="py-2 px-4 border-b">
                  {nominee.details.nomineeAge}
                </td>
                <td className="py-2 px-4 border-b">
                  {nominee.details.nomineePercentage}%
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => removeNominee(nominee.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NomineesList;