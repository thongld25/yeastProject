import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import moment from "moment";

const EmployeeListTable = ({ tableData, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto mt-4 rounded-lg border border-gray-200">
      <table className="min-w-full text-[15px] text-left bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-gray-800">
          <tr>
            <th className="px-4 py-3 font-medium">Họ tên</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Vai trò</th>
            <th className="px-4 py-3 font-medium">Giới tính</th>
            <th className="px-4 py-3 font-medium">Ngày sinh</th>
            <th className="px-4 py-3 text-center font-medium">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tableData && tableData.length > 0 ? (
            tableData.map((emp) => (
              <tr key={emp._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{emp.name}</td>
                <td className="px-4 py-3 text-gray-700">{emp.email}</td>
                <td className="px-4 py-3 text-gray-700 capitalize">
                  {emp.role}
                </td>
                <td className="px-4 py-3 text-gray-700 capitalize">
                  {emp.gender}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {emp.birthDate
                    ? moment.utc(emp.birthDate).format("DD/MM/YYYY")
                    : "N/A"}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => onEdit(emp)}
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          "Bạn có chắc chắn muốn xóa nhân viên này?"
                        );
                        if (confirmDelete) onDelete(emp._id);
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
                colSpan="6"
                className="px-4 py-5 text-center text-gray-500 italic"
              >
                Không có nhân viên nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeListTable;
