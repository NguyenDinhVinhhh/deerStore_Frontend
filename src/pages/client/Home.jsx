import React from "react";
import Banner from "../../components/client/Banner";

function Home() {
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
    </div>
  );
}

export default Home;
