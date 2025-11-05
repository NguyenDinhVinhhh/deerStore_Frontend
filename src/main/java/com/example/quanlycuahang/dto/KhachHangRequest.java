package com.example.quanlycuahang.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.util.Date;

public class KhachHangRequest {
    private String hoTen;
    private String sdt;
    private String email;
    private String diaChi;
    private String ghiChu;
    private Integer maNhom;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate ngayDangKy;

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getSdt() { return sdt; }
    public void setSdt(String sdt) { this.sdt = sdt; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

    public Integer getMaNhom() { return maNhom; }
    public void setMaNhom(Integer maNhom) { this.maNhom = maNhom; }

    public LocalDate getNgayDangKy() { return ngayDangKy; }
    public void setNgayDangKy(LocalDate ngayDangKy) { this.ngayDangKy = ngayDangKy; }
}
