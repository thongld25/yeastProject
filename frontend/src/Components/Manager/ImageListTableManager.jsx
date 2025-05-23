import React from "react";
import { useNavigate } from "react-router-dom";

const ImageListTableManager = ({ tableData }) => {
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
            <th className="px-4 py-3 font-semibold">Tên thí nghiệm</th>
            <th className="px-4 py-3 font-semibold">Tên lần đo</th>
            <th className="px-4 py-3 font-semibold">Tên ảnh</th>
            <th className="px-4 py-3 font-semibold">Người thực hiện</th>
            <th className="px-4 py-3 font-semibold">Trạng thái</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {tableData?.length > 0 ? (
            tableData.map((item, index) => (
              <tr
                key={item._id}
                className="border-t border-gray-200"
                onClick={() => handleRowClick(item._id)}
              >
                <td className="px-4 py-3 text-gray-700">{index + 1}</td>

                <td className="px-4 py-3 text-gray-800 font-medium">
                  <img
                    src={`http://localhost:3055${item.originalImage}`}
                    alt=""
                    crossOrigin="anonymous"
                    style={{ width: "100px", height: "auto" }}
                  />
                </td>

                <td className="px-4 py-3 text-gray-800">
                  {item.measurementId?.experimentId?.title || "Không rõ"}
                </td>

                <td className="px-4 py-3 text-gray-800">
                  {item.measurementId?.name || "Không rõ"}
                </td>

                <td className="px-4 py-3 text-gray-800">{item.name || "—"}</td>
                <td className="px-4 py-3 text-gray-800">
                  {item.measurementId?.experimentId?.userId?.name || "—"}
                </td>

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
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-6 text-center text-gray-500 italic">
                Không có ảnh nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ImageListTableManager;
