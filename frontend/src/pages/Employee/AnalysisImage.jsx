// AnalysisImage.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import { useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getImagesById, getJobStatus } from "../../services/ImageService";
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
  // const [hasFailed, setHasFailed] = useState(false);
  // const [hasError, setHasError] = useState(false);

  // const handleFailedImage = async (img) => {
  //   if (pollingIntervalRef.current) {
  //     clearInterval(pollingIntervalRef.current);
  //     pollingIntervalRef.current = null;
  //   }
  //   setHasFailed(true);
  //   toast.error("Phân tích ảnh thất bại");

  //   if (jobId) {
  //     try {
  //       await getJobStatus(jobId);
  //     } catch (err) {
  //       console.error("Gọi job status lần cuối thất bại:", err);
  //     }
  //   }

  //   if (img.measurementId) {
  //     window.location.href = `/images/${img.measurementId._id}`;
  //   }
  // };
  // const fetchImage = async () => {
  //   try {
  //     const res = await getImagesById(imageId);
  //     console.log("Image data:", res);
  //     if (res.status === 200 && res.metadata) {
  //       const img = res.metadata;
  //       setMeasurement(img.measurementId);
  //       setImage(img);

  //       if (img.status === "failed") {
  //         await handleFailedImage(img);
  //         return;
  //       }

  //       if (img.status === "completed") {
  //         await processImageStats(img);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Fetch image error:", error);
  //     toast.error("Không lấy được thông tin ảnh");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const processImageStats = async (img) => {
  //   try {
  //     let stats;
  //     if (measurement.imageType === "methylene") {
  //       stats = { alive: 0, dead: 0 };
  //       img.bacteriaData?.forEach((cell) => {
  //         if (cell.type === "alive") stats.alive++;
  //         else if (cell.type === "dead") stats.dead++;
  //       });
  //     } else {
  //       stats = {
  //         normal: 0,
  //         abnormal: 0,
  //         normal_2x: 0,
  //         abnormal_2x: 0,
  //       };
  //       img.bacteriaData?.forEach((cell) => {
  //         if (cell.type && stats.hasOwnProperty(cell.type)) {
  //           stats[cell.type]++;
  //         }
  //       });
  //     }
  //     setCellStats(stats);
  //   } catch (error) {
  //     console.error("Error processing stats:", error);
  //   }
  // };

  // useEffect(() => {
  //   const fetchAndPoll = async () => {
  //     await fetchImage();

  //     if (jobId) {
  //       pollingIntervalRef.current = setInterval(async () => {
  //         try {
  //           const jobRes = await getJobStatus(jobId);

  //           if (jobRes.status === "completed") {
  //             clearInterval(pollingIntervalRef.current);
  //             pollingIntervalRef.current = null;
  //             await fetchImage();
  //           } else if (jobRes.status === "failed") {
  //             clearInterval(pollingIntervalRef.current);
  //             pollingIntervalRef.current = null;
  //             await fetchImage();
  //           } else if (jobRes.status === "waiting") {
  //             toast.loading("Đang chờ phân tích ảnh...");
  //           } else if (jobRes.status !== "active") {
  //             clearInterval(pollingIntervalRef.current);
  //             pollingIntervalRef.current = null;
  //             toast.error("Trạng thái phân tích không xác định");
  //           }
  //         } catch (err) {
  //           console.error("Polling job status error:", err);
  //           if (pollingIntervalRef.current) {
  //             clearInterval(pollingIntervalRef.current);
  //             pollingIntervalRef.current = null;
  //           }
  //           if (!hasError) {
  //             setHasError(true);
  //             toast.error("Lỗi khi kiểm tra trạng thái phân tích");
  //           }
  //         }
  //       }, 5000);
  //     }
  //   };

  //   fetchAndPoll();

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
              normal: 0,
              abnormal: 0,
              normal_2x: 0,
              abnormal_2x: 0,
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
                  onCellClick={(cell) => setSelectedCell(cell)}
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
              alt={`Bacteria ${selectedCell.cell_id}`}
              className="max-w-full max-h-[85vh] object-contain mb-4"
            />
            <div className="grid grid-cols-2 gap-2 text-sm">
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
                <strong>Đường kính lồi:</strong>{" "}
                {selectedCell.CE_diameterconvexity}
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
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setSelectedCell(null)}
            >
              Đóng
            </button>
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
                  <span>{cellStats.normal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tế bào bất thường:</span>
                  <span>{cellStats.abnormal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nảy chồi bình thường:</span>
                  <span>{cellStats.normal_2x}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nảy chồi bất thường:</span>
                  <span>{cellStats.abnormal_2x}</span>
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
