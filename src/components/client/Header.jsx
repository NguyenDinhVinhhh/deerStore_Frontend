import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../../assets/imgs/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { NavDropdown, Container } from "react-bootstrap";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaSearch,
  FaUserCircle,
  FaShoppingBasket,
} from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/home");
    window.location.reload();
  };

  return (
    <header className="main-header shadow-sm">
      {/* Top Bar - Spring Sale */}
      <div className="header-top py-2">
        <Container className="d-flex justify-content-between align-items-center">
          <span className="sale-text">
            Spring Sale: Up to 15% off with code <strong>SPRING15</strong>
          </span>
          <div className="social-links d-flex gap-3">
            <FaFacebookF className="social-icon" />
            <FaInstagram className="social-icon" />
            <FaTwitter className="social-icon" />
            <FaEnvelope className="social-icon" />
          </div>
        </Container>
      </div>

      {/* Main Header - Logo, Search, Actions */}
      <div className="header-main py-3 border-bottom bg-white">
        <Container className="d-flex justify-content-between align-items-center gap-4">
          <Link to="/home" className="logo-wrapper">
            <img src={logo} alt="Deer Store" className="main-logo" />
          </Link>

          <div className="search-box position-relative flex-grow-1 mx-4">
            <input
              type="text"
              placeholder="Tìm kiếm mô hình..."
              className="search-input w-100 rounded-pill ps-4 pe-5 border"
            />
            <button className="search-btn position-absolute end-0 top-0 h-100 border-0 bg-transparent pe-3">
              <FaSearch className="text-muted" />
            </button>
          </div>

          <div className="header-actions d-flex align-items-center gap-4">
            {user ? (
              <div className="d-flex align-items-center">
                <FaUserCircle className="user-avatar-icon me-2" />
                <NavDropdown
                  title={
                    <span className="username-text fw-bold">
                      {user.tenDangNhap}
                    </span>
                  }
                  id="user-nav-dropdown"
                  className="custom-dropdown"
                  align="end"
                >
                  {localStorage.getItem("userType") === "ADMIN" && (
                    <NavDropdown.Item onClick={() => navigate("/admin")}>
                      Trang quản trị
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item
                    onClick={() => navigate("/purchase-history")}
                  >
                    Lịch sử mua hàng
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/profile")}>
                    Thông tin cá nhân
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={handleLogout}
                    className="text-danger fw-bold"
                  >
                    Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            ) : (
              <Link to="/login" className="login-button rounded-pill">
                Đăng nhập
              </Link>
            )}
          </div>
        </Container>
      </div>

      {/* Navigation Menu */}
      <nav className="header-bottom bg-white py-2">
        <Container className="d-flex gap-5 justify-content-start">
          <Link to="/home" className="nav-item">
            Home
          </Link>
          <Link to="/all-product" className="nav-item">
            All product
          </Link>
          <Link to="/brands" className="nav-item">
            Brands
          </Link>
          <Link to="/stores" className="nav-item">
            Stores
          </Link>
          <Link to="/contact" className="nav-item">
            Contact
          </Link>
        </Container>
      </nav>
    </header>
  );
}

export default Header;
