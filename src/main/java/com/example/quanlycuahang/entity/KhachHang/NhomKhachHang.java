package com.example.quanlycuahang.entity.KhachHang;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "nhom_khach_hang")
public class NhomKhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_nhom")
    private Integer maNhom;

    @Column(name = "ten_nhom", nullable = false, length = 100)
    private String tenNhom;

    @Column(name = "mo_ta", length = 255)
    private String moTa;

    @Column(name = "trang_thai")
    private Boolean trangThai = true;

    @OneToMany(mappedBy = "nhom", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<KhachHang> khachHangs;

    public NhomKhachHang() {}

    // Getters & setters
    public Integer getMaNhom() { return maNhom; }
    public void setMaNhom(Integer maNhom) { this.maNhom = maNhom; }

    public String getTenNhom() { return tenNhom; }
    public void setTenNhom(String tenNhom) { this.tenNhom = tenNhom; }

    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }

    public Boolean getTrangThai() { return trangThai; }
    public void setTrangThai(Boolean trangThai) { this.trangThai = trangThai; }

    public List<KhachHang> getKhachHangs() { return khachHangs; }
    public void setKhachHangs(List<KhachHang> khachHangs) { this.khachHangs = khachHangs; }
}