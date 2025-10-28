import React from "react";
import "./Contact.css";

function Contact() {
  return (
    <div className="contact-page container py-5 text-white">
      <h2 className="text-center mb-4 fw-bold">Liên hệ với chúng tôi</h2>
      <p className="text-center mb-5">
        Nếu bạn có thắc mắc hoặc góp ý, vui lòng điền thông tin vào biểu mẫu bên dưới.
      </p>

      <div className="row justify-content-center">
        {/* Cột form liên hệ */}
        <div className="col-md-6">
          <form className="contact-form p-4 rounded shadow">
            <div className="mb-3">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập họ tên của bạn"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Nhập email"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nội dung</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Nhập nội dung liên hệ"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-warning w-100 fw-semibold">
              Gửi liên hệ
            </button>
          </form>
        </div>

        {/* Cột thông tin cửa hàng */}
        <div className="col-md-4 mt-5 mt-md-0">
          <div className="contact-info p-4 rounded shadow">
            <h5 className="fw-bold mb-3">Thông tin cửa hàng</h5>
            <p><i className="bi bi-geo-alt"></i> 123 Nguyễn Trãi, Quận 5, TP.HCM</p>
            <p><i className="bi bi-telephone"></i> 0386 014 413</p>
            <p><i className="bi bi-envelope"></i> lienhe@vshop.vn</p>
            <p><i className="bi bi-clock"></i> Thứ 2 - CN: 8:00 - 21:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
