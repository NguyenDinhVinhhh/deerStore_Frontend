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
              Đăng nhập 
            </button>
          </div>
        </div>
      </div>
     
      <div className="header-bottom">
        <div className="container d-flex gap-4">
          <Link to="/home" className=" text-black text-decoration-none">
            Home
          </Link>
           <Link to="/all-product" className=" text-black text-decoration-none">
            All product
          </Link>
           <Link to="/brands" className=" text-black text-decoration-none">
            Brands
          </Link>
          <Link to="/stores" className=" text-black text-decoration-none">
            Stores
          </Link>
          <Link to="/contact" className=" text-black text-decoration-none">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
