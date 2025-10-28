import React from "react";
import "./Header.css"; 
import logo from "../../assets/imgs/logo.png"
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
 
      <div className="header-top">
        <div className="container d-flex justify-content-between align-items-center">
          <span>
            Spring Sale: Up to 15% off with code <strong>SPRING15</strong>
          </span>
          <div className="social-icons">
            <i className="bi bi-facebook"></i>
            <i className="bi bi-instagram"></i>
            <i className="bi bi-twitter"></i>
            <i className="bi bi-envelope"></i>
          </div>
        </div>
      </div>
      
      <div className="header-main">
        <div className="container d-flex justify-content-between align-items-center">

          <div className="logo d-flex align-items-center">
            <img src={logo} alt="Logo" className="logo-img" />
          </div>

          <div className="search-bar">
            <input type="text" placeholder="Tìm kiếm..." />
            <button>
              <i className="bi bi-search"></i>
            </button>
          </div>

          <div className="header-actions d-flex align-items-center">
            <i className="bi bi-person-circle"></i>
            <button className="cart-btn">
              Giỏ hàng / 0 <i className="bi bi-cart"></i>
            </button>
          </div>
        </div>
      </div>
     
      <div className="header-bottom">
        <div className="container d-flex gap-4">
          <span>NEW ARRIVALS</span>
          <span>DIY MINIATURE HOUSE</span>
          <span>3D WOODEN PUZZLE</span>
          <span>DIY BOOK NOOK</span>
          <span>PLASTIC MINI HOUSE</span>
          <Link to="/contact" className="text-white text-decoration-none">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
