import moment from "moment/moment";
import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const MeasurementListTable = ({ tableData }) => {
  const navigate = useNavigate();
  const handleRowClick = (measurementId) => {
    navigate(`/images/${measurementId}`);
  }

  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              STT
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Tên lần đo
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Ngày tạo
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((item, index) => (
            <tr key={item._id} className="border-t border-gray-200" onClick={() => handleRowClick(item._id)}>
              {/* Số thứ tự */}
              <td className="py-4 px-4 text-gray-700 text-[15px] ">
                {index + 1}
              </td>

              {/* Tên */}
              <td className="py-4 px-4 text-gray-700 text-[15px] font-medium">
                {item.name || "N/A"}
              </td>

              {/* Ngày tạo */}
              <td className="py-4 px-4 text-gray-700 text-[15px] capitalize">
                {item.time
                  ? moment(item.time).format("HH:mm - Do MMM YYYY")
                  : "N/A"}
              </td>

              {/* Action buttons */}
              <td className="py-4 px-4">
                <div className="">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600"
                    onClick={() => handleEdit(item._id)}
                  >
                    <FiEdit className="w-5 h-5" />
                  </button>
                  
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                    onClick={() => handleDelete(item._id)}
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MeasurementListTable;