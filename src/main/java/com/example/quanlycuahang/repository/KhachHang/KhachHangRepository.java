package com.example.quanlycuahang.repository.KhachHang;


import com.example.quanlycuahang.entity.KhachHang.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {

    // Lấy tất cả khách hàng kèm thông tin nhóm để tránh lỗi lazy init
    @Query("SELECT k FROM KhachHang k LEFT JOIN FETCH k.nhom")
    List<KhachHang> findAllWithNhom();

    @Query("SELECT k FROM KhachHang k LEFT JOIN FETCH k.nhom WHERE k.maKh = :id")
    KhachHang findByIdWithNhom(Integer id);
}