package com.example.quanlycuahang.service.VaiTro;

import com.example.quanlycuahang.entity.VaiTro.VaiTro;
import com.example.quanlycuahang.repository.VaiTro.VaiTroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VaiTroServiceImpl implements VaiTroService {

    @Autowired
    private VaiTroRepository vaiTroRepository;

    @Override
    public List<VaiTro> getAll() {
        return vaiTroRepository.findAll();
    }

    @Override
    public VaiTro save(VaiTro vaiTro) {
        return vaiTroRepository.save(vaiTro);
    }
}
