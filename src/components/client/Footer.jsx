import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer text-white pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">
          {/* Cột 1: Logo + mô tả */}
          <div className="col-md-4 mb-4">
            <div className="d-flex align-items-center mb-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
                alt="VShop Logo"
                style={{ width: "50px", marginRight: "10px" }}
              />
              <h4 className="fw-bold mb-0">VShop</h4>
            </div>
            <p className="text-light small">
              VShop là cửa hàng chuyên cung cấp các sản phẩm thủ công, mô hình
              sáng tạo và quà tặng độc đáo. Chúng tôi mang đến cho bạn trải
              nghiệm mua sắm thú vị và đáng tin cậy.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-semibold mb-3">Liên kết nhanh</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link">Trang chủ</a></li>
              <li><a href="#" className="footer-link">Sản phẩm</a></li>
              <li><a href="#" className="footer-link">Khuyến mãi</a></li>
              <li><a href="#" className="footer-link">Giới thiệu</a></li>
              <li><a href="#" className="footer-link">Liên hệ</a></li>
            </ul>
          </div>

          {/* Cột 3: Liên hệ */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-semibold mb-3">Liên hệ với chúng tôi</h5>
            <ul className="list-unstyled">
              <li><i className="bi bi-geo-alt me-2"></i> 123 Đường Nguyễn Văn Linh, TP.HCM</li>
              <li><i className="bi bi-envelope me-2"></i> support@vshop.vn</li>
              <li><i className="bi bi-telephone me-2"></i> 0386 014 413</li>
            </ul>
          </div>
        </div>

        {/* Dòng bản quyền */}
        <div className="text-center border-top border-light mt-4 pt-3 small">
          © 2025 <span className="fw-bold">VShop</span>. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
