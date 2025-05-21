import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { deleteImage } from "../services/ImageService";

const ImageListTable = ({ tableData, onDelete }) => {
  const navigate = useNavigate();
  const handleRowClick = (imageId) => {
    navigate(`/analysis/${imageId}`);
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full text-[15px] text-left">
        <thead className="bg-gray-50 text-gray-800">
          <tr>
            <th className="px-4 py-3 font-semibold">STT</th>
            <th className="px-4 py-3 font-semibold">Danh sách ảnh</th>
            <th className="px-4 py-3 font-semibold">Tên ảnh</th>
            <th className="px-4 py-3 font-semibold">Trạng thái</th>
            <th className="px-4 py-3 font-semibold text-center">Hành động</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {tableData?.length > 0 ? (
            tableData.map((item, index) => (
              <tr key={item._id} className="border-t border-gray-200">
                <td className="px-4 py-3 text-gray-700">{index + 1}</td>

                <td className="px-4 py-3 text-gray-800 font-medium">
                  <img
                    src={`http://localhost:3055${item.originalImage}`}
                    alt=""
                    crossOrigin="anonymous"
                    style={{ width: "100px", height: "auto" }}
                  />
                </td>

                <td className="px-4 py-3 text-gray-800">{item.name || "—"}</td>

                <td className="px-4 py-3">
                  {item.status === "completed" && (
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                      Đã xử lý
                    </span>
                  )}
                  {item.status === "pending" && (
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
                      Đang xử lý
                    </span>
                  )}
                  {item.status === "failed" && (
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                      Xử lý thất bại
                    </span>
                  )}
                  {!item.status && (
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full">
                      Không xác định
                    </span>
                  )}
                </td>

                <td className="py-4 px-3 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      title="Chi tiết"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleRowClick(item._id)}
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      title="Xoá"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => onDelete(item._id)}
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
                colSpan="7"
                className="px-4 py-6 text-center text-gray-500 italic"
              >
                Không có ảnh nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ImageListTable;
