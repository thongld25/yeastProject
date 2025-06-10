import moment from "moment";
import React from "react";
import { FiEdit, FiTrash2, FiBarChart2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const MeasurementListTable = ({ tableData, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleRowClick = (e, measurementId) => {
    // Không xử lý nếu click vào icon edit/delete
    if (
      e.target.closest("button") ||
      e.target.closest("svg") ||
      e.target.closest("path")
    ) {
      return;
    }
    navigate(`/images/${measurementId}`);
  };
  const hasExperiment = tableData?.some((item) => item.experimentId?.title);

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full text-[15px] text-left">
        <thead className="bg-gray-50 text-gray-800">
          <tr>
            <th className="px-4 py-3 font-semibold">STT</th>
            {hasExperiment && (
              <th className="px-4 py-3 font-semibold">Tên thí nghiệm</th>
            )}
            <th className="px-4 py-3 font-semibold">Tên lần đo</th>
            <th className="px-4 py-3 font-semibold">Loại ảnh</th>
            <th className="px-4 py-3 font-semibold">Loại lăng kính</th>
            <th className="px-4 py-3 font-semibold">Thời điểm</th>
            <th className="px-4 py-3 font-semibold text-center">Hành động</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {tableData?.length > 0 ? (
            tableData.map((item, index) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={(e) => handleRowClick(e, item._id)}
              >
                <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                {hasExperiment && (
                  <td className="px-4 py-3 text-gray-800">
                    {item.experimentId?.title || "Không rõ"}
                  </td>
                )}
                <td className="px-4 py-3 text-gray-800 font-medium">
                  {item.name || "Không có tên"}
                </td>
                <td className="px-4 py-3 text-gray-800 font-medium">
                  {item.imageType || "N/A"}
                </td>
                <td className="px-4 py-3 text-gray-800 font-medium">
                  {item.lensType || "N/A"}
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {item.time
                    ? moment(item.time).format("HH:mm - DD/MM/YYYY")
                    : "N/A"}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      title="Chỉnh sửa"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => onEdit?.(item)}
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      title="Xoá"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => onDelete?.(item._id)}
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800"
                      title="Thống kê"
                      onClick={() =>
                        navigate(
                          `/employee/statistics/by-measurement?measurementId=${item._id}`
                        )
                      }
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
                colSpan={hasExperiment ? 5 : 4}
                className="px-4 py-6 text-center text-gray-500 italic"
              >
                Chưa có lần đo nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MeasurementListTable;
