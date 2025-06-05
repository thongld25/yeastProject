import React, { useRef, useEffect, useState, useContext } from "react";
import inside from "point-in-polygon";
import { TransformComponent } from "react-zoom-pan-pinch";

const BacteriaImage = ({
  imagePath,
  bacteriaData,
  onCellClick,
  lensType,
  points,
  showSquares
}) => {
  const imageRef = useRef(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = () => {
    if (!imageRef.current || !imageLoaded || !bacteriaData) return;

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

      // Vẽ cell
      bacteriaData.forEach((cell) => {
        const color =
          cell.type === "normal"
            ? "green"
            : cell.type === "abnormal_2x"
            ? "blue"
            : cell.type === "normal_2x"
            ? "blue"
            : cell.type === "abnormal"
            ? "red"
            : cell.type === "alive"
            ? "green"
            : "red";

        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
      });

      // Tải ảnh
      const link = document.createElement("a");
      link.download = "anh_phan_tich.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };

  const countCellsInSquares = (squares) => {
    return squares.map((square) => {
      const polygon = square.map((p) => [p.x, p.y]);

      const count = bacteriaData.filter((cell) => {
        const cx = cell.x + cell.width / 2;
        const cy = cell.y + cell.height / 2;
        return inside([cx, cy], polygon);
      }).length;

      return count;
    });
  };

  useEffect(() => {
    const img = imageRef.current;

    const updateScale = () => {
      if (img && img.naturalWidth > 0) {
        const scaleX = img.clientWidth / img.naturalWidth;
        const scaleY = img.clientHeight / img.naturalHeight;
        setScale({
          x: isFinite(scaleX) ? scaleX : 1,
          y: isFinite(scaleY) ? scaleY : 1,
        });
      }
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
      // Delay updateScale to wait for layout to settle
      setTimeout(updateScale, 100);
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

  const generateSquares = (points) => {
    if (!Array.isArray(points) || points.length !== 25) return [];
    const squares = [];
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        const idx = i + j * 5;
        squares.push([
          points[idx],
          points[idx + 1],
          points[idx + 6],
          points[idx + 5],
        ]);
      }
    }
    return squares;
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
          e.target.src = "/uploads/mau.jpeg";
        }}
      />

      <div className="mb-2 text-right">
        <button
          onClick={handleDownload}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
        >
          Tải ảnh phân tích
        </button>
      </div>

      {/* Vẽ cell */}
      {imageLoaded &&
        bacteriaData.map((cell, index) => {
          const color =
            cell.type === "normal"
              ? "green"
              : cell.type === "abnormal_2x"
              ? "blue"
              : cell.type === "normal_2x"
              ? "blue"
              : cell.type === "abnormal"
              ? "red"
              : cell.type === "alive"
              ? "green"
              : "red";

          const safeX = typeof cell.x === "number" ? cell.x : 0;
          const safeY = typeof cell.y === "number" ? cell.y : 0;
          const safeWidth = typeof cell.width === "number" ? cell.width : 0;
          const safeHeight = typeof cell.height === "number" ? cell.height : 0;

          return (
            <div
              key={index}
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
              title={`Cell ${cell.cell_id}`}
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

      {/* Vẽ ô vuông nếu là buồng đếm và showSquares được bật */}
      {lensType === "buồng đếm" &&
        imageLoaded &&
        points?.length === 25 &&
        showSquares &&
        (() => {
          const squares = generateSquares(points);
          const cellCounts = countCellsInSquares(squares);

          return squares.map((square, i) => {
            const [p1, p2, p3, p4] = square;
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
              <svg
                key={`square-${i}`}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                <polygon
                  points={pointsAttr}
                  fill="none"
                  stroke="blue"
                  strokeWidth="1.5"
                />
                <text
                  x={centerX}
                  y={centerY}
                  fill="blue"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {`${i + 1} (${cellCounts[i]})`}
                </text>
              </svg>
            );
          });
        })()}
    </div>
  );
};

export default BacteriaImage;
