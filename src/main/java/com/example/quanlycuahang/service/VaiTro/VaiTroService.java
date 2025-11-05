package com.example.quanlycuahang.service.VaiTro;

import com.example.quanlycuahang.entity.VaiTro.VaiTro;
import java.util.List;

public interface VaiTroService {
    List<VaiTro> getAll();
    VaiTro save(VaiTro vaiTro);
}
