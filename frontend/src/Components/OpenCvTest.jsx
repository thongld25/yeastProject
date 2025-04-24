// import React, { useRef } from "react";

// const OpenCvTest = () => {
//   const imageRef = useRef(null);
//   const canvasRef = useRef(null);

//   const rectangles = [
//     {
//       cell_id: "20_1",
//       x: 597,
//       y: 1161,
//       width: 28,
//       height: 33,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_2",
//       x: 870,
//       y: 1120,
//       width: 27,
//       height: 29,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_3",
//       x: 596,
//       y: 1001,
//       width: 30,
//       height: 33,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_4",
//       x: 103,
//       y: 930,
//       width: 34,
//       height: 35,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_5",
//       x: 195,
//       y: 868,
//       width: 31,
//       height: 33,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_6",
//       x: 491,
//       y: 865,
//       width: 28,
//       height: 30,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_7",
//       x: 77,
//       y: 831,
//       width: 41,
//       height: 55,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_8",
//       x: 233,
//       y: 827,
//       width: 31,
//       height: 33,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_9",
//       x: 1155,
//       y: 824,
//       width: 26,
//       height: 25,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_10",
//       x: 364,
//       y: 799,
//       width: 30,
//       height: 32,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_11",
//       x: 66,
//       y: 797,
//       width: 31,
//       height: 32,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_12",
//       x: 800,
//       y: 752,
//       width: 30,
//       height: 51,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_13",
//       x: 80,
//       y: 745,
//       width: 32,
//       height: 33,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_14",
//       x: 443,
//       y: 671,
//       width: 29,
//       height: 31,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_15",
//       x: 660,
//       y: 663,
//       width: 29,
//       height: 48,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_16",
//       x: 511,
//       y: 658,
//       width: 27,
//       height: 29,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_17",
//       x: 1195,
//       y: 656,
//       width: 28,
//       height: 50,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_18",
//       x: 12,
//       y: 651,
//       width: 22,
//       height: 31,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_19",
//       x: 977,
//       y: 650,
//       width: 34,
//       height: 35,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_20",
//       x: 931,
//       y: 636,
//       width: 30,
//       height: 32,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_21",
//       x: 191,
//       y: 613,
//       width: 27,
//       height: 26,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_22",
//       x: 653,
//       y: 553,
//       width: 29,
//       height: 32,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_23",
//       x: 610,
//       y: 553,
//       width: 33,
//       height: 35,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_24",
//       x: 1090,
//       y: 528,
//       width: 31,
//       height: 33,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_25",
//       x: 635,
//       y: 525,
//       width: 27,
//       height: 30,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_26",
//       x: 393,
//       y: 521,
//       width: 28,
//       height: 29,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_27",
//       x: 1004,
//       y: 505,
//       width: 29,
//       height: 30,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_28",
//       x: 542,
//       y: 503,
//       width: 29,
//       height: 32,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_29",
//       x: 616,
//       y: 498,
//       width: 27,
//       height: 29,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_30",
//       x: 681,
//       y: 489,
//       width: 30,
//       height: 34,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_31",
//       x: 847,
//       y: 483,
//       width: 28,
//       height: 31,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_32",
//       x: 360,
//       y: 472,
//       width: 33,
//       height: 34,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_33",
//       x: 1010,
//       y: 461,
//       width: 30,
//       height: 33,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_34",
//       x: 419,
//       y: 457,
//       width: 27,
//       height: 29,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_35",
//       x: 868,
//       y: 452,
//       width: 27,
//       height: 28,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_36",
//       x: 515,
//       y: 447,
//       width: 69,
//       height: 74,
//       type: "abnormal_2x",
//       color: "blue",
//     },
//     {
//       cell_id: "20_37",
//       x: 708,
//       y: 439,
//       width: 29,
//       height: 32,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_38",
//       x: 400,
//       y: 436,
//       width: 32,
//       height: 34,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_39",
//       x: 237,
//       y: 433,
//       width: 28,
//       height: 32,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_40",
//       x: 570,
//       y: 421,
//       width: 26,
//       height: 27,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_41",
//       x: 600,
//       y: 417,
//       width: 27,
//       height: 30,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_42",
//       x: 72,
//       y: 412,
//       width: 28,
//       height: 29,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_43",
//       x: 1051,
//       y: 399,
//       width: 28,
//       height: 28,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_44",
//       x: 767,
//       y: 395,
//       width: 27,
//       height: 32,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_45",
//       x: 555,
//       y: 388,
//       width: 27,
//       height: 29,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_46",
//       x: 696,
//       y: 369,
//       width: 28,
//       height: 31,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_47",
//       x: 510,
//       y: 366,
//       width: 30,
//       height: 35,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_48",
//       x: 429,
//       y: 365,
//       width: 32,
//       height: 34,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_49",
//       x: 884,
//       y: 359,
//       width: 27,
//       height: 30,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_50",
//       x: 207,
//       y: 359,
//       width: 29,
//       height: 31,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_51",
//       x: 947,
//       y: 356,
//       width: 29,
//       height: 32,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_52",
//       x: 635,
//       y: 340,
//       width: 28,
//       height: 33,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_53",
//       x: 566,
//       y: 327,
//       width: 27,
//       height: 28,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_54",
//       x: 177,
//       y: 325,
//       width: 30,
//       height: 30,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_55",
//       x: 390,
//       y: 323,
//       width: 33,
//       height: 34,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_56",
//       x: 909,
//       y: 314,
//       width: 30,
//       height: 33,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_57",
//       x: 203,
//       y: 311,
//       width: 30,
//       height: 27,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_58",
//       x: 571,
//       y: 288,
//       width: 27,
//       height: 29,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_59",
//       x: 459,
//       y: 288,
//       width: 32,
//       height: 34,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_60",
//       x: 495,
//       y: 282,
//       width: 33,
//       height: 36,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_61",
//       x: 834,
//       y: 280,
//       width: 35,
//       height: 38,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_62",
//       x: 341,
//       y: 277,
//       width: 27,
//       height: 28,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_63",
//       x: 501,
//       y: 253,
//       width: 34,
//       height: 33,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_64",
//       x: 660,
//       y: 238,
//       width: 26,
//       height: 29,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_65",
//       x: 364,
//       y: 232,
//       width: 33,
//       height: 35,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_66",
//       x: 166,
//       y: 230,
//       width: 31,
//       height: 32,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_67",
//       x: 717,
//       y: 216,
//       width: 27,
//       height: 30,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_68",
//       x: 772,
//       y: 213,
//       width: 30,
//       height: 36,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_69",
//       x: 453,
//       y: 204,
//       width: 27,
//       height: 30,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_70",
//       x: 818,
//       y: 195,
//       width: 27,
//       height: 30,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_71",
//       x: 898,
//       y: 181,
//       width: 29,
//       height: 30,
//       type: "abnormal",
//       color: "purple",
//     },
//     {
//       cell_id: "20_72",
//       x: 510,
//       y: 166,
//       width: 32,
//       height: 34,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_73",
//       x: 734,
//       y: 159,
//       width: 30,
//       height: 34,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_74",
//       x: 692,
//       y: 156,
//       width: 30,
//       height: 33,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_75",
//       x: 722,
//       y: 119,
//       width: 30,
//       height: 32,
//       type: "normal",
//       color: "red",
//     },
//     {
//       cell_id: "20_76",
//       x: 710,
//       y: 75,
//       width: 27,
//       height: 27,
//       type: "abnormal",
//       color: "purple",
//     },
//   ];
//   const drawRectangles = () => {
//     if (!window.cv) {
//       console.error("OpenCV.js chưa được tải");
//       return;
//     }

//     let src = cv.imread(imageRef.current);
//     // Bảng màu tương ứng với các loại
//     const colorMap = {
//       red: [0, 0, 255, 255], // Màu đỏ trong BGR
//       purple: [128, 0, 128, 255], // Màu tím trong BGR
//       blue: [255, 0, 0, 255], // Màu xanh dương trong BGR
//     };

//     rectangles.forEach((rect, index) => {
//       const point1 = new cv.Point(rect.x, rect.y);
//       const point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);

//       // Lấy màu từ bảng màu, mặc định là màu đỏ nếu không tìm thấy
//       const color = colorMap[rect.color] || [0, 0, 255, 255];

//       // Vẽ hình chữ nhật với màu tương ứng
//       cv.rectangle(src, point1, point2, color, 1);

//       // Thêm số thứ tự
//       const textPoint = new cv.Point(rect.x, rect.y - 5);
//       cv.putText(
//         src,
//         (index + 1).toString(),
//         textPoint,
//         cv.FONT_HERSHEY_SIMPLEX,
//         0.5,
//         [0, 0, 0, 255], // Màu chữ đen
//         1
//       );
//     });

//     cv.imshow(canvasRef.current, src);
//     src.delete();
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         onChange={(e) => {
//           const file = e.target.files[0];
//           if (file) {
//             const reader = new FileReader();
//             reader.onload = (event) => {
//               if (imageRef.current) {
//                 imageRef.current.src = event.target.result;
//               }
//             };
//             reader.readAsDataURL(file);
//           }
//         }}
//       />
//       <img ref={imageRef} style={{ display: "none" }} alt="source" />
//       <canvas ref={canvasRef}></canvas>
//       <button onClick={drawRectangles}>Vẽ hình chữ nhật</button>
//     </div>
//   );
// };

// export default OpenCvTest;
import React, { useEffect, useRef, useState } from "react";

const ContourViewer = () => {
  const canvasRef = useRef(null);
  const contourData = {
    "cell_id": "20_1",
    "area": 1.3266242027239212,
    "perimeter": 4.333675964413618,
    "circularity": 0.8876564427295972,
    "convexity": 0.9656546226097847,
    "CE_diameter": 1.2996577995421925,
    "major_axis_length": 28.23931884765625,
    "minor_axis_length": 23.55010223388672,
    "aspect_ratio": 0.8339472478402673,
    "max_distance": 1.4570890413053272,
    "contour": [
      {"x": 593, "y": 1142},
      {"x": 594, "y": 1141},
      {"x": 595, "y": 1141},
      {"x": 596, "y": 1141},
      {"x": 597, "y": 1141},
      {"x": 598, "y": 1141},
      {"x": 599, "y": 1141},
      {"x": 600, "y": 1141},
      {"x": 601, "y": 1142},
      {"x": 602, "y": 1142},
      {"x": 603, "y": 1143},
      {"x": 604, "y": 1144},
      {"x": 605, "y": 1145},
      {"x": 606, "y": 1146},
      {"x": 606, "y": 1147},
      {"x": 607, "y": 1148},
      {"x": 607, "y": 1149},
      {"x": 607, "y": 1150},
      {"x": 607, "y": 1151},
      {"x": 607, "y": 1152},
      {"x": 607, "y": 1153},
      {"x": 608, "y": 1154},
      {"x": 607, "y": 1155},
      {"x": 607, "y": 1156},
      {"x": 607, "y": 1157},
      {"x": 607, "y": 1158},
      {"x": 607, "y": 1159},
      {"x": 607, "y": 1160},
      {"x": 606, "y": 1161},
      {"x": 606, "y": 1162},
      {"x": 605, "y": 1163},
      {"x": 604, "y": 1164},
      {"x": 603, "y": 1165},
      {"x": 602, "y": 1166},
      {"x": 601, "y": 1167},
      {"x": 600, "y": 1167},
      {"x": 599, "y": 1168},
      {"x": 598, "y": 1168},
      {"x": 597, "y": 1169},
      {"x": 596, "y": 1169},
      {"x": 595, "y": 1169},
      {"x": 594, "y": 1169},
      {"x": 593, "y": 1169},
      {"x": 592, "y": 1168},
      {"x": 591, "y": 1168},
      {"x": 590, "y": 1167},
      {"x": 589, "y": 1167},
      {"x": 588, "y": 1166},
      {"x": 587, "y": 1165},
      {"x": 586, "y": 1164},
      {"x": 586, "y": 1163},
      {"x": 585, "y": 1162},
      {"x": 585, "y": 1161},
      {"x": 585, "y": 1160},
      {"x": 584, "y": 1159},
      {"x": 584, "y": 1158},
      {"x": 584, "y": 1157},
      {"x": 584, "y": 1156},
      {"x": 584, "y": 1155},
      {"x": 584, "y": 1154},
      {"x": 584, "y": 1153},
      {"x": 584, "y": 1152},
      {"x": 584, "y": 1151},
      {"x": 585, "y": 1150},
      {"x": 585, "y": 1149},
      {"x": 586, "y": 1148},
      {"x": 586, "y": 1147},
      {"x": 587, "y": 1146},
      {"x": 588, "y": 1145},
      {"x": 589, "y": 1144},
      {"x": 590, "y": 1143},
      {"x": 591, "y": 1142},
      {"x": 592, "y": 1142}
    ]
  }
;

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas || !contourData?.contour) return;

  const ctx = canvas.getContext("2d");

  // Resize canvas
  canvas.width = 300;
  canvas.height = 300;

  // Set white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Find bounding box for normalization
  const xs = contourData.contour.map((p) => p.x);
  const ys = contourData.contour.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  const padding = 20;
  const scaleX = (canvas.width - 2 * padding) / (maxX - minX);
  const scaleY = (canvas.height - 2 * padding) / (maxY - minY);
  const scale = Math.min(scaleX, scaleY);

  // Draw contour
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 4;
  ctx.beginPath();

  contourData.contour.forEach((point, index) => {
    const x = padding + (point.x - minX) * scale;
    const y = padding + (point.y - minY) * scale;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.closePath();
  ctx.stroke();
}, [contourData]);

return <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }} />;
};

export default ContourViewer;
