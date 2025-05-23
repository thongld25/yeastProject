import React from "react";
import { FiEdit, FiTrash2, FiBarChart2 } from "react-icons/fi";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ExperimentListTableManager = ({ tableData }) => {
  const navigate = useNavigate();

  const handleRowClick = (e, experimentId) => {
    if (
      e.target.closest("button") ||
      e.target.closest("svg") ||
      e.target.closest("path")
    ) {
      return;
    }
    navigate(`/experiment/${experimentId}`);
  };

  return (
    <div className="overflow-x-auto mt-4 rounded-lg border border-gray-200">
      <table className="min-w-full text-[15px] text-left bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-gray-800">
          <tr>
            <th className="px-5 py-3 font-semibold">Tiêu đề</th>
            <th className="px-5 py-3 font-semibold">Mô tả</th>
            <th className="px-5 py-3 font-semibold">Thời gian</th>
            <th className="px-5 py-3 font-semibold">Người tạo</th>
            <th className="px-5 py-3 text-center font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tableData?.length > 0 ? (
            tableData.map((experiment) => (
              <tr
                key={experiment._id}
                className="hover:bg-gray-50 cursor-pointer transition duration-150"
                onClick={(e) => handleRowClick(e, experiment._id)}
              >
                <td className="px-5 py-3 text-gray-900">{experiment.title}</td>
                <td className="px-5 py-3 text-gray-700">
                  {experiment.description}
                </td>
                <td className="px-5 py-3 text-gray-700">
                  {moment(experiment.time).format("HH:mm - DD/MM/YYYY")}
                </td>
                <td className="px-5 py-3 text-gray-700">
                  {experiment.userId?.name || "N/A"}
                </td>
                <td className="px-5 py-3 text-center">
                  <div className="flex justify-center items-center gap-3">
                    <button
                      title="Xem thống kê"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(
                          `/employee/statistics/by-experiment?experimentId=${experiment._id}`
                        );
                      }}
                      className="text-green-600 hover:text-green-800 transition"
                    >
                      <FiBarChart2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-5 py-6 text-center text-gray-500 italic"
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

export default ExperimentListTableManager;
