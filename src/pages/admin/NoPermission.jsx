import React from "react";

export default function NoPermission() {
  return (
    <div className="text-center mt-5">
      <h3 className="text-danger">Bạn không có quyền truy cập trang này!</h3>
      <p>Vui lòng liên hệ quản trị viên để được cấp quyền.</p>
    </div>
  );
}
