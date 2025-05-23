// ListImages.jsx
import React, { useContext, useEffect, useState } from "react";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import { UserContext } from "../../context/userContext";
import { useUserAuth } from "../../hooks/useUserAuth";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteImage,
  getImagesByUserIdPage,
  getImagesInFactoryOfManager,
  searchImagesInFactoryOfManager,
  searchImagesOfUser,
} from "../../services/ImageService";
import ImageListTable from "../../components/ImageListTable";
import { getMeasurementByExperimentId } from "../../services/MeasurementService";
import { getExperimentByUserId, getExperimentByUserIdOfManager } from "../../services/ExperimentService";
import { getEmployeeInFactoryOfManager } from "../../services/UserService";
import ImageListTableManager from "../../components/Manager/ImageListTableManager";

const ImageOfManager = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10; // số thí nghiệm mỗi trang
  const [searchKeyword, setSearchKeyword] = useState("");
  const [experimentId, setExperimentId] = useState("");
  const [measurementId, setMeasurementId] = useState("");
  const [experiments, setExperiments] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employees, setEmployees] = useState([]);

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

  const fetchImagesOfUser = async (page = 1) => {
    try {
      let res;
      if (searchKeyword.trim() || experimentId || measurementId || employeeId) {
        res = await searchImagesInFactoryOfManager(page, limit, {
          name: searchKeyword,
          experimentId,
          measurementId,
          employeeId
        });
      } else {
        res = await getImagesInFactoryOfManager(page, limit);
      }
      console.log("res", res);
      if (res.status === 200) {
        setImages(res.metadata.images);
        setTotal(res.metadata.total);
        setCurrentPage(page);
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách ảnh");
    }
  };
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getEmployeeInFactoryOfManager(); // API này trả danh sách nhân viên
        setEmployees(res.metadata);
      } catch (error) {
        toast.error("Không thể tải danh sách người tạo");
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!employeeId) return setExperiments([]);
    const fetchDropdownData = async () => {
      try {
        const expRes = await getExperimentByUserIdOfManager(employeeId); // hoặc getExperimentsByUser(user._id)
        setExperiments(expRes.metadata || []);
      } catch (error) {
        toast.error("Không thể tải danh sách thí nghiệm");
      }
    };
    fetchDropdownData();
  }, [employeeId]);

  useEffect(() => {
    if (!experimentId) return setMeasurements([]);
    const fetchMeasurements = async () => {
      try {
        const res = await getMeasurementByExperimentId(experimentId);
        setMeasurements(res.metadata || []);
      } catch {
        toast.error("Không thể tải danh sách lần đo");
      }
    };
    fetchMeasurements();
  }, [experimentId]);

  useEffect(() => {
    fetchImagesOfUser();
  }, []);

  return (
    <DashbroardLayout activeMenu="Hình ảnh">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-medium flex items-center gap-2 text-gray-700">
                <span className="text-gray-700 font-medium">Danh sách ảnh</span>
              </h5>
            </div>
            <div className="flex flex-wrap gap-4 items-end mb-4">
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Người tạo
                </label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="px-3 py-2 border rounded w-48"
                >
                  <option value="">Tất cả</option>
                  {employees.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Thí nghiệm
                </label>
                <select
                  value={experimentId}
                  onChange={(e) => setExperimentId(e.target.value)}
                  className="px-3 py-2 border rounded w-48"
                >
                  <option value="">Tất cả</option>
                  {experiments.map((exp) => (
                    <option key={exp._id} value={exp._id}>
                      {exp.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Lần đo
                </label>
                <select
                  value={measurementId}
                  onChange={(e) => setMeasurementId(e.target.value)}
                  className="px-3 py-2 border rounded w-48"
                >
                  <option value="">Tất cả</option>
                  {measurements.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Tên ảnh
                </label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Nhập từ khóa..."
                  className="px-3 py-2 border rounded w-48"
                />
              </div>
              <button
                onClick={() => fetchImagesOfUser(1)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Tìm kiếm
              </button>
            </div>

            <ImageListTableManager tableData={images}/>
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
                      onClick={() => fetchImagesOfUser(page)}
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

export default ImageOfManager;
