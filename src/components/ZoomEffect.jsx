import React, { useRef, useState } from 'react';

const ZoomEffect = ({ imageUrl, zoomLevel, about = false }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
  const [zoomBoxPosition, setZoomBoxPosition] = useState({ top: 0, left: 0 });
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();

    // Lấy tọa độ tương đối của chuột trên ảnh
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    // Tính toán tỉ lệ phần trăm vị trí của chuột
    const xPercent = (mouseX / width) * 100;
    const yPercent = (mouseY / height) * 100;

    // Cập nhật vị trí background của phần phóng to
    setBackgroundPosition(`${xPercent}% ${yPercent}%`);

    // Tính toán lại vị trí khung zoom sao cho con trỏ luôn nằm ở giữa
    const zoomBoxSize = 200; // Kích thước khung zoom (200x200px)
    const zoomBoxLeft = mouseX - zoomBoxSize / 2;
    const zoomBoxTop = mouseY - zoomBoxSize / 2;

    setZoomBoxPosition({ top: zoomBoxTop, left: zoomBoxLeft });
  };

  return (
    <div
      ref={imageRef}
      style={{
        position: 'relative',
        width: '100%',
        cursor: isZoomed ? 'zoom-out' : 'zoom-in',
        objectFit: 'contain',
        alignItems: 'center',
      }}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Ảnh gốc */}
      <img
        src={imageUrl}
        alt="Zoomed Product"
        style={{
          maxWidth: "100%",
          height: about ? "auto" : 270,
          objectFit: "contain",

        }}
      />

      {isZoomed && (
        <>
          {/* Khung zoom xung quanh con trỏ */}
          <div
            style={{
              position: 'absolute',
              top: `${zoomBoxPosition.top}px`,
              left: `${zoomBoxPosition.left}px`,
              width: 150,
              height: 150,
              border: '2px solid black',
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: `${zoomLevel * 250}%`,
              backgroundPosition: backgroundPosition,
              pointerEvents: 'none',
              zIndex: 10
            }}
          />
        </>
      )}
    </div>
  );
};

export default ZoomEffect;
