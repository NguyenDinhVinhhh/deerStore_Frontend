package com.example.quanlycuahang.repository.VaiTro;



import com.example.quanlycuahang.entity.VaiTro.VaiTro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VaiTroRepository extends JpaRepository<VaiTro, Integer> {
}