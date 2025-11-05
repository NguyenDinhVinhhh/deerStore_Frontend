package com.example.quanlycuahang.entity.KhachHang;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "khach_hang")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_kh")
    private Integer maKh;

    @Column(name = "ho_ten", nullable = false, length = 255)
    private String hoTen;

    @Column(name = "sdt", length = 50)
    private String sdt;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "dia_chi", length = 255)
    private String diaChi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nhom")
    @JsonIgnoreProperties({"khachHangs"}) // tránh vòng lặp khi serializing nhóm
    private NhomKhachHang nhom;

    @Column(name = "ngay_dang_ky")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate ngayDangKy;

    @Column(name = "ghi_chu", length = 500)
    private String ghiChu;

    // Constructors
    public KhachHang() {}

    // Getters & setters
    public Integer getMaKh() { return maKh; }
    public void setMaKh(Integer maKh) { this.maKh = maKh; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getSdt() { return sdt; }
    public void setSdt(String sdt) { this.sdt = sdt; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }

    public NhomKhachHang getNhom() { return nhom; }
    public void setNhom(NhomKhachHang nhom) { this.nhom = nhom; }

    public LocalDate getNgayDangKy() { return ngayDangKy; }
    public void setNgayDangKy(LocalDate ngayDangKy) { this.ngayDangKy = ngayDangKy; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
}