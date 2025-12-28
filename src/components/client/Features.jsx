import React from "react";

const Features = () => {
  return (
    <div className="bg-dark mt-5">
      <div className="container">
        <div className="row text-white text-center py-5">
          <div className="col-md-3 mb-4">
            <div className="d-flex justify-content-center align-items-start">
              <i
                className="bi bi-puzzle"
                style={{ fontSize: "4rem", marginRight: "10px" }}
              ></i>
              <div className="text-start">
                <h5>Tự Lắp Ráp</h5>
                <p className="mb-0">
                  Các mảnh đã được cắt sẵn và sẵn sàng để lắp ráp
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="d-flex justify-content-center align-items-start">
              <i
                className="bi bi-pencil-square"
                style={{ fontSize: "4rem", marginRight: "10px" }}
              ></i>
              <div className="text-start">
                <h5>Thiết Kế Tuyệt Vời</h5>
                <p className="mb-0">
                  Tất cả các sản phẩm được thiết kế tinh tế với chất lượng cao
                  cấp
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="d-flex justify-content-center align-items-start">
              <i
                className="bi bi-mortarboard"
                style={{ fontSize: "4rem", marginRight: "10px" }}
              ></i>
              <div className="text-start">
                <h5>Giáo Dục</h5>
                <p className="mb-0">
                  Hoàn hảo cho các dự án giáo dục thông qua học STEM thực hành
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="d-flex justify-content-center align-items-start">
              <i
                className="bi bi-leaf"
                style={{ fontSize: "4rem", marginRight: "10px" }}
              ></i>
              <div className="text-start">
                <h5>Eco-Friendly</h5>
                <p className="mb-0">
                  Vật liệu được lấy từ nguồn eco-friendly để bảo vệ hành tinh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
