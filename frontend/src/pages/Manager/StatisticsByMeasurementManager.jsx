import React, { useEffect, useState, useRef } from "react";
import DashbroardLayout from "../../components/layouts/DashbroardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getStatictisOfMeasurement } from "../../services/StatictisService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import nunitoSansBase64 from "../../utils/nunito-sans-base64";
import {
  getExperimentByUserId,
  getExperimentByUserIdOfManager,
  getExperimentsOfEmployee,
} from "../../services/ExperimentService";
import {
  getMeasurementByExperimentId,
  getMeasurementById,
} from "../../services/MeasurementService";
import { useSearchParams } from "react-router-dom";
import { getEmployeeInFactoryOfManager } from "../../services/UserService";

const COLORS = {
  normal: "#60a5fa",
  abnormal: "#f97316",
  normal_2x: "#10b981",
  abnormal_2x: "#facc15",
  alive: "#34d399",
  dead: "#f87171",
};

const PDF_TABLE_HEADERS = [
  "Tên ảnh",
  "Normal",
  "Abnormal",
  "Normal 2x",
  "Abnormal 2x",
  "Tế bào sống",
  "Tế bào chết",
  "% Sống",
  "% Chết",
];

const StatisticsByMeasurementManager = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [experimentName, setExperimentName] = useState("");
  const [measurementName, setMeasurementName] = useState("");
  const [imageType, setImageType] = useState("");
  const chartRef = useRef();
  const tableRef = useRef();
  const [experiments, setExperiments] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [selectedExperimentId, setSelectedExperimentId] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedMeasurementId, setSelectedMeasurementId] = useState(
    () => searchParams.get("measurementId") || ""
  );
  const [creators, setCreators] = useState([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState("");

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const res = await getEmployeeInFactoryOfManager();
        console.log(res); // Tạo API này
        setCreators(res.metadata);
      } catch (error) {
        console.error("Lỗi khi tải danh sách người tạo:", error);
      }
    };
    fetchCreators();
  }, []);

  useEffect(() => {
    if (!selectedCreatorId) {
      setExperiments([]);
      return;
    }
    const fetchExperiments = async () => {
      try {
        const res = await getExperimentByUserIdOfManager(selectedCreatorId); // bạn cần tạo hàm API này
        console.log(res);
        setExperiments(res.metadata);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thí nghiệm:", error);
      }
    };
    fetchExperiments();
  }, [selectedCreatorId]);

  useEffect(() => {
    const measurementIdFromURL = searchParams.get("measurementId");
    if (!measurementIdFromURL) return;

    const initSelected = async () => {
      try {
        const res = await getMeasurementById(measurementIdFromURL);
        if (res.status === 200) {
          const measurement = res.metadata;
          console.log(measurement);
          setSelectedExperimentId(measurement.experimentId._id); // điền thí nghiệm
          setSelectedMeasurementId(measurement._id); // điền lần đo
        }
      } catch (error) {
        console.error("Không thể khởi tạo dữ liệu từ URL", error);
      }
    };

    initSelected();
  }, []);

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!selectedExperimentId) return;
      try {
        const res = await getMeasurementByExperimentId(selectedExperimentId); // cần tạo API này
        console.log(res);
        setMeasurements(res.metadata);
      } catch (error) {
        console.error("Lỗi khi tải lần đo:", error);
      }
    };
    fetchMeasurements();
  }, [selectedExperimentId]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedMeasurementId) return;
      setLoading(true);
      try {
        const res = await getStatictisOfMeasurement(selectedMeasurementId); // truyền ID lần đo
        const {
          name,
          email,
          time,
          experimentName,
          measurementName,
          imageType,
          statictis,
        } = res.metadata;
        setName(name);
        setEmail(email);
        setTime(new Date(time).toLocaleString());
        setExperimentName(experimentName);
        setMeasurementName(measurementName);
        setImageType(imageType);
        console.log(statictis);

        const enrichedData = statictis.map((item) => {
          let total;
          if (imageType === "methylene") {
            total = item.alive + item.dead;
          } else {
            total =
              item.normal + item.abnormal + item.normal_2x + item.abnormal_2x;
          }
          return {
            ...item,
            total,
            ratio_alive: total ? ((item.alive / total) * 100).toFixed(1) : "0",
            ratio_dead: total ? ((item.dead / total) * 100).toFixed(1) : "0",
          };
        });

        setData(enrichedData);
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [selectedMeasurementId]);

  const registerVietnameseFont = (doc) => {
    try {
      doc.addFileToVFS("NunitoSans.ttf", nunitoSansBase64);
      doc.addFont("NunitoSans.ttf", "NunitoSans", "normal");
      doc.setFont("NunitoSans");
    } catch (error) {
      console.error("Lỗi đăng ký font:", error);
    }
  };

  const exportToPDF = async () => {
    const doc = new jsPDF("landscape");
    registerVietnameseFont(doc);

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFontSize(20);
    doc.setFont("NunitoSans");
    doc.text("BÁO CÁO THỐNG KÊ TÌNH TRẠNG NẤM MEN", pageWidth / 2, 20, {
      align: "center",
    });

    doc.setFontSize(13);
    doc.setFont("NunitoSans", "normal");
    doc.text(`Người thực hiện: ${name}`, 15, 30);
    doc.text(`Email: ${email}`, 15, 38);
    doc.text(`Tên thí nghiệm: ${experimentName}`, 15, 46);
    doc.text(`Tên lần đo: ${measurementName}`, 15, 54);
    doc.text(`Thời gian đo: ${time}`, 15, 62);

    // Ảnh bảng
    const tableCanvas = await html2canvas(tableRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });
    const tableImgData = tableCanvas.toDataURL("image/png");
    const tableImgHeight = (tableCanvas.height * pageWidth) / tableCanvas.width;

    const tableY = 68;
    doc.addImage(
      tableImgData,
      "PNG",
      15,
      tableY,
      pageWidth - 30,
      tableImgHeight
    );

    // Ảnh biểu đồ
    const chartCanvas = await html2canvas(chartRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });
    const chartImgData = chartCanvas.toDataURL("image/png");
    const chartImgHeight = (chartCanvas.height * pageWidth) / chartCanvas.width;

    const chartY = tableY + tableImgHeight + 10;

    if (chartY + chartImgHeight <= pageHeight - 15) {
      // Nếu còn chỗ thì vẽ luôn trong trang này
      doc.addImage(
        chartImgData,
        "PNG",
        15,
        chartY,
        pageWidth - 30,
        chartImgHeight
      );
    } else {
      // Nếu không đủ chỗ, thêm trang mới
      doc.addPage();
      doc.addImage(chartImgData, "PNG", 15, 15, pageWidth - 30, chartImgHeight);
    }

    doc.save(`BaoCaoThongKe_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <DashbroardLayout activeMenu="Theo lần đo">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Thống kê theo lần đo
        </h2>
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Chọn người tạo:
            </label>
            <select
              value={selectedCreatorId}
              onChange={(e) => {
                setSelectedCreatorId(e.target.value);
                setSelectedExperimentId("");
                setSelectedMeasurementId("");
              }}
              className="border rounded px-3 py-2 w-64"
            >
              <option value="">-- Chọn người tạo --</option>
              {creators.map((creator) => (
                <option key={creator._id} value={creator._id}>
                  {creator.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Chọn thí nghiệm:
            </label>
            <select
              value={selectedExperimentId}
              onChange={(e) => setSelectedExperimentId(e.target.value)}
              className="border rounded px-3 py-2 w-64"
            >
              <option value="">-- Chọn thí nghiệm --</option>
              {experiments.map((exp) => (
                <option key={exp._id} value={exp._id}>
                  {exp.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Chọn lần đo:
            </label>
            <select
              value={selectedMeasurementId}
              onChange={(e) => setSelectedMeasurementId(e.target.value)}
              className="border rounded px-3 py-2 w-64"
              disabled={!measurements.length}
            >
              <option value="">-- Chọn lần đo --</option>
              {measurements.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} - {new Date(m.time).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div className="text-left space-y-1.5">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">Người thực hiện: </span>
                  <span className="font-normal">{name}</span>
                </p>
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">Email: </span>
                  <span className="font-normal">{email}</span>
                </p>
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">Thời gian của lần đo: </span>
                  <span className="font-normal">{time}</span>
                </p>
              </div>
            </div>

            <div
              ref={tableRef}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              style={{
                backgroundColor: "#ffffff",
              }}
            >
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Tên ảnh</th>
                    {imageType === "methylene" ? (
                      <>
                        <th className="px-4 py-2 text-center font-medium">
                          Tế bào sống
                        </th>
                        <th className="px-4 py-2 text-center font-medium">
                          Tế bào chết
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-4 py-2 text-center font-medium">
                          Tế bào bình thường
                        </th>
                        <th className="px-4 py-2 text-center font-medium">
                          Tế bào bất thường
                        </th>
                        <th className="px-4 py-2 text-center font-medium">
                          Tế bào nảy chồi bình thường
                        </th>
                        <th className="px-4 py-2 text-center font-medium">
                          Tế bào nảy chồi bất thường
                        </th>
                      </>
                    )}
                    <th className="px-4 py-2 text-center font-medium">Tổng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 font-medium whitespace-nowrap">
                        {row.name}
                      </td>
                      {imageType === "methylene" ? (
                        <>
                          <td className="px-4 py-2 text-center">
                            {row.alive} (
                            {((row.alive / row.total) * 100).toFixed(2)})
                          </td>
                          <td className="px-4 py-2 text-center">
                            {row.dead}(
                            {((row.dead / row.total) * 100).toFixed(2)})
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2 text-center">
                            {row.normal}(
                            {((row.normal / row.total) * 100).toFixed(2)}%)
                          </td>
                          <td className="px-4 py-2 text-center">
                            {row.abnormal} (
                            {((row.abnormal / row.total) * 100).toFixed(2)}%)
                          </td>
                          <td className="px-4 py-2 text-center">
                            {row.normal_2x} (
                            {((row.normal_2x / row.total) * 100).toFixed(2)}%)
                          </td>
                          <td className="px-4 py-2 text-center">
                            {row.abnormal_2x} (
                            {((row.abnormal_2x / row.total) * 100).toFixed(2)}%)
                          </td>
                        </>
                      )}
                      <td className="px-4 py-2 text-center font-semibold">
                        {row.total} (100%)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              ref={chartRef}
              className="bg-white p-6 rounded-xl shadow-lg"
              style={{
                backgroundColor: "#ffffff",
              }}
            >
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fontFamily: "Nunito Sans" }}
                    />
                    <YAxis tick={{ fontSize: 12, fontFamily: "Nunito Sans" }} />
                    <Tooltip
                      contentStyle={{
                        fontFamily: "Nunito Sans",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: "20px",
                        fontFamily: "Nunito Sans",
                      }}
                    />
                    {Object.entries(COLORS).map(([key, color]) => (
                      <Bar
                        key={key}
                        dataKey={key}
                        stackId="a"
                        fill={color}
                        name={key
                          .replace(/_/g, " ")
                          .replace(/(^|\s)\S/g, (t) => t.toUpperCase())}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <button
              onClick={exportToPDF}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-semibold"
            >
              Xuất PDF
            </button>
          </div>
        )}
      </div>
    </DashbroardLayout>
  );
};

export default StatisticsByMeasurementManager;
