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
  updateMeasurement,
} from "../../services/MeasurementService";
import { useParams } from "react-router-dom";
import { getExperimentById } from "../../services/ExperimentService";

const Measurement = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [measurements, setMeasurements] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { experimentId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    time: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [experimentTitle, setExperimentTitle] = useState("");

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
        fetchMeasurements();
        setEditOpen(false);
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Error updating measurement:", error);
      toast.error("Lỗi kết nối khi cập nhật!");
    }
  };

  const fetchExperiment = async () => {
    try {
      const res = await getExperimentById(experimentId);
      if (res.status === 200) {
        setExperimentTitle(res.metadata.title);
      }
    } catch {
      toast.error("Không lấy được thông tin thí nghiệm");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const fetchMeasurements = async () => {
    try {
      const res = await getMeasurementByExperimentId(experimentId);
      if (res.status === 200) {
        setMeasurements(res.metadata);
      }
    } catch (error) {
      toast.error("Lấy dữ liệu lần đo thất bại");
    }
  };

  const handleDeleteMeasurement = async (measurementId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa lần đo này?");
    if (confirmDelete) {
      try {
        const res = await deleteMeasurement(measurementId);
        if (res.status === 200) {
          toast.success("Xóa lần đo thành công!");
          fetchMeasurements();
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
      const time = new Date(formData.time).toISOString();
      const res = await createMeasurement(name, experimentId, time);
      if (res.status === 200) {
        toast.success("Tạo lần đo thành công!");
        setFormData({ name: "", time: "" });
        setOpen(false);
        fetchMeasurements();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchMeasurements();
    fetchExperiment();
  }, []);

  return (
    <DashbroardLayout activeMenu="Thí nghiệm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-medium flex items-center gap-2 text-gray-700">
                <span>{experimentTitle}</span>
                <span className="text-gray-400">/</span>
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
            <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
              <DialogBackdrop className="fixed inset-0 bg-black/50" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl">
                  <DialogTitle className="text-xl font-bold text-gray-900 mb-6">
                    Lần đo mới
                  </DialogTitle>

                  <form onSubmit={handleSubmit}>
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
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" />
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
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} className="relative z-50">
              <DialogBackdrop className="fixed inset-0 bg-black/50" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-lg rounded-xl bg-white p-8 shadow-2xl">
                  <DialogTitle className="text-xl font-bold mb-6">Chỉnh sửa lần đo</DialogTitle>
                  {editingMeasurement && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
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

            <MeasurementListTable
              tableData={measurements}
              onDelete={handleDeleteMeasurement}
              onEdit={handleOpenEdit}
            />
          </div>
        </div>
      </div>
    </DashbroardLayout>
  );
};

export default Measurement;
