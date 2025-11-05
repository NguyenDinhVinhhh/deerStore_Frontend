package com.example.quanlycuahang.service.KhachHang;


import com.example.quanlycuahang.dto.KhachHangRequest;
import com.example.quanlycuahang.entity.KhachHang.KhachHang;
import com.example.quanlycuahang.entity.KhachHang.NhomKhachHang;
import com.example.quanlycuahang.repository.KhachHang.KhachHangRepository;
import com.example.quanlycuahang.repository.KhachHang.NhomKhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class KhachHangServiceImpl implements KhachHangService {

    @Autowired
    private KhachHangRepository khRepo;

    @Autowired
    private NhomKhachHangRepository nhomRepo;

    @Override
    public List<KhachHang> getAll() {
        return khRepo.findAllWithNhom();
    }

    @Override
    public KhachHang getById(Integer id) {
        return khRepo.findByIdWithNhom(id);
    }

    @Override
    public KhachHang create(KhachHangRequest req) {
        KhachHang kh = new KhachHang();
        kh.setHoTen(req.getHoTen());
        kh.setSdt(req.getSdt());
        kh.setEmail(req.getEmail());
        kh.setDiaChi(req.getDiaChi());
        kh.setGhiChu(req.getGhiChu());
        kh.setNgayDangKy(req.getNgayDangKy() != null ? req.getNgayDangKy() : LocalDate.now());

        if (req.getMaNhom() != null) {
            NhomKhachHang nhom = nhomRepo.findById(req.getMaNhom())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm khách hàng id=" + req.getMaNhom()));
            kh.setNhom(nhom);
        }

        return khRepo.save(kh);
    }

    @Override
    public KhachHang update(Integer id, KhachHangRequest req) {
        Optional<KhachHang> opt = khRepo.findById(id);
        if (opt.isEmpty()) return null;
        KhachHang kh = opt.get();
        if (req.getHoTen() != null) kh.setHoTen(req.getHoTen());
        kh.setSdt(req.getSdt());
        kh.setEmail(req.getEmail());
        kh.setDiaChi(req.getDiaChi());
        kh.setGhiChu(req.getGhiChu());
        kh.setNgayDangKy(req.getNgayDangKy() != null ? req.getNgayDangKy() : kh.getNgayDangKy());

        if (req.getMaNhom() != null) {
            NhomKhachHang nhom = nhomRepo.findById(req.getMaNhom())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy nhóm khách hàng id=" + req.getMaNhom()));
            kh.setNhom(nhom);
        } else {
            kh.setNhom(null);
        }

        return khRepo.save(kh);
    }

    @Override
    public void delete(Integer id) {
        khRepo.deleteById(id);
    }
}