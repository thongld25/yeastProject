import { button } from "@material-tailwind/react";
import moment from "moment/moment";
import React from "react";
import { useNavigate } from "react-router-dom";

const FactoryListTable = ({ tableData }) => {
  const navigate = useNavigate();

  const handleRowClick = (factoryId) => {
    navigate(`/factories/${factoryId}`);
  };
  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Factory Name
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Location
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Number of Employees
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Active
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px] hidden md:table-cell">
              Create At
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((factory) => (
            <tr
              key={factory._id}
              className="border-t border-gray-200"
              onClick={() => handleRowClick(factory._id)}
            >
              <td className="my-3 mx-4 text-gray-700 text-[15px] line-clamp-1 overflow-hidden">
                {factory.name}
              </td>
              <td className="py-4 px-4 my-3 mx-4 text-gray-700 text-[15px]">
                {factory.location}
              </td>
              <td className="py-4 px-20 my-3 mx-4 text-gray-700 text-[15px]">
                {factory.employeeCount}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 text-xs rounded inline-block bg-green-100 text-green-500 border border-green-200`}
                >
                  Yes
                </span>
              </td>
              <td className="py-4 px-4 text-gray-700 text-[15px] text-nowrap hidden md:table-cell">
                {factory.createdAt
                  ? moment(factory.createdAt).format("Do MMM YYYY")
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FactoryListTable;
