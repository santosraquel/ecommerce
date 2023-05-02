package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backend.entity.Fornecedor;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Long> {

}
