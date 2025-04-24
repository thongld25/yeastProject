import moment from "moment/moment";
import React from "react";

const EmployeeListTable = ({ tableData }) => {
  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Fullname
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Email
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Role
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Gender
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Birthdate
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Active
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((employee) => (
            <tr key={employee._id} className="border-t border-gray-200">
              <td className="py-4 px-4 text-gray-700 text-[15px]">
                {employee.name}
              </td>
              <td className="py-4 px-4 text-gray-700 text-[15px]">
                {employee.email}
              </td>
              <td className="py-4 px-4 text-gray-700 text-[15px] capitalize">
                {employee.role?.toLowerCase()}
              </td>
              <td className="py-4 px-4 text-gray-700 text-[15px] capitalize">
                {employee.gender}
              </td>
              <td className="py-4 px-4 text-gray-700 text-[15px]">
                {employee.birthDate // Sửa từ birtDate -> birthDate
                  ? moment.utc(employee.birthDate).format("Do MMM YYYY") // Thêm .utc()
                  : "N/A"}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 text-xs rounded inline-block ${
                    employee.active
                      ? "bg-red-100 text-red-500 border border-red-200"
                      : "bg-green-100 text-green-500 border border-green-200"
                  }`}
                >
                  {employee.active ? "Inactive" : "Active"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeListTable;
