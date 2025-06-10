// AnalysisImage.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import { useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  editTypeBacteria,
  getImagesById,
  getJobStatus,
  reportBacteria,
  updateInfoBacteria,
} from "../../services/ImageService";
import BacteriaImage from "../../components/BacteriaImage";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const AnalysisImage = () => {
  useUserAuth();
  const { imageId } = useParams();
  const { user } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const pollingIntervalRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellStats, setCellStats] = useState(null);
  const [showSquares, setShowSquares] = useState(true);
  const [measurement, setMeasurement] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [editedType, setEditedType] = useState("");

  const handleCellClick = async (cell) => {
    try {
      const res = await updateInfoBacteria(imageId, cell.cell_id);
      console.log("Cell info response:", res);
      if (res.status === 200 && res.metadata) {
        setSelectedCell(res.metadata);
      } else {
        setSelectedCell(cell);
        toast.error("Không lấy được thông tin tế bào");
      }
    } catch (error) {
      console.error("Error fetching cell info:", error);
      toast.error("Lỗi khi lấy thông tin tế bào");
    }
  };

  const handleDownloadMask = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maskImg = new Image();
    maskImg.crossOrigin = "anonymous";
    maskImg.src = `http://localhost:3055${image.maskImage}`;

    maskImg.onload = () => {
      canvas.width = maskImg.naturalWidth;
      canvas.height = maskImg.naturalHeight;

      ctx.drawImage(maskImg, 0, 0);

      const link = document.createElement("a");
      link.download = `mask-${image.name || image._id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    maskImg.onerror = () => {
      console.error("Không thể tải ảnh mask");
      toast.error("Không thể tải ảnh mask");
    };
  };

  const fetchImage = async () => {
    try {
      const res = await getImagesById(imageId);
      console.log("Fetched image data:", res);
      if (res.status === 200 && res.metadata) {
        const img = res.metadata;
        setImage(img);
        setMeasurement(img.measurementId);
        const meas = img.measurementId;

        if (img.status === "pending" && jobId) {
          const intervalId = setInterval(async () => {
            try {
              const jobRes = await getJobStatus(jobId);
              console.log("Job status response:", jobRes);
              if (jobRes.status === "completed") {
                clearInterval(intervalId);
                pollingIntervalRef.current = null;
                toast.success("Phân tích ảnh hoàn tất");
                fetchImage();
              } else if (jobRes.status === "failed") {
                clearInterval(intervalId);
                pollingIntervalRef.current = null;
                toast.error("Phân tích ảnh thất bại");
              }
            } catch (err) {
              console.error("Polling job status error:", err);
            }
          }, 5000);
          pollingIntervalRef.current = intervalId;
        }

        if (img.status === "completed") {
          let stats;
          if (meas.imageType === "methylene") {
            stats = { alive: 0, dead: 0 };
            img.bacteriaData?.forEach((cell) => {
              if (cell.type === "alive") stats.alive++;
              else if (cell.type === "dead") stats.dead++;
            });
          } else {
            stats = {
              Normal: 0,
              Abnormal: 0,
              Normal_2x: 0,
              Abnormal_2x: 0,
            };
            img.bacteriaData?.forEach((cell) => {
              if (cell.type && stats.hasOwnProperty(cell.type)) {
                stats[cell.type]++;
              }
            });
          }
          setCellStats(stats);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Fetch image error:", error);
      toast.error("Không lấy được thông tin ảnh");
      setLoading(false);
    }
  };
  const handleEditSubmit = async () => {
    try {
      const res = await editTypeBacteria(
        imageId,
        selectedCell.cell_id,
        editedType
      );
      if (res.status === 200) {
        toast.success("Đã gửi báo lỗi thành công");
        setEditMode(false);
        setSelectedCell(null);
        fetchImage();
      }
    } catch (error) {
      console.error("Error submitting edit:", error);
      toast.error("Gửi báo lỗi thất bại");
    }
  };

  useEffect(() => {
    if (selectedCell) {
      setEditedType(selectedCell.type || "");
      setEditMode(false);
    }
  }, [selectedCell]);

  useEffect(() => {
    fetchImage();
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  const LegendBox = ({ color, label }) => (
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded-sm"
        style={{ backgroundColor: color }}
      ></div>
      <span className="text-sm">{label}</span>
    </div>
  );

  if (loading || (image && image.status !== "completed")) {
    return (
      <DashbroardLayout activeMenu="Thí nghiệm">
        <div className="text-center mt-20 text-lg font-semibold">
          Ảnh đang được phân tích, vui lòng đợi...
        </div>
        {image && (
          <div className="mt-6 max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-2 text-center">Ảnh gốc</h2>
            <img
              src={`http://localhost:3055${image.originalImage}`}
              alt="Original"
              className="w-full rounded shadow"
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/uploads/mau.jpeg";
              }}
            />
          </div>
        )}
      </DashbroardLayout>
    );
  }

  return (
    <DashbroardLayout activeMenu="Thí nghiệm">
      <div className="bg-white rounded shadow p-4 my-6">
        <h1 className="text-xl font-bold text-indigo-700 mb-2">
          {measurement?.experimentId?.title || "Chưa có tiêu đề thí nghiệm"}
        </h1>
        <div className="text-gray-700 text-sm space-y-1">
          <div>
            <strong>Tên lần đo:</strong> {measurement?.name || "Không có"}
          </div>
          <div>
            <strong>Tên ảnh:</strong> {image?.name || "Không rõ"}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Ảnh gốc</h2>
          {image && (
            <img
              src={`http://localhost:3055${image.originalImage}`}
              alt="Original"
              className="w-full rounded shadow"
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/uploads/mau.jpeg";
              }}
            />
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Ảnh phân tích</h2>
          {image && (
            <div className="cursor-pointer" onClick={() => setModalOpen(true)}>
              <BacteriaImage
                imagePath={`http://localhost:3055${image.originalImage}`}
                bacteriaData={image.bacteriaData}
                lensType={measurement.lensType}
                points={image.points}
                showSquares={showSquares}
                modalOpen={modalOpen}
              />
            </div>
          )}
        </div>

        {measurement?.imageType !== "methylene" && image?.maskImage && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Ảnh mask</h2>
            <img
              src={`http://localhost:3055${image.maskImage}`}
              alt="Mask"
              className="w-full rounded shadow"
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/uploads/mau.jpeg";
              }}
            />
            <div className="mt-2 text-center">
              <button
                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 shadow"
                onClick={handleDownloadMask}
              >
                Tải ảnh mask
              </button>
            </div>
          </div>
        )}
      </div>
      {measurement?.lensType === "buồng đếm" && (
        <div className="my-4">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={() => setShowSquares((prev) => !prev)}
          >
            {showSquares ? "Ẩn 16 ô vuông" : "Hiện 16 ô vuông"}
          </button>
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded p-4 max-w-[90%] max-h-[90%] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <TransformWrapper minScale={0.5} maxScale={5} initialScale={1}>
              <TransformComponent>
                <BacteriaImage
                  imagePath={`http://localhost:3055${image.originalImage}`}
                  bacteriaData={image.bacteriaData}
                  lensType={measurement.lensType}
                  points={image.points}
                  showSquares={showSquares}
                  onCellClick={(cell) => handleCellClick(cell)}
                  modalOpen={modalOpen}
                />
              </TransformComponent>
            </TransformWrapper>
            <div className="text-center mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={() => setModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCell && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
          onClick={() => setSelectedCell(null)}
        >
          <div
            className="bg-white p-4 rounded shadow-lg max-w-[90%] max-h-[90%] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">
              Vi khuẩn {selectedCell.cell_id}
            </h3>
            <img
              src={`data:image/png;base64,${selectedCell.image}`}
              alt={`Nấm men ${selectedCell.cell_id}`}
              className="w-28 h-28 object-contain mx-auto mb-4 rounded shadow"
            />
            <div className="space-y-2 text-sm">
              <div>
                <strong>Diện tích:</strong> {selectedCell.area}
              </div>
              <div>
                <strong>Chu vi:</strong> {selectedCell.perimeter}
              </div>
              <div>
                <strong>Độ tròn:</strong> {selectedCell.circularity}
              </div>
              <div>
                <strong>Đường kính lồi:</strong> {selectedCell.CE_diameter}
              </div>
              <div>
                <strong>Trục lớn:</strong> {selectedCell.major_axis_length}
              </div>
              <div>
                <strong>Trục nhỏ:</strong> {selectedCell.minor_axis_length}
              </div>
              <div>
                <strong>Tỉ lệ khung hình:</strong> {selectedCell.aspect_ratio}
              </div>
              <div>
                <strong>Khoảng cách lớn nhất:</strong>{" "}
                {selectedCell.max_distance}
              </div>
            </div>

            <div className="flex gap-2 mt-4 flex-wrap">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setSelectedCell(null)}
              >
                Đóng
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setEditMode(true)}
              >
                Chỉnh sửa loại
              </button>
              <button
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                onClick={() => setReportMode(true)}
              >
                Báo lỗi AI
              </button>
            </div>

            {reportMode && (
              <div className="mt-4 space-y-4">
                {/* PHẦN 1: Checkbox báo sai loại tế bào */}
                <div className="border rounded p-3">
                  <label className="flex items-center gap-2 text-sm text-yellow-700">
                    <input
                      type="checkbox"
                      checked={selectedCell?.wrongType || false}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setSelectedCell((prev) => ({
                          ...prev,
                          wrongType: isChecked,
                        }));
                        if (isChecked)
                          toast.success("Đã đánh dấu sai loại tế bào");
                      }}
                    />
                    ⚠️ Nhận diện sai loại tế bào
                  </label>
                </div>

                {/* PHẦN 2: Checkbox báo sai bounding box */}
                <div className="border rounded p-3">
                  <label className="flex items-center gap-2 text-sm text-red-700">
                    <input
                      type="checkbox"
                      checked={selectedCell?.wrongBox || false}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setSelectedCell((prev) => ({
                          ...prev,
                          wrongBox: isChecked,
                        }));
                        if (isChecked)
                          toast.success("Đã đánh dấu sai bounding box");
                      }}
                    />
                    🚩 Box bao không đúng vị trí tế bào
                  </label>
                </div>

                {/* Gửi báo cáo */}
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={async () => {
                      try {
                        const res = await reportBacteria(
                          imageId,
                          selectedCell.cell_id,
                          selectedCell.wrongType,
                          selectedCell.wrongBox
                        );
                        if (res.status === 200) {
                          toast.success("Đã gửi báo cáo thành công");
                          setReportMode(false);
                          setSelectedCell(null);
                          fetchImage();
                        }
                      } catch (error) {
                        console.error("Report error:", error);
                        toast.error("Lỗi khi gửi báo cáo");
                      }
                    }}
                  >
                    Gửi báo cáo
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                    onClick={() => setReportMode(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}

            {editMode && (
              <div className="mt-4 space-y-2">
                <div>
                  <label className="block text-sm font-medium">
                    Chỉnh sửa loại tế bào:
                  </label>
                  <select
                    className="border rounded p-1"
                    value={editedType}
                    onChange={(e) => setEditedType(e.target.value)}
                  >
                    <option value="Normal">Bình thường</option>
                    <option value="Abnormal">Bất thường</option>
                    <option value="Normal_2x">Nảy chồi bình thường</option>
                    <option value="Abnormal_2x">Nảy chồi bất thường</option>
                    <option value="Alive">Tế bào sống</option>
                    <option value="Dead">Tế bào chết</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded"
                    onClick={handleEditSubmit}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-400 text-white rounded"
                    onClick={() => setEditMode(false)}
                  >
                    Huỷ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {cellStats && (
        <div className="mt-6 bg-white rounded shadow p-4 w-full max-w-md">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">
            Phân tích <span className="float-right">Số lượng</span>
          </h3>
          <div className="space-y-2">
            {measurement?.imageType === "methylene" ? (
              <>
                <div className="flex justify-between">
                  <span>Tế bào sống:</span>
                  <span>{cellStats.alive}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tế bào chết:</span>
                  <span>{cellStats.dead}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>Tế bào bình thường:</span>
                  <span>{cellStats.Normal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tế bào bất thường:</span>
                  <span>{cellStats.Abnormal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nảy chồi bình thường:</span>
                  <span>{cellStats.Normal_2x}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nảy chồi bất thường:</span>
                  <span>{cellStats.Abnormal_2x}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {measurement?.imageType === "methylene" ? (
        <div className="mt-4 flex flex-wrap gap-4">
          <LegendBox color="green" label="Tế bào sống" />
          <LegendBox color="red" label="Tế bào chết" />
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-4">
          <LegendBox color="green" label="Bình thường" />
          <LegendBox color="red" label="Bất thường" />
          <LegendBox color="blue" label="Nảy chồi bình thường" />
          <LegendBox color="purple" label="Nảy chồi bất thường" />
        </div>
      )}
    </DashbroardLayout>
  );
};

export default AnalysisImage;
