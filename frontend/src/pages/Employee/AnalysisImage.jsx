import React, { useContext, useEffect, useState } from "react";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import { UserContext } from "../../context/userContext";
import { useUserAuth } from "../../hooks/useUserAuth";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { getImagesById } from "../../services/ImageService";
import BacteriaImage from "../../components/BacteriaImage";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const AnalysisImage = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const { imageId } = useParams();
  const [image, setImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [cellStats, setCellStats] = useState(null);

  const fetchImage = async () => {
    try {
      const res = await getImagesById(imageId);
      console.log(res);
      if (res.status === 200) {
        setImage(res.metadata);
        let stats;

        if (res.metadata.imageType === "methylene") {
          stats = {
            alive: 0,
            dead: 0,
          };
          res.metadata.bacteriaData?.forEach((cell) => {
            if (cell.status === "alive") stats.alive++;
            else if (cell.status === "dead") stats.dead++;
          });
        } else {
          stats = {
            normal: 0,
            abnormal: 0,
            normal_2x: 0,
            abnormal_2x: 0,
          };
          res.metadata.bacteriaData?.forEach((cell) => {
            if (cell.type && stats.hasOwnProperty(cell.type)) {
              stats[cell.type]++;
            }
          });
        }
        setCellStats(stats);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      toast.error("Failed to fetch image");
    }
  };

  const LegendBox = ({ color, label }) => (
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded-sm"
        style={{ backgroundColor: color }}
      ></div>
      <span className="text-sm">{label}</span>
    </div>
  );

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <DashbroardLayout activeMenu="Thí nghiệm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Ảnh gốc</h2>
          {image && (
            <img
              src={`data:image/png;base64,${image.originalImage}`}
              alt="Original"
              className="w-full rounded shadow"
            />
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Ảnh phân tích</h2>
          {image && (
            <div className="cursor-pointer" onClick={() => setModalOpen(true)}>
              <BacteriaImage
                base64Image={image.originalImage}
                bacteriaData={image.bacteriaData}
              />
            </div>
          )}
        </div>

        {image?.imageType !== "methylene" && image?.maskImage && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Ảnh mask</h2>
            <img
              src={`data:image/png;base64,${image.maskImage}`}
              alt="Mask"
              className="w-full rounded shadow"
            />
          </div>
        )}
      </div>

      {/* Modal hiển thị ảnh phân tích phóng to */}
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
                  base64Image={image.originalImage}
                  bacteriaData={image.bacteriaData}
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
                <strong>Diện tích (area):</strong> {selectedCell.area}
              </div>
              <div>
                <strong>Chu vi (perimeter):</strong> {selectedCell.perimeter}
              </div>
              <div>
                <strong>Độ tròn (circularity):</strong>{" "}
                {selectedCell.circularity}
              </div>
              <div>
                <strong>Đường kính lồi (CE_diameterconvexity):</strong>{" "}
                {selectedCell.CE_diameterconvexity}
              </div>
              <div>
                <strong>Trục lớn (major axis):</strong>{" "}
                {selectedCell.major_axis_length}
              </div>
              <div>
                <strong>Trục nhỏ (minor axis):</strong>{" "}
                {selectedCell.minor_axis_length}
              </div>
              <div>
                <strong>Tỉ lệ khung hình (aspect ratio):</strong>{" "}
                {selectedCell.aspect_ratio}
              </div>
              <div>
                <strong>Khoảng cách lớn nhất (max distance):</strong>{" "}
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
            {image?.imageType === "methylene" ? (
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
                  <span>Tế bào đang nảy chồi bình thường:</span>
                  <span>{cellStats.normal_2x}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tế bào đang nảy chồi bất thường:</span>
                  <span>{cellStats.abnormal_2x}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {image?.imageType === "methylene" ? (
        <div className="mt-4 flex flex-wrap gap-4">
          <LegendBox color="green" label="Tế bào sống" />
          <LegendBox color="gray" label="Tế bào chết" />
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-4">
          <LegendBox color="green" label="Tế bào bình thường" />
          <LegendBox color="red" label="Tế bào bất thường" />
          <LegendBox color="blue" label="Tế bào nảy chồi bình thường" />
          <LegendBox color="purple" label="Tế bào nảy chồi bất thường" />
        </div>
      )}
    </DashbroardLayout>
  );
};

export default AnalysisImage;
