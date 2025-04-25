import moment from "moment/moment";
import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { deleteImage } from "../services/ImageService";

const ImageListTable = ({ tableData }) => {
  const navigate = useNavigate();
  const handleRowClick = (imageId) => {
    navigate(`/analysis/${imageId}`);
  };
  const handleDelete = async (imageId) => {
      try {
        const res = await deleteImage(imageId);
        console.log(res);
        if (res.status === 200) {
            console.log("Image deleted successfully!", res);
            toast.success("Image deleted successfully!");
            // Optionally, you can refresh the page or update the state to reflect the deletion
        }
      } catch (error) {
        toast.error("Failed to delete image");
        console.error("Error deleting image:", error);
      }
    };

  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              STT
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Danh sách ảnh
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
              Loại ảnh
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[15px]">
                Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData?.map((item, index) => (
            <tr
              key={item._id}
              className="border-t border-gray-200"
            >
              {/* Số thứ tự */}
              <td className="py-4 px-4 text-gray-700 text-[15px] ">
                {index + 1}
              </td>

              <td className="py-4 px-4 text-gray-700 text-[15px] font-medium">
                <img
                  src={`data:image/png;base64,${item.originalImage}`}
                  alt=""
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
              <td className="py-4 px-4 my-3 mx-4 text-gray-700 text-[15px]">
                {item.imageType}
              </td>
              {/* Action buttons */}
              <td className="py-4 px-4">
                <div className="">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-blue-600"
                    onClick={() => handleRowClick(item._id)}
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

export default ImageListTable;
