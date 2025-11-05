package com.example.quanlycuahang.entity.VaiTro;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vai_tro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VaiTro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_vai_tro")
    private Integer maVaiTro;

    @Column(name = "ten_vai_tro", nullable = false)
    private String tenVaiTro;

    @Column(name = "mo_ta")
    private String moTa;
}