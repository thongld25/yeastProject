import React, { useState } from "react";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import toast from "react-hot-toast";
import { changePassword } from "../../services/UserService";
import { useUserAuth } from "../../hooks/useUserAuth";

const ChangePassword = () => {
  useUserAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State để quản lý trạng thái loading khi gửi form
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý khi người dùng gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ các trường!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và mật khẩu xác nhận không khớp!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
      setIsLoading(true); // Bắt đầu loading
    try {
      // Dữ liệu gửi đi
      const res = await changePassword(oldPassword, newPassword);      
      console.log("Đổi mật khẩu thành công:", res);
      toast.success("Đổi mật khẩu thành công!");

      // Xóa trống các ô input
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      // Xử lý khi có lỗi từ server (ví dụ: mật khẩu cũ không đúng)
      // Thường lỗi sẽ được lấy từ error.response.data.message
      console.error("Đổi mật khẩu thất bại:", error);
      toast.error(error);
    } finally {
      setIsLoading(false); // Dừng loading dù thành công hay thất bại
    }
  };

  return (
    <DashbroardLayout activeMenu={"Đổi mật khẩu"}>
      <div className="flex justify-center items-start mt-8">
        <div className="w-full max-w-lg">
          <div className="card">
            <h5 className="text-xl font-semibold mb-6 text-center">
              Đổi mật khẩu
            </h5>
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                {/* Trường Mật khẩu hiện tại */}
                <div>
                  <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Trường Mật khẩu mới */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Trường Xác nhận mật khẩu mới */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Nút Gửi */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashbroardLayout>
  );
};

export default ChangePassword;