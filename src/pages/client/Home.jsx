import React from "react";
import Banner from "../../components/client/Banner";
import hinh1 from "../../assets/imgs/image copy 5.png";
import hinh2 from "../../assets/imgs/image copy 6.png";
import hinh3 from "../../assets/imgs/image copy 7.png";
import hinh4 from "../../assets/imgs/image copy 8.png";
import hinh5 from "../../assets/imgs/image copy 9.png";
import hinh6 from "../../assets/imgs/image copy 10.png";
import "./Home.css"
function Home() {
  const categories = [
    { img: hinh1, title: "DIY Book Nook" },
    { img: hinh2, title: "DIY Miniature House" },
    { img: hinh3, title: "3D Wooden Puzzle" },
    { img: hinh4, title: "Music Box" },
    { img: hinh5, title: "Vehicle" },
    { img: hinh6, title: "New Arrivals" },
  ];

  return (
    <div>
      <Banner />
      <div className="container py-5">
        <h5 className="mb-4 fw-bold text-dark">SẢN PHẨM MỚI</h5>
        <div className="row">
          {/* demo card sản phẩm */}
          {[1, 2, 3, 4].map((item) => (
            <div className="col-md-3 mb-4" key={item}>
              <div className="card shadow-sm border-0">
                <img
                  src={`https://picsum.photos/300/200?random=${item}`}
                  className="card-img-top"
                  alt="sản phẩm"
                />
                <div className="card-body text-center">
                  <h6 className="card-title fw-semibold">Sản phẩm {item}</h6>
                  <button className="btn btn-warning text-white mt-2">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-dark">
        <div className="container">
          <div className="row text-white text-center py-5">
            <div className="col-md-3 mb-4">
              <div className="d-flex justify-content-center align-items-start">
                <i className="bi bi-puzzle" style={{ fontSize: "4rem", marginRight: "10px" }}></i>
                <div className="text-start">
                  <h5>Tự Lắp Ráp</h5>
                  <p className="mb-0">Các mảnh đã được cắt sẵn và sẵn sàng để lắp ráp</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-4">
              <div className="d-flex justify-content-center align-items-start">
                <i className="bi bi-pencil-square" style={{ fontSize: "4rem", marginRight: "10px" }}></i>
                <div className="text-start">
                  <h5>Thiết Kế Tuyệt Vời</h5>
                  <p className="mb-0">Tất cả các sản phẩm được thiết kế tinh tế với chất lượng cao cấp</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="d-flex justify-content-center align-items-start">
                <i className="bi bi-mortarboard" style={{ fontSize: "4rem", marginRight: "10px" }}></i>
                <div className="text-start">
                  <h5>Giáo Dục</h5>
                  <p className="mb-0">
                    Hoàn hảo cho các dự án giáo dục thông qua việc học STEM thực hành bằng tay
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
            <div className="d-flex justify-content-center align-items-start">
              <i className="bi bi-leaf" style={{ fontSize: "4rem", marginRight: "10px" }}></i>
              <div className="text-start">
                <h5>Eco-Friendly</h5>
                <p className="mb-0">
                  Tất cả các vật liệu đều được lấy từ nguồn cung eco-friendly để bảo vệ hành tinh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div className="container text-center py-5">
      <h3 className="fw-bold mb-3" style={{ color: "#555" }}>
        Các danh mục hàng đầu cho bạn
      </h3>
      <p className="text-muted mb-5">
        Khám phá các danh mục được đề xuất của chúng tôi để nhanh chóng tìm thấy bộ kit xây dựng ưa thích của bạn!
      </p>

      <div className="row justify-content-center">
        {categories.map((item, index) => (
          <div className="col-6 col-md-4 col-lg-2 mb-4" key={index}>
            <div className="box d-flex flex-column align-items-center">
              <img
                src={item.img}
                alt={item.title}
                className="img-fluid mb-3"
                style={{
                  height: "150px",
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <h6 className="fw-bold text-secondary">{item.title}</h6>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default Home;
