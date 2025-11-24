import { useState } from "react";
import {
  FaStore,
  FaUserCog,
  FaFileInvoice,
  FaCogs,
  FaBoxes,
  FaRegClipboard,
  FaUsers,
  FaMoneyCheckAlt,
  FaFileAlt,
  FaBalanceScale,
  FaExchangeAlt,
  FaPlug,
  FaTruck,
  FaBan,
  FaHistory,
  FaFileExport,
  FaPercent,
  FaTicketAlt,
  FaList,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Configuration.css";
import EmployeePermissions from "../Employee//EmployeeList";
import Branchs from "../Branchs/Branch";
import Warehouse from "../warehouse/warehouse";
import Voichers from "../Voichers/Voichers";
import Category from "../Category/Category";
import RolePermissionPage from "../RolePermissionPage/RolePermissionPage";
export default function Configuration() {
  const [activePage, setActivePage] = useState("main");

  if (activePage === "employee") {
    return <EmployeePermissions onBack={() => setActivePage("main")} />;
  } else if (activePage === "abc") {
    return <RolePermissionPage onBack={() => setActivePage("main")} />;
  } else if (activePage === "chi-nhanh") {
    return <Branchs onBack={() => setActivePage("main")} />;
  } else if (activePage === "kho-hang") {
    return <Warehouse onBack={() => setActivePage("main")} />;
  } else if (activePage === "khuyen-mai") {
    return <Voichers onBack={() => setActivePage("main")} />;
  } else if (activePage === "danh-muc") {
    return <Category onBack={() => setActivePage("main")} />;
  }

  const storeSettings = [
    {
      icon: <FaStore />,
      title: "Thông tin cửa hàng",
      desc: "Quản lý thông tin liên hệ và địa chỉ của cửa hàng",
    },
    {
      icon: <FaMapMarkerAlt />,
      title: "Quản lý chi nhánh",
      desc: "Thêm mới & quản lý thông tin chi nhánh",
      onClick: () => setActivePage("chi-nhanh"),
    },
    {
      icon: <FaUsers />,
      title: "Nhân viên và Tài khoản",
      desc: "Quản lý tài khoản và nhân viên",
      onClick: () => setActivePage("employee"),
    },
    {
      icon: <FaUserCog />,
      title: "Phân quyền",
      desc: "Quản lý phân quyền",
      onClick: () => setActivePage("abc"),
    },
    {
      icon: <FaBoxes />,
      title: "Quản lý kho hàng",
      desc: "Thiết lập quản lý thông tin về kho hàng",
      onClick: () => setActivePage("kho-hang"),
    },

    {
      icon: <FaFileAlt />,
      title: "Chính sách giá",
      desc: "Tạo và quản lý các chính sách giá của cửa hàng",
    },
    {
      icon: <FaTicketAlt />,
      title: "Khuyến mãi",
      desc: "Thiết lập & tuỳ chỉnh các khuyến mãi",
      onClick: () => setActivePage("khuyen-mai"),
    },
    {
      icon: <FaMoneyCheckAlt />,
      title: "Thanh toán",
      desc: "Kết nối & tạo các cổng thanh toán (VNPay, Momo...)",
    },

    {
      icon: <FaList />,
      title: "Danh mục sản phẩm",
      desc: "Quản lý danh mục sản phẩm",
      onClick: () => setActivePage("danh-muc"),
    },
    {
      icon: <FaUserCog />,
      title: "Quản lý khác",
      desc: "Thiết lập đăng nhập và thông tin khác",
    },
  ];

  const salesSettings = [
    {
      icon: <FaCogs />,
      title: "Cấu hình bán hàng",
      desc: "Thiết lập các cấu hình áp dụng khi bán hàng",
    },
    {
      icon: <FaTruck />,
      title: "Nguồn bán hàng",
      desc: "Thêm và quản lý nguồn tạo ra đơn hàng",
    },
    {
      icon: <FaPlug />,
      title: "Kênh bán hàng",
      desc: "Quản lý các kênh bán hàng bạn sử dụng",
    },
    {
      icon: <FaBan />,
      title: "Lý do huỷ trả",
      desc: "Thêm và điều chỉnh lý do khi huỷ trả đơn hàng",
    },
    {
      icon: <FaRegClipboard />,
      title: "Xử lý đơn hàng",
      desc: "Thiết lập quy trình xử lý đơn hàng của cửa hàng",
    },
    {
      icon: <FaFileInvoice />,
      title: "Hoá đơn điện tử",
      desc: "Kết nối hoá đơn điện tử (VNPT, MISA, Viettel...)",
    },
    {
      icon: <FaBalanceScale />,
      title: "Cân điện tử",
      desc: "Thiết lập sử dụng cân điện tử có in mã vạch",
    },
  ];

  const logs = [
    {
      icon: <FaFileExport />,
      title: "Xuất / Nhập file",
      desc: "Theo dõi và quản lý xuất nhập file dữ liệu cửa hàng",
    },
    {
      icon: <FaHistory />,
      title: "Nhật ký hoạt động",
      desc: "Quản lý lịch sử tác vụ, nhật ký hoạt động",
    },
  ];

  const renderSection = (title, data) => (
    <div className="card mb-4 shadow-sm border-0">
      <div className="card-body">
        <h5 className="fw-bold">{title}</h5>
        <hr />
        <div className="grid">
          {data.map((item, i) => (
            <div
              key={i}
              className="config-item"
              onClick={item.onClick}
              style={{ cursor: item.onClick ? "pointer" : "default" }}
            >
              <div className="config-icon">{item.icon}</div>
              <div>
                <h6>{item.title}</h6>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="config p-4">
      {renderSection("Thiết lập cửa hàng", storeSettings)}
      {renderSection("Thiết lập bán hàng", salesSettings)}
      {renderSection("Nhật ký", logs)}
    </div>
  );
}
