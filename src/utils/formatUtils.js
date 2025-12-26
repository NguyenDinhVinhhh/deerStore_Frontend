// src/utils/formatUtils.js

/**
 * Định dạng số thành tiền tệ VND (Ví dụ: 5000000 -> 5.000.000 ₫)
 */
export const formatVND = (amount) => {
  if (amount === undefined || amount === null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Định dạng phần trăm (Ví dụ: 8 -> 8.00%)
 */
export const formatPercent = (value) => {
  if (value === undefined || value === null) return "0.00%";
  return `${parseFloat(value).toFixed(2)}%`;
};