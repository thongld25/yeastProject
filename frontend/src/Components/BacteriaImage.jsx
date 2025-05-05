import React, { useRef, useEffect, useState } from "react";
import LOAD from "../assets/images/mau.jpeg";

const BacteriaImage = ({ imagePath, bacteriaData, onCellClick }) => {
  const imageRef = useRef(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      if (imageRef.current && imageRef.current.naturalWidth > 0) {
        const img = imageRef.current;
        const scaleX = img.clientWidth / img.naturalWidth;
        const scaleY = img.clientHeight / img.naturalHeight;
        setScale({ 
          x: isFinite(scaleX) ? scaleX : 1,
          y: isFinite(scaleY) ? scaleY : 1
        });
      }
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
      updateScale();
    };

    const img = imageRef.current;
    if (img) {
      img.addEventListener('load', handleImageLoad);
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    
    return () => {
      if (img) {
        img.removeEventListener('load', handleImageLoad);
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
          e.target.src = ''; // Hoặc URL ảnh placeholder nếu có
        }}
      />
      {imageLoaded && bacteriaData.map((cell, index) => {
        const color =
          cell.type === "normal"
            ? "green"
            : cell.type === "abnormal_2x"
            ? "blue"
            : "red";

        // Đảm bảo các giá trị tọa độ là số hữu hạn
        const safeX = typeof cell.x === 'number' ? cell.x : 0;
        const safeY = typeof cell.y === 'number' ? cell.y : 0;
        const safeWidth = typeof cell.width === 'number' ? cell.width : 0;
        const safeHeight = typeof cell.height === 'number' ? cell.height : 0;

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
              border: `2px solid ${color}`,
              cursor: "pointer",
              boxSizing: "border-box",
            }}
            title={`Click để xem cell ${cell.cell_id}`}
          >
            <div
              style={{
                position: "absolute",
                left: "0",
                color: color,
                fontSize: "0.75rem",
                borderRadius: "0.25rem",
              }}
            >
              {index + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BacteriaImage;