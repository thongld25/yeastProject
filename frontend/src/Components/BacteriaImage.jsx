import React, { useRef, useEffect, useState, useMemo } from "react";
import inside from "point-in-polygon";

const BacteriaImage = ({
  imagePath,
  bacteriaData,
  onCellClick,
  lensType,
  points,
  showSquares,
  modalOpen,
}) => {
  const imageRef = useRef(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const generateSquares = (points) => {
    if (!Array.isArray(points) || points.length !== 25) return [];
    const squares = [];
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        const idx = i + j * 5;
        if (idx + 6 < points.length) {
          squares.push([
            points[idx],
            points[idx + 1],
            points[idx + 6],
            points[idx + 5],
          ]);
        }
      }
    }
    return squares;
  };

  // Memoize the squares calculation
  const squares = useMemo(() => {
    if (lensType !== "buồng đếm" || !points || points.length !== 25) {
      return [];
    }
    return generateSquares(points);
  }, [points, lensType]);

  // Memoize the list of cells to render based on showSquares
  const cellsToRender = useMemo(() => {
    if (!showSquares || squares.length === 0) {
      return bacteriaData; // If not showing squares, return all data
    }
    if (!bacteriaData) return [];

    // Filter cells that are inside any of the squares
    return bacteriaData.filter((cell) => {
      const cx = cell.x + cell.width / 2;
      const cy = cell.y + cell.height / 2;
      return squares.some((square) => {
        if (
          !Array.isArray(square) ||
          square.some(
            (p) => !p || typeof p.x !== "number" || typeof p.y !== "number"
          )
        ) {
          return false;
        }
        const polygon = square.map((p) => [p.x, p.y]);
        return inside([cx, cy], polygon);
      });
    });
  }, [bacteriaData, squares, showSquares]);

  const countCellsInSquares = (squares) => {
    if (!bacteriaData) return squares.map(() => 0);
    return squares.map((square) => {
      if (
        !Array.isArray(square) ||
        square.some(
          (p) => !p || typeof p.x !== "number" || typeof p.y !== "number"
        )
      ) {
        return 0;
      }
      const polygon = square.map((p) => [p.x, p.y]);

      const count = bacteriaData.filter((cell) => {
        const cx = cell.x + cell.width / 2;
        const cy = cell.y + cell.height / 2;
        return inside([cx, cy], polygon);
      }).length;

      return count;
    });
  };

  const handleDownload = () => {
    if (!imageRef.current || !imageLoaded || !cellsToRender) return;

    const canvas = document.createElement("canvas");
    const img = imageRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    const baseImg = new Image();
    baseImg.crossOrigin = "anonymous";
    baseImg.src = imagePath;

    baseImg.onload = () => {
      ctx.drawImage(baseImg, 0, 0);

      // --- CHANGE HERE: Use the filtered 'cellsToRender' list for drawing ---
      cellsToRender.forEach((cell, index) => {
        let color;
        if (cell.editType) {
          color =
            cell.editType === "Normal"
              ? "green"
              : cell.editType === "Abnormal_2x" || cell.editType === "Normal_2x"
              ? "blue"
              : cell.editType === "Abnormal"
              ? "red"
              : cell.editType === "Alive"
              ? "green"
              : "red";
        } else {
          color =
            cell.type === "Normal"
              ? "green"
              : cell.type === "Abnormal_2x" || cell.type === "Normal_2x"
              ? "blue"
              : cell.type === "Abnormal"
              ? "red"
              : cell.type === "Alive"
              ? "green"
              : "red";
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
        ctx.fillStyle = "black";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(`${index + 1}`, cell.x + cell.width / 2, cell.y - 5);
      });

      // This logic remains the same, it draws the squares if needed
      if (lensType === "buồng đếm" && showSquares && points?.length === 25) {
        const cellCounts = countCellsInSquares(squares);
        ctx.strokeStyle = "blue";
        ctx.fillStyle = "blue";
        ctx.lineWidth = 2;
        ctx.font = "16px sans-serif";

        squares.forEach((square, i) => {
          const [p1, p2, p3, p4] = square;
          if (
            !p1 ||
            !p2 ||
            !p3 ||
            !p4 ||
            [p1, p2, p3, p4].some((p) => isNaN(p.x) || isNaN(p.y))
          ) {
            console.warn(`Bỏ qua square ${i} vì tọa độ không hợp lệ.`);
            return;
          }
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.lineTo(p4.x, p4.y);
          ctx.closePath();
          ctx.stroke();
          const centerX = (p1.x + p2.x + p3.x + p4.x) / 4;
          const centerY = (p1.y + p2.y + p3.y + p4.y) / 4;
          ctx.fillText(`${i + 1} (${cellCounts[i]})`, centerX, centerY);
        });
      }

      try {
        const link = document.createElement("a");
        link.download = "anh_phan_tich.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (e) {
        console.error("Lỗi khi tạo URL cho canvas:", e);
      }
    };

    baseImg.onerror = () => {
      console.error("Không thể tải ảnh gốc để vẽ lên canvas.");
    };
  };

  useEffect(() => {
    const img = imageRef.current;
    let isMounted = true;

    const updateScale = () => {
      if (img && img.naturalWidth > 0 && isMounted) {
        const scaleX = img.clientWidth / img.naturalWidth;
        const scaleY = img.clientHeight / img.naturalHeight;
        setScale({
          x: isFinite(scaleX) ? scaleX : 1,
          y: isFinite(scaleY) ? scaleY : 1,
        });
      }
    };

    const handleImageLoad = () => {
      if (isMounted) {
        setImageLoaded(true);
        setTimeout(updateScale, 100);
      }
    };

    if (img) {
      if (img.complete && img.naturalWidth > 0) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad);
      }
    }

    window.addEventListener("resize", updateScale);

    return () => {
      isMounted = false;
      if (img) {
        img.removeEventListener("load", handleImageLoad);
      }
      window.removeEventListener("resize", updateScale);
    };
  }, [imagePath]);

  const getSafePosition = (value, scaleValue) => {
    const scaled = value * scaleValue;
    return isFinite(scaled) ? scaled : 0;
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        ref={imageRef}
        src={imagePath}
        alt="Bacteria"
        draggable={false}
        className="w-full h-auto"
        crossOrigin="anonymous"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found";
        }}
      />
      {imageLoaded && !modalOpen && (
        <div className="mt-4 text-center">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          >
            Tải ảnh phân tích
          </button>
        </div>
      )}

      {/* --- CHANGE HERE: Use the filtered 'cellsToRender' list for displaying --- */}
      {imageLoaded &&
        cellsToRender?.map((cell, index) => {
          let color;
          if (cell.editType) {
            color =
              cell.editType === "Normal"
                ? "green"
                : cell.editType === "Abnormal_2x"
                ? "blue"
                : cell.editType === "Normal_2x"
                ? "blue"
                : cell.editType === "Abnormal"
                ? "red"
                : cell.editType === "Alive"
                ? "green"
                : "red";
          } else {
            color =
              cell.type === "Normal"
                ? "green"
                : cell.type === "Abnormal_2x"
                ? "blue"
                : cell.type === "Normal_2x"
                ? "blue"
                : cell.type === "Abnormal"
                ? "red"
                : cell.type === "Alive"
                ? "green"
                : "red";
          }
          const safeX = typeof cell.x === "number" ? cell.x : 0;
          const safeY = typeof cell.y === "number" ? cell.y : 0;
          const safeWidth = typeof cell.width === "number" ? cell.width : 0;
          const safeHeight = typeof cell.height === "number" ? cell.height : 0;
          return (
            <div
              key={cell.cell_id || index} // Use a more stable key if available
              onClick={() => onCellClick?.(cell)}
              style={{
                position: "absolute",
                left: `${getSafePosition(safeX, scale.x)}px`,
                top: `${getSafePosition(safeY, scale.y)}px`,
                width: `${getSafePosition(safeWidth, scale.x)}px`,
                height: `${getSafePosition(safeHeight, scale.y)}px`,
                border: `1px solid ${color}`,
                cursor: "pointer",
                boxSizing: "border-box",
              }}
              title={`Cell ${cell.cell_id}${
                cell.wrongType ? " - ⚠ Sai loại" : ""
              }${cell.wrongBox ? " - 🚩 Sai box" : ""}`}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "0",
                  transform: "translateY(-100%)",
                  color: "black",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  textShadow: "1px 1px 2px white, -1px -1px 2px white",
                  whiteSpace: "nowrap",
                }}
              >
                {index + 1}
              </div>
            </div>
          );
        })}

      {/* This logic for drawing squares remains the same */}
      {lensType === "buồng đếm" &&
        imageLoaded &&
        points?.length === 25 &&
        showSquares &&
        (() => {
          if (squares.length === 0) return null;
          const cellCounts = countCellsInSquares(squares);
          return (
            <svg
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
              }}
            >
              {squares.map((square, i) => {
                const [p1, p2, p3, p4] = square;
                if (!p1 || !p2 || !p3 || !p4) return null;
                const pointsAttr = [
                  `${getSafePosition(p1.x, scale.x)},${getSafePosition(
                    p1.y,
                    scale.y
                  )}`,
                  `${getSafePosition(p2.x, scale.x)},${getSafePosition(
                    p2.y,
                    scale.y
                  )}`,
                  `${getSafePosition(p3.x, scale.x)},${getSafePosition(
                    p3.y,
                    scale.y
                  )}`,
                  `${getSafePosition(p4.x, scale.x)},${getSafePosition(
                    p4.y,
                    scale.y
                  )}`,
                ].join(" ");
                const centerX = getSafePosition(
                  (p1.x + p2.x + p3.x + p4.x) / 4,
                  scale.x
                );
                const centerY = getSafePosition(
                  (p1.y + p2.y + p3.y + p4.y) / 4,
                  scale.y
                );
                return (
                  <g key={`square-group-${i}`}>
                    <polygon
                      points={pointsAttr}
                      fill="rgba(0, 0, 255, 0.1)"
                      stroke="blue"
                      strokeWidth="1.5"
                    />
                    <text
                      x={centerX}
                      y={centerY}
                      fill="blue"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        paintOrder: "stroke",
                        stroke: "white",
                        strokeWidth: "3px",
                        strokeLinecap: "butt",
                        strokeLinejoin: "miter",
                      }}
                    >
                      {`${i + 1} (${cellCounts[i] || 0})`}
                    </text>
                  </g>
                );
              })}
            </svg>
          );
        })()}
    </div>
  );
};

export default BacteriaImage;
