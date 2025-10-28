// src/components/ProductCard.jsx
export default function ProductCard({ image, name, price, discount }) {
  return (
    <div className="card h-100 shadow-sm">
      <img src={image} className="card-img-top" alt={name} />
      <div className="card-body text-center">
        <h6 className="card-title">{name}</h6>
        <p className="text-danger fw-bold mb-1">{price}đ</p>
        {discount && <small className="text-muted">Giảm {discount}%</small>}
      </div>
    </div>
  );
}
