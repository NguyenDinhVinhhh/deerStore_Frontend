package com.example.quanlycuahang.controller.VaiTro;

import com.example.quanlycuahang.entity.VaiTro.VaiTro;
import com.example.quanlycuahang.service.VaiTro.VaiTroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vaitro")
@CrossOrigin("*") // cho phép frontend gọi API
public class VaiTroController {

    @Autowired
    private VaiTroService vaiTroService;


    // API GET - Lấy danh sách vai trò
    @GetMapping
    public List<VaiTro> getAllVaiTro() {
        return vaiTroService.getAll();
    }

    // ✅ API POST - Thêm mới vai trò
    @PostMapping
    public VaiTro addVaiTro(@RequestBody VaiTro vaiTro) {
        return vaiTroService.save(vaiTro);
    }
}
