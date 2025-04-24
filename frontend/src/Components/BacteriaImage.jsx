import React, { useRef, useEffect, useState } from "react";

const BacteriaImage = ({ base64Image, bacteriaData, onCellClick }) => {
  const imageRef = useRef(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });

  const imageSrc = `data:image/png;base64,${base64Image}`;

  useEffect(() => {
    const updateScale = () => {
      if (imageRef.current) {
        const img = imageRef.current;
        const scaleX = img.clientWidth / img.naturalWidth;
        const scaleY = img.clientHeight / img.naturalHeight;
        setScale({ x: scaleX, y: scaleY });
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [base64Image]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        ref={imageRef}
        src={imageSrc}
        alt="Bacteria"
        draggable={false}
        className="w-full h-auto"
      />
      {bacteriaData.map((cell, index) => {
        const color =
          cell.type === "normal"
            ? "green"
            : cell.type === "abnormal_2x"
            ? "blue"
            : "red";

        return (
          <div
            key={index}
            onClick={() => onCellClick?.(cell)}
            style={{
              position: "absolute",
              left: cell.x * scale.x,
              top: cell.y * scale.y,
              width: cell.width * scale.x,
              height: cell.height * scale.y,
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
