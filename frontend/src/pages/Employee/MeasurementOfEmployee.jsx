import React, { useContext, useEffect, useState } from "react";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import { IoAddOutline } from "react-icons/io5";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { UserContext } from "../../context/userContext";
import { useUserAuth } from "../../hooks/useUserAuth";
import MeasurementListTable from "../../components/MeasureListTable";
import toast from "react-hot-toast";
import {
  createMeasurement,
  deleteMeasurement,
  getMeasurementByExperimentId,
  getMeasurementOfUser,
  searchMeasurementOfEmployee,
  updateMeasurement,
} from "../../services/MeasurementService";
import {
  getExperimentById,
  getExperimentByUserId,
} from "../../services/ExperimentService";

const MeasurementOfEmployee = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [measurements, setMeasurements] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    experimentId: "",
    imageType: "",
    lensType: "",
    name: "",
    time: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5; // số thí nghiệm mỗi trang
  const [searchKeyword, setSearchKeyword] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [experiments, setExperiments] = useState([]);

  const handleOpenEdit = (item) => {
    setEditingMeasurement(item);
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const editData = {
        name: editingMeasurement.name,
        time: editingMeasurement.time,
      };
      const res = await updateMeasurement(editingMeasurement._id, editData);
      if (res.status === 200) {
        toast.success("Cập nhật lần đo thành công!");
        fetchMeasurementsOfEmployee();
        setEditOpen(false);
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating measurement:", error);
      toast.error("Lỗi kết nối khi cập nhật!");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  function getPagination(currentPage, totalPages) {
    const pages = [];

    // Luôn có trang đầu
    pages.push(1);

    // Chèn ... nếu currentPage > 3
    if (currentPage > 3) {
      pages.push("...");
    }

    // Hiển thị currentPage và currentPage + 1 (nếu trong phạm vi)
    if (currentPage > 1 && currentPage < totalPages) {
      pages.push(currentPage);
      if (currentPage + 1 < totalPages) {
        pages.push(currentPage + 1);
      }
    } else if (currentPage === 1 && totalPages > 1) {
      pages.push(2);
    }

    // Chèn ... nếu currentPage < totalPages - 2
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Luôn có trang cuối (khác trang đầu)
    if (totalPages !== 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  const fetchMeasurementsOfEmployee = async (page = 1) => {
    try {
      let res;
      if (searchKeyword.trim() || startTime || endTime) {
        res = await searchMeasurementOfEmployee(
          searchKeyword,
          startTime,
          endTime,
          page,
          limit
        );
      } else {
        res = await getMeasurementOfUser(page, limit);
      }
      console.log("res", res);
      if (res.status === 200) {
        setMeasurements(res.metadata.measurements);
        setTotal(res.metadata.total);
        setCurrentPage(page);
      }
    } catch (error) {
      toast.error("Lấy dữ liệu lần đo thất bại");
    }
  };

  const fetchExperimentsOfUser = async () => {
    try {
      const res = await getExperimentByUserId(); // cần trả về mảng thí nghiệm [{ _id, title }]
      console.log("res", res);
      if (res.status === 200) {
        setExperiments(res.metadata); // metadata là mảng
      }
    } catch (error) {
      toast.error("Không lấy được danh sách thí nghiệm");
    }
  };

  const handleDeleteMeasurement = async (measurementId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa lần đo này?"
    );
    if (confirmDelete) {
      try {
        const res = await deleteMeasurement(measurementId);
        if (res.status === 200) {
          toast.success("Xóa lần đo thành công!");
          fetchMeasurementsOfEmployee();
        }
      } catch (error) {
        toast.error("Xóa lần đo thất bại");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const name = formData.name;
      const imageType = formData.imageType;
      const lensType = formData.lensType;
      const experimentId = formData.experimentId;
      const time = new Date(formData.time).toISOString();
      const res = await createMeasurement(
        name,
        experimentId,
        time,
        imageType,
        lensType
      );
      if (res.status === 200) {
        toast.success("Tạo lần đo thành công!");
        setFormData({ name: "", imageType: "", lensType: "", time: "" });
        setOpen(false);
        fetchMeasurementsOfEmployee();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchMeasurementsOfEmployee();
    fetchExperimentsOfUser();
  }, []);

  return (
    <DashbroardLayout activeMenu="Lần đo">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-medium flex items-center gap-2 text-gray-700">
                <span className="text-gray-700 font-medium">Các lần đo</span>
              </h5>
              <button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => setOpen(true)}
              >
                <IoAddOutline className="text-lg" />
                Thêm lần đo
              </button>
            </div>

            {/* Dialog Thêm */}
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              className="relative z-50"
            >
              <DialogBackdrop className="fixed inset-0 bg-black/50" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl">
                  <DialogTitle className="text-xl font-bold text-gray-900 mb-6">
                    Lần đo mới
                  </DialogTitle>

                  <form onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thí nghiệm
                      </label>
                      <select
                        id="experimentId"
                        value={formData.experimentId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">-- Chọn thí nghiệm --</option>
                        {experiments.map((exp) => (
                          <option key={exp._id} value={exp._id}>
                            {exp.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên lần đo
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại ảnh
                        </label>
                        <select
                          id="imageType"
                          value={formData.imageType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">-- Chọn loại ảnh --</option>
                          <option value="thường">Ảnh bình thường</option>
                          <option value="methylene">
                            Ảnh chụp xanh methylene
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại lăng kính
                        </label>
                        <select
                          id="lensType"
                          value={formData.lensType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="">-- Chọn loại lăng kính --</option>
                          <option value="thường">Lăng kính bình thường</option>
                          <option value="buồng đếm">Lăng kính buồng đếm</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thời điểm đo
                        </label>
                        <input
                          type="datetime-local"
                          id="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-2"
                              viewBox="0 0 24 24"
                            />
                            Đang tạo...
                          </div>
                        ) : (
                          "Tạo lần đo"
                        )}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </div>
            </Dialog>

            {/* Dialog chỉnh sửa */}
            <Dialog
              open={editOpen}
              onClose={() => setEditOpen(false)}
              className="relative z-50"
            >
              <DialogBackdrop className="fixed inset-0 bg-black/50" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
                  <DialogTitle className="text-xl font-bold mb-6">
                    Chỉnh sửa lần đo
                  </DialogTitle>
                  {editingMeasurement && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên thí nghiệm
                        </label>
                        <input
                          type="text"
                          value={editingMeasurement.experimentId.title || ""}
                          onChange={(e) =>
                            setEditingMeasurement({
                              ...editingMeasurement,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed text-gray-500"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tên lần đo
                        </label>
                        <input
                          type="text"
                          value={editingMeasurement.name || ""}
                          onChange={(e) =>
                            setEditingMeasurement({
                              ...editingMeasurement,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại ảnh
                        </label>
                        <select
                          value={editingMeasurement.imageType || ""}
                          disabled
                          className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed text-gray-500"
                        >
                          <option value="thường">Ảnh bình thường</option>
                          <option value="methylene">
                            Ảnh chụp xanh methylene
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Loại lăng kính
                        </label>
                        <select
                          value={editingMeasurement.lensType || ""}
                          disabled
                          className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed text-gray-500"
                        >
                          <option value="thường">Lăng kính bình thường</option>
                          <option value="buồng đếm">Lăng kính buồng đếm</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thời điểm
                        </label>
                        <input
                          type="datetime-local"
                          value={editingMeasurement.time?.slice(0, 16) || ""}
                          onChange={(e) =>
                            setEditingMeasurement({
                              ...editingMeasurement,
                              time: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded"
                          required
                        />
                      </div>

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
            <div className="flex flex-wrap gap-4 items-end mb-4">
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Nhập từ khóa..."
                  className="px-3 py-2 border rounded w-48"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Từ ngày
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="px-3 py-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Đến ngày
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="px-3 py-2 border rounded"
                />
              </div>

              <button
                onClick={() => fetchMeasurementsOfEmployee(1)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Tìm kiếm
              </button>
            </div>

            <MeasurementListTable
              tableData={measurements}
              onDelete={handleDeleteMeasurement}
              onEdit={handleOpenEdit}
            />
            <div className="flex justify-end mt-4 space-x-2">
              {getPagination(currentPage, Math.ceil(total / limit)).map(
                (page, i) =>
                  page === "..." ? (
                    <span key={i} className="px-3 py-1 text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={i}
                      onClick={() => fetchMeasurementsOfEmployee(page)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </DashbroardLayout>
  );
};

export default MeasurementOfEmployee;
