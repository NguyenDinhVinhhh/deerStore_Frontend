package com.example.quanlycuahang.service.KhachHang;


import com.example.quanlycuahang.entity.KhachHang.NhomKhachHang;

import com.example.quanlycuahang.repository.KhachHang.NhomKhachHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NhomKhachHangServiceImpl implements NhomKhachHangService {

    @Autowired
    private NhomKhachHangRepository nhomRepo;

    @Override
    public List<NhomKhachHang> getAll() {
        return nhomRepo.findAll();
    }

    @Override
    public NhomKhachHang getById(Integer id) {
        Optional<NhomKhachHang> optional = nhomRepo.findById(id);
        return optional.orElse(null);
    }

    @Override
    public NhomKhachHang save(NhomKhachHang nhom) {
        return nhomRepo.save(nhom);
    }

    @Override
    public NhomKhachHang update(int id, NhomKhachHang nhom) {
        Optional<NhomKhachHang> existing = nhomRepo.findById(id);
        if (existing.isPresent()) {
            NhomKhachHang entity = existing.get();
            entity.setTenNhom(nhom.getTenNhom());
            entity.setMoTa(nhom.getMoTa());
            entity.setTrangThai(nhom.getTrangThai());
            return nhomRepo.save(entity);
        }
        return null;
    }

    @Override
    public void delete(int id) {
        nhomRepo.deleteById(id);
    }
}