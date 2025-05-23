import React, { useContext, useEffect, useState } from "react";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import { UserContext } from "../../context/userContext";
import { useUserAuth } from "../../hooks/useUserAuth";
import toast from "react-hot-toast";
import { getMeasurementsInFactoryOfManager, searchMeasurementsInFactoryOfManager } from "../../services/MeasurementService";
import MeasurementListTableManager from "../../components/Manager/MeasurementListTableManager";

const MeasurementOfManager = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const [measurements, setMeasurements] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5; // số thí nghiệm mỗi trang
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [experimentTitle, setExperimentTitle] = useState("");

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
      if (
        name.trim() ||
        creatorName.trim() ||
        experimentTitle.trim() ||
        startTime ||
        endTime
      ) {
        res = await searchMeasurementsInFactoryOfManager(
          name,
          creatorName,
          experimentTitle,
          startTime,
          endTime,
          page,
          limit
        );
      } else {
        res = await getMeasurementsInFactoryOfManager(page, limit);
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

  useEffect(() => {
    fetchMeasurementsOfEmployee();
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
            </div>
            <div className="flex flex-wrap gap-4 items-end mb-4">
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Người tạo
                </label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="Nhập tên người tạo..."
                  className="px-3 py-2 border rounded w-48"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Tiêu đề thí nghiệm
                </label>
                <input
                  type="text"
                  value={experimentTitle}
                  onChange={(e) => setExperimentTitle(e.target.value)}
                  placeholder="Nhập tiêu đề..."
                  className="px-3 py-2 border rounded w-48"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

            <MeasurementListTableManager tableData={measurements} />
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
                      onClick={() =>
                        typeof page === "number" &&
                        fetchMeasurementsOfEmployee(page)
                      }
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

export default MeasurementOfManager;
