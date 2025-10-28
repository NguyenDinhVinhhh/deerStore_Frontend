import React, { useState, useEffect } from "react";
import "./Banner.css";

// Import danh sách ảnh
import banner1 from "../../assets/imgs/image.png";
import banner2 from "../../assets/imgs/image copy.png";
import banner3 from "../../assets/imgs/image copy 2.png";

function Banner() {
  const images = [banner1, banner2, banner3];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động chuyển ảnh sau mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="container banner-container">
      <img src={images[currentIndex]} alt="Banner" className="banner-img" />
    </div>
  );
}

export default Banner;
