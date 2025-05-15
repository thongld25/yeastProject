import moment from "moment/moment";
import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { deleteFactory } from "../services/FactoryService";
import toast from "react-hot-toast";

const FactoryListTable = ({ tableData }) => {
  const navigate = useNavigate();

  const handleDeleteClick = async (factoryId) => {  
    const res = await deleteFactory(factoryId);
    if (res.status === 200) {
      console.log("Factory deleted successfully!", res);
      toast.success("Factory deleted successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      console.error("Failed to delete factory:", res);
      toast.error("Failed to delete factory");
    }
  }

  const handleEditClick = (factoryId) => {
    navigate(`/factories/${factoryId}`);
  };

  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="text-left bg-gray-50">
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Tên nhà máy
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Địa chỉ
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px] text-center">
              Nhân viên
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px] text-center">
              Hoạt động
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px] hidden md:table-cell">
              Ngày tạo
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px] text-center">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((factory) => (
            <tr
              key={factory._id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-gray-700 text-[15px] max-w-[200px]">
                {factory.name}
              </td>
              <td className="py-3 px-4 text-gray-700 text-[15px] max-w-[250px]">
                {factory.location}
              </td>
              <td className="py-3 px-4 text-center text-gray-700 text-[15px]">
                {factory.employeeCount}
              </td>
              <td className="py-3 px-4 text-center">
                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-600 border border-green-300">
                  Yes
                </span>
              </td>
              <td className="py-3 px-4 text-gray-700 text-[15px] text-nowrap hidden md:table-cell">
                {factory.createdAt
                  ? moment(factory.createdAt).format("Do MMM YYYY")
                  : "N/A"}
              </td>
              <td className="py-3 px-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditClick(factory._id)}
                  >
                    <FiEdit className="w-5 h-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Bạn có chắc chắn muốn xóa nhà máy này?"
                      );
                      if (confirmed) {
                        handleDeleteClick(factory._id);
                      }
                    }}
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

export default FactoryListTable;
