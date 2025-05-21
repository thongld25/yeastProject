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
import ExperimentListTable from "../../components/ExperimentListTable";
import {
  createExperiment,
  deleteExperiment,
  getExperimentsOfEmployee,
  searchExperimentsOfEmployee,
  updateExperiment,
} from "../../services/ExperimentService";
import toast from "react-hot-toast";

const Experiment = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [experiments, setExperiments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingExperiment, setEditingExperiment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5; // số thí nghiệm mỗi trang
  const [searchKeyword, setSearchKeyword] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "", // Thêm trường mô tả
    time: "", // Đổi từ location sang time
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleOpenEdit = (experiment) => {
    setEditingExperiment(experiment);
    setEditOpen(true);
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

  const fetchExperiments = async (page = 1) => {
    try {
      let res;
      if (searchKeyword.trim() || startTime || endTime) {
        res = await searchExperimentsOfEmployee(
          searchKeyword,
          startTime,
          endTime,
          page,
          limit
        );
      } else {
        res = await getExperimentsOfEmployee(page, limit);
      }

      if (res.status === 200) {
        setExperiments(res.metadata.experiments);
        setTotal(res.metadata.total);
        setCurrentPage(page);
      }
    } catch (error) {
      toast.error("Lỗi khi tìm kiếm thí nghiệm");
    }
  };

  const handleDeleteExperiment = async (experimentId) => {
    try {
      const res = await deleteExperiment(experimentId);
      if (res.status === 200) {
        console.log("Experiment deleted successfully!", res);
        toast.success("Xóa thí nghiệm thành công!");
        fetchExperiments(); // Fetch updated experiments
      } else {
        toast.error("Xóa thí nghiệm không thành công!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa thí nghiệm");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { _id, ...data } = editingExperiment;
      const res = await updateExperiment(_id, data);
      if (res.status === 200) {
        toast.success("Cập nhật thí nghiệm thành công!");
        fetchExperiments();
        setEditOpen(false);
      } else {
        toast.error("Cập nhật không thành công");
      }
    } catch {
      toast.error("Lỗi khi cập nhật thí nghiệm");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await createExperiment(
        formData.title,
        formData.description,
        formData.time
      );
      if (res.status === 200) {
        console.log("Experiment created successfully!", res);
        setFormData({ title: "", description: "", time: "" }); // Reset form
        toast.success("Tạo thí nghiệm thành công!");
        fetchExperiments(); // Fetch updated experiments
      }
      console.log("Experiment Data:", formData);
      setOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Lỗi khi tạo thí nghiệm");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  return (
    <DashbroardLayout activeMenu="Thí nghiệm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-semibold">Các thí nghiệm</h5>
              <button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => setOpen(true)}
              >
                <IoAddOutline className="text-lg" />
                Thêm thí nghiệm
              </button>
            </div>

            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              className="relative z-50"
            >
              <DialogBackdrop className="fixed inset-0 bg-black/50" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
                  <DialogTitle className="text-xl font-bold text-gray-900 mb-6">
                    Thí nghiệm mới
                  </DialogTitle>

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      {/* Tên thí nghiệm */}
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Tiêu đề
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder=""
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Mô tả
                        </label>
                        <input
                          type="text"
                          id="description"
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder=""
                          required
                        />
                      </div>

                      {/* Thời gian thí nghiệm */}
                      <div>
                        <label
                          htmlFor="time"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Thời điểm thí nghiệm
                        </label>
                        <input
                          type="datetime-local"
                          id="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 relative ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-2 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Đang tạo...
                          </div>
                        ) : (
                          "Tạo thí nghiệm"
                        )}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </div>
            </Dialog>
            <Dialog
              open={editOpen}
              onClose={() => setEditOpen(false)}
              className="relative z-50"
            >
              <DialogBackdrop className="fixed inset-0 bg-black/50" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
                  <DialogTitle className="text-xl font-bold mb-6">
                    Chỉnh sửa thí nghiệm
                  </DialogTitle>
                  {editingExperiment && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Tiêu đề
                        </label>
                        <input
                          type="text"
                          value={editingExperiment.title}
                          onChange={(e) =>
                            setEditingExperiment({
                              ...editingExperiment,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Mô tả
                        </label>
                        <input
                          type="text"
                          value={editingExperiment.description}
                          onChange={(e) =>
                            setEditingExperiment({
                              ...editingExperiment,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Thời điểm
                        </label>
                        <input
                          type="datetime-local"
                          value={editingExperiment.time?.slice(0, 16) || ""}
                          onChange={(e) =>
                            setEditingExperiment({
                              ...editingExperiment,
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
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
                  Tiêu đề
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
                onClick={() => fetchExperiments(1)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Tìm kiếm
              </button>
            </div>

            <ExperimentListTable
              tableData={experiments}
              onDelete={handleDeleteExperiment}
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
                      onClick={() => fetchExperiments(page)}
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

export default Experiment;
