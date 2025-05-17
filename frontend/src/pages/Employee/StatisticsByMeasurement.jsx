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
import { getExperimentsOfEmployee } from "../../services/ExperimentService";
import { getMeasurementByExperimentId, getMeasurementById } from "../../services/MeasurementService";
import { useSearchParams } from "react-router-dom";

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

const StatisticsByMeasurement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [experimentName, setExperimentName] = useState("");
  const [measurementName, setMeasurementName] = useState("");
  const chartRef = useRef();
  const tableRef = useRef();
  const [experiments, setExperiments] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [selectedExperimentId, setSelectedExperimentId] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedMeasurementId, setSelectedMeasurementId] = useState(
    () => searchParams.get("measurementId") || ""
  );

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        const res = await getExperimentsOfEmployee(); // bạn cần tạo hàm API này
        console.log(res);
        setExperiments(res.metadata);
      } catch (error) {
        console.error("Lỗi khi tải danh sách thí nghiệm:", error);
      }
    };
    fetchExperiments();
  }, []);

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
        const { name, email, time, experimentName, measurementName } =
          res.metadata;
        setName(name);
        setEmail(email);
        setTime(new Date(time).toLocaleString());
        setExperimentName(experimentName);
        setMeasurementName(measurementName);

        const enrichedData = res.metadata.statictis.map((item) => {
          const total = Object.values(item)
            .slice(1)
            .reduce((a, b) => a + b, 0);
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
                    {PDF_TABLE_HEADERS.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-3 text-sm font-bold text-gray-700 text-center border-b"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-800 border-b font-semibold">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-center border-b font-semibold">
                        {item.normal}
                      </td>
                      <td className="px-4 py-3 text-sm text-center border-b font-semibold">
                        {item.abnormal}
                      </td>
                      <td className="px-4 py-3 text-sm text-center border-b font-semibold">
                        {item.normal_2x}
                      </td>
                      <td className="px-4 py-3 text-sm text-center border-b font-semibold">
                        {item.abnormal_2x}
                      </td>
                      <td className="px-4 py-3 text-sm text-center border-b text-green-600 font-semibold">
                        {item.alive}
                      </td>
                      <td className="px-4 py-3 text-sm text-center border-b text-red-600 font-semibold">
                        {item.dead}
                      </td>
                      <td className="px-4 py-3 text-sm text-center border-b font-bold">
                        {item.ratio_alive}%
                      </td>
                      <td className="px-4 py-3 text-sm text-center border-b font-bold">
                        {item.ratio_dead}%
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

export default StatisticsByMeasurement;
