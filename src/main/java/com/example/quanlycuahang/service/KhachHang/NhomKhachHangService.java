package com.example.quanlycuahang.service.KhachHang;



import com.example.quanlycuahang.entity.KhachHang.NhomKhachHang;

import java.util.List;

public interface NhomKhachHangService {
    List<NhomKhachHang> getAll();
    NhomKhachHang getById(Integer id);
    NhomKhachHang save(NhomKhachHang nhom);
    NhomKhachHang update(int id, NhomKhachHang nhom);
    void delete(int id);
}