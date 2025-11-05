package com.example.quanlycuahang.controller.KhachHang;

import com.example.quanlycuahang.entity.KhachHang.NhomKhachHang;
import com.example.quanlycuahang.service.KhachHang.NhomKhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nhomkhachhang")
@CrossOrigin("*")
public class NhomKhachHangController {

    @Autowired
    private NhomKhachHangService nhomKhachHangService;

    @GetMapping
    public List<NhomKhachHang> getAll() {
        return nhomKhachHangService.getAll();
    }

    // Get by id
    @GetMapping("/{id}")
    public ResponseEntity<NhomKhachHang> getById(@PathVariable Integer id) {
        NhomKhachHang nhom = nhomKhachHangService.getById(id);
        if (nhom == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(nhom);
    }

    @PostMapping
    public NhomKhachHang create(@RequestBody NhomKhachHang nhom) {
        return nhomKhachHangService.save(nhom);
    }

    @PutMapping("/{id}")
    public NhomKhachHang update(@PathVariable int id, @RequestBody NhomKhachHang nhom) {
        return nhomKhachHangService.update(id, nhom);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        nhomKhachHangService.delete(id);
    }
}