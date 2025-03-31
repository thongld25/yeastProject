import React, { useRef } from "react";

const OpenCvTest = () => {
    const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const rectangles = [
    { x: 342, y: 1125, width: 25, height: 27 },
    { x: 374, y: 1100, width: 22, height: 24 },
    { x: 351, y: 1067, width: 22, height: 24 },
    { x: 649, y: 1024, width: 25, height: 27 },
    { x: 407, y: 1024, width: 26, height: 28 },
    { x: 243, y: 995, width: 27, height: 26 },
    { x: 456, y: 942, width: 31, height: 32 },
    { x: 1082, y: 940, width: 26, height: 29 },
    { x: 825, y: 879, width: 22, height: 24 },
    { x: 745, y: 866, width: 27, height: 34 },
    { x: 1359, y: 830, width: 26, height: 30 },
    { x: 775, y: 749, width: 26, height: 30 },
    { x: 1007, y: 661, width: 27, height: 28 },
    { x: 950, y: 606, width: 25, height: 26 },
    { x: 1064, y: 586, width: 27, height: 30 },
    { x: 957, y: 572, width: 25, height: 27 },
    { x: 1043, y: 566, width: 30, height: 31 },
    { x: 1019, y: 562, width: 20, height: 20 },
    { x: 619, y: 562, width: 24, height: 26 },
    { x: 780, y: 561, width: 25, height: 26 },
    { x: 588, y: 561, width: 24, height: 27 },
    { x: 1021, y: 537, width: 25, height: 23 },
    { x: 1032, y: 512, width: 25, height: 25 },
    { x: 1095, y: 486, width: 30, height: 32 },
    { x: 898, y: 479, width: 26, height: 27 },
    { x: 1017, y: 476, width: 31, height: 29 },
    { x: 569, y: 471, width: 29, height: 44 },
    { x: 943, y: 459, width: 24, height: 27 },
    { x: 915, y: 456, width: 24, height: 26 },
    { x: 541, y: 433, width: 25, height: 26 },
    { x: 349, y: 368, width: 27, height: 29 },
    { x: 961, y: 257, width: 23, height: 26 }
  ];

  const processImage = () => {
    if (!window.cv) {
      console.error("OpenCV.js chưa được tải");
      return;
    }

    let src = cv.imread(imageRef.current);
    let dst = new cv.Mat();
    
    // Cắt ảnh thành 1536x1536 từ trung tâm
    let x = Math.floor((src.cols - 1536) / 2);
    let y = Math.floor((src.rows - 1536) / 2);
    let width = 1536;
    let height = 1536;
    let rect = new cv.Rect(x, y, width, height);
    let cropped = src.roi(rect);

    for (let rect of rectangles) {
        let point1 = new cv.Point(rect.x, rect.y);
        let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
      
      if (point1.x >= 0 && point1.y >= 0 && point2.x <= width && point2.y <= height) {
        cv.rectangle(cropped, point1, point2, [255, 0, 0, 255], 2);
      }
    }

    cv.imshow(canvasRef.current, cropped);
    src.delete();
    cropped.delete();
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (imageRef.current) {
                imageRef.current.src = event.target.result;
              }
            };
            reader.readAsDataURL(file);
          }
        }}
      />
      <img ref={imageRef} style={{ display: "none" }} alt="source" />
      <canvas ref={canvasRef}></canvas>
      <button
        onClick={() => {
          if (!window.cv) {
            console.error("OpenCV.js chưa được tải");
            return;
          }

          let src = cv.imread(imageRef.current);
          let dst = new cv.Mat();

          // Cắt ảnh thành 1536x1536 từ trung tâm
          let x = Math.floor((src.cols - 1536) / 2);
          let y = Math.floor((src.rows - 1536) / 2);
          let width = 1536;
          let height = 1536;
          let rect = new cv.Rect(x, y, width, height);
          let cropped = src.roi(rect);

          rectangles.forEach((rect, index) => {
            let point1 = new cv.Point(rect.x, rect.y);
            let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);

            if (
              point1.x >= 0 &&
              point1.y >= 0 &&
              point2.x <= width &&
              point2.y <= height
            ) {
              cv.rectangle(cropped, point1, point2, [255, 0, 0, 255], 1); // Nét mỏng hơn
              let textPoint = new cv.Point(rect.x, rect.y - 5); // Vị trí số thứ tự
              cv.putText(
                cropped,
                (index + 1).toString(),
                textPoint,
                cv.FONT_HERSHEY_SIMPLEX,
                0.5, // Kích thước chữ nhỏ
                // màu chữ đen [0, 0, 0, 255]
                [0, 0, 0, 255],
                1
              );
            }
          });

          cv.imshow(canvasRef.current, cropped);
          src.delete();
          cropped.delete();
        }}
      >
        Vẽ hình chữ nhật
      </button>
    </div>
  );
};

export default OpenCvTest;
