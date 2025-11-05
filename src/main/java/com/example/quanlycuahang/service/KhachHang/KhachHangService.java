package com.example.quanlycuahang.service.KhachHang;

import com.example.quanlycuahang.dto.KhachHangRequest;
import com.example.quanlycuahang.entity.KhachHang.KhachHang;

import java.util.List;


public interface KhachHangService {
    List<KhachHang> getAll();
    KhachHang getById(Integer id);
    KhachHang create(KhachHangRequest req);
    KhachHang update(Integer id, KhachHangRequest req);
    void delete(Integer id);
}