import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import { IoAddOutline } from "react-icons/io5";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import {
  createUser,
  getUserOfFactory,
  deleteUser,
  updateUser,
} from "../../services/UserService";
import { getFactoryById, updateFactory } from "../../services/FactoryService";
import EmployeeListTable from "../../components/EmployeeListTable";

const EmployeeOfFactory = () => {
  useUserAuth();
  const { factoryId } = useParams();
  const { user } = useContext(UserContext);

  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [factory, setFactory] = useState({
    name: "",
    location: "",
    status: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "employee",
    birthDate: "",
    gender: "male",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const {email, ...updateData} = editingUser;
      const res = await updateUser(editingUser._id, updateData); // cần tồn tại API updateUser
      console.log(res);
      if (res.status === 200) {
        toast.success("Cập nhật nhân viên thành công!");
        fetchUsers();
        setEditOpen(false);
      } else {
        toast.error("Lỗi khi cập nhật");
      }
    } catch {
      toast.error("Lỗi kết nối khi cập nhật");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUserOfFactory(factoryId);
      if (res.status === 200) {
        setEmployees(res.metadata);
      }
    } catch {
      toast.error("Lỗi khi tải danh sách nhân viên");
    }
  };

  const fetchFactory = async () => {
    try {
      const res = await getFactoryById(factoryId);
      if (res.status === 200) {
        console.log(res.metadata);
        setFactory(res.metadata);
      }
    } catch {
      toast.error("Lỗi khi tải thông tin nhà máy");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createUser(
        formData.email,
        formData.fullName,
        formData.role,
        factoryId,
        formData.gender,
        formData.birthDate
      );
      toast.success("Thêm nhân viên thành công!");
      setOpen(false);
      setFormData({
        fullName: "",
        email: "",
        role: "employee",
        birthDate: "",
        gender: "male",
      });
      fetchUsers();
    } catch {
      toast.error("Thêm nhân viên thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFactorySave = async () => {
    try {
      const res = await updateFactory(factoryId, factory);
      if (res.status === 200) {
        toast.success("Cập nhật nhà máy thành công");
      } else {
        toast.error("Lỗi khi cập nhật nhà máy");
      }
    } catch {
      toast.error("Lỗi kết nối máy chủ");
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const res = await deleteUser(id);
      if (res.status === 200) {
        toast.success("Đã xoá nhân viên");
        fetchUsers();
      } else {
        toast.error("Xoá thất bại");
      }
    } catch {
      toast.error("Lỗi xoá nhân viên");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchFactory();
  }, [factoryId]);

  return (
    <DashbroardLayout activeMenu="Nhà máy">
      <Toaster />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card space-y-6">
            {/* Thông tin nhà máy */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Thông tin nhà máy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tên nhà máy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên nhà máy
                  </label>
                  <input
                    type="text"
                    value={factory.name || ""}
                    onChange={(e) =>
                      setFactory({ ...factory, name: e.target.value })
                    }
                    placeholder="Nhập tên nhà máy"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>

                {/* Địa chỉ nhà máy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ nhà máy
                  </label>
                  <input
                    type="text"
                    value={factory.location || ""}
                    onChange={(e) =>
                      setFactory({ ...factory, location: e.target.value })
                    }
                    placeholder="Nhập địa chỉ"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>

              {/* Trạng thái hoạt động */}
              <div className="mt-4 flex items-center gap-4">
                <label className="text-sm font-medium">Đang hoạt động:</label>
                <input
                  type="checkbox"
                  checked={factory.status === "active"}
                  onChange={(e) =>
                    setFactory({
                      ...factory,
                      status: e.target.checked ? "active" : "inactive",
                    })
                  }
                />
              </div>

              <button
                onClick={handleFactorySave}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
              >
                Cập nhật thông tin nhà máy
              </button>
            </div>

            {/* Nút thêm nhân viên */}
            <div className="flex justify-between items-center">
              <h5 className="text-lg font-semibold">Danh sách nhân viên</h5>
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                <IoAddOutline className="text-lg" />
                Thêm nhân viên
              </button>
            </div>

            {/* Bảng nhân viên */}
            <EmployeeListTable
              tableData={employees}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteEmployee}
            />

            {/* Dialog thêm nhân viên */}
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              className="relative z-50"
            >
              <DialogBackdrop className="fixed inset-0 bg-black/50" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
                  <DialogTitle className="text-xl font-bold mb-6">
                    Thêm nhân viên mới
                  </DialogTitle>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Họ tên */}
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Họ tên
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Nhập họ tên"
                        required
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập email"
                        required
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>

                    {/* Vai trò */}
                    <div>
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Vai trò
                      </label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>

                    {/* Ngày sinh */}
                    <div>
                      <label
                        htmlFor="birthDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        id="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                      />
                    </div>

                    {/* Giới tính */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giới tính
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === "male"}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                gender: e.target.value,
                              }))
                            }
                          />
                          <span className="ml-2">Nam</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === "female"}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                gender: e.target.value,
                              }))
                            }
                          />
                          <span className="ml-2">Nữ</span>
                        </label>
                      </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 border rounded"
                      >
                        Huỷ
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? "Đang tạo..." : "Tạo nhân viên"}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </div>
            </Dialog>
            {/* Dialog chỉnh sửa nhân viên */}
            <Dialog
              open={editOpen}
              onClose={() => setEditOpen(false)}
              className="relative z-50"
            >
              <DialogBackdrop className="fixed inset-0 bg-black/50" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
                  <DialogTitle className="text-xl font-bold mb-6">
                    Chỉnh sửa nhân viên
                  </DialogTitle>
                  {editingUser && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      {/* Họ tên */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Họ tên
                        </label>
                        <input
                          type="text"
                          value={editingUser.name || ""}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editingUser.email || ""}
                          disabled
                          className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                      </div>

                      {/* Vai trò */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vai trò
                        </label>
                        <select
                          value={editingUser.role || "employee"}
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              role: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded"
                          required
                        >
                          <option value="employee">Employee</option>
                          <option value="manager">Manager</option>
                        </select>
                      </div>

                      {/* Ngày sinh */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày sinh
                        </label>
                        <input
                          type="date"
                          value={
                            editingUser.birthDate
                              ? editingUser.birthDate.slice(0, 10)
                              : ""
                          }
                          onChange={(e) =>
                            setEditingUser({
                              ...editingUser,
                              birthDate: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded"
                          required
                        />
                      </div>

                      {/* Giới tính */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giới tính
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="edit-gender"
                              value="male"
                              checked={editingUser.gender === "male"}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  gender: e.target.value,
                                })
                              }
                            />
                            <span className="ml-2">Nam</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="edit-gender"
                              value="female"
                              checked={editingUser.gender === "female"}
                              onChange={(e) =>
                                setEditingUser({
                                  ...editingUser,
                                  gender: e.target.value,
                                })
                              }
                            />
                            <span className="ml-2">Nữ</span>
                          </label>
                        </div>
                      </div>

                      {/* Nút hành động */}
                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setEditOpen(false)}
                          className="px-4 py-2 border rounded"
                        >
                          Huỷ
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Cập nhật
                        </button>
                      </div>
                    </form>
                  )}
                </DialogPanel>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </DashbroardLayout>
  );
};

export default EmployeeOfFactory;
