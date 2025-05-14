import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ExperimentListTable = ({ tableData, onDelete }) => {
  const navigate = useNavigate();

  const handleCLickEdit = (experimentId) => {
    navigate(`/experiment/${experimentId}`);
  }
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full text-[15px] text-left">
        <thead className="bg-gray-50 text-gray-800">
          <tr>
            <th className="px-4 py-3 font-semibold">Tiêu đề</th>
            <th className="px-4 py-3 font-semibold">Mô tả</th>
            <th className="px-4 py-3 font-semibold">Thời gian</th>
            <th className="px-4 py-3 text-center font-medium">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tableData?.length > 0 ? (
            tableData.map((experiment) => (
              <tr key={experiment._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">
                  {experiment.title}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {experiment.description}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {moment(experiment.time).format("HH:mm - DD/MM/YYYY")}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleCLickEdit(experiment._id)}
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          "Bạn có chắc chắn muốn xóa nhân viên này?"
                        );
                        if (confirmDelete) onDelete(experiment._id);
                      }}
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="px-4 py-6 text-center text-gray-500 italic"
              >
                Không có thí nghiệm nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExperimentListTable;
