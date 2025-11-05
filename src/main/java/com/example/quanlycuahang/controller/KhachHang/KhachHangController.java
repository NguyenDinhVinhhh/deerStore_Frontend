package com.example.quanlycuahang.controller.KhachHang;

import com.example.quanlycuahang.dto.KhachHangRequest;
import com.example.quanlycuahang.entity.KhachHang.KhachHang;

import com.example.quanlycuahang.service.KhachHang.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/khachhang")
@CrossOrigin("*")
public class KhachHangController {

    @Autowired
    private KhachHangService khachHangService;

    @GetMapping
    public ResponseEntity<List<KhachHang>> getAll() {
        return ResponseEntity.ok(khachHangService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KhachHang> getOne(@PathVariable Integer id) {
        KhachHang kh = khachHangService.getById(id);
        if (kh == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(kh);
    }

    @PostMapping
    public ResponseEntity<KhachHang> create(@RequestBody KhachHangRequest req) {
        KhachHang created = khachHangService.create(req);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KhachHang> update(@PathVariable Integer id, @RequestBody KhachHangRequest req) {
        KhachHang updated = khachHangService.update(id, req);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        khachHangService.delete(id);
        return ResponseEntity.noContent().build();
    }
}