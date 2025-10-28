import React from "react";
import "./Overview.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { date: "22/10", sales: 5000000 },
  { date: "23/10", sales: 15000000 },
  { date: "24/10", sales: 8000000 },
  { date: "25/10", sales: 45000000 },
  { date: "26/10", sales: 20000000 },
  { date: "27/10", sales: 7000000 },
  { date: "28/10", sales: 4000000 },
];

export default function Overview() {
  return (
    <div className="overview p-4">

      {/* === Kết quả kinh doanh trong ngày === */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold text-secondary">KẾT QUẢ KINH DOANH TRONG NGÀY</h6>
            <select className="form-select form-select-sm w-auto">
              <option>Tất cả chi nhánh</option>
            </select>
          </div>

          <div className="row text-center">
            <div className="col-md-3">
              <div className="p-3">
                <i className="bi bi-person-fill text-primary fs-3"></i>
                <p className="mb-1 fw-semibold">Doanh thu</p>
                <h5 className="text-primary">3,476,000đ</h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <i className="bi bi-bag-check text-success fs-3"></i>
                <p className="mb-1 fw-semibold">Đơn hàng mới</p>
                <h5 className="text-success">2</h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <i className="bi bi-arrow-repeat text-warning fs-3"></i>
                <p className="mb-1 fw-semibold">Đơn trả hàng</p>
                <h5 className="text-warning">0</h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="p-3">
                <i className="bi bi-x-circle-fill text-danger fs-3"></i>
                <p className="mb-1 fw-semibold">Đơn hủy</p>
                <h5 className="text-danger">1</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Biểu đồ doanh thu === */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <h6 className="fw-bold text-secondary">DOANH THU BÁN HÀNG</h6>
            <div>
              <select className="form-select form-select-sm d-inline w-auto me-2">
                <option>Tất cả chi nhánh</option>
              </select>
              <select className="form-select form-select-sm d-inline w-auto">
                <option>7 ngày qua</option>
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* === Đơn hàng chờ xử lý === */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body">
          <h6 className="fw-bold text-secondary mb-3">ĐƠN HÀNG CHỜ XỬ LÝ</h6>
          <div className="row text-center">
            {["Chờ duyệt", "Chờ thanh toán", "Chờ đóng gói", "Chờ lấy hàng", "Đang giao hàng", "Hủy giao - chờ nhận"].map((item, i) => (
              <div className="col" key={i}>
                <div className="p-3">
                  <i className="bi bi-box-seam fs-4 text-primary"></i>
                  <p className="mb-1">{item}</p>
                  <h6>0</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === Top sản phẩm & Thông tin kho === */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <h6 className="fw-bold text-secondary">TOP SẢN PHẨM</h6>
                <select className="form-select form-select-sm w-auto">
                  <option>7 ngày qua</option>
                </select>
              </div>

              <ul className="list-group list-group-flush">
                {["Roof", "Dust Cover", "Sky Captain 3D Puzzle", "Ocean Fisher 3D Puzzle", "Dream Gift Factory"].map(
                  (item, index) => (
                    <li key={index} className="list-group-item d-flex align-items-center">
                      <span className="badge bg-primary me-3">{index + 1}</span>
                      <div>{item}</div>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100 d-flex align-items-center justify-content-center">
            <div className="text-center text-muted">
              <i className="bi bi-lock fs-1"></i>
              <p className="mt-2">Bạn không có quyền truy cập chức năng này</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
