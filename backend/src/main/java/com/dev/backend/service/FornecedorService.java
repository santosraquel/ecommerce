package com.dev.backend.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.entity.Fornecedor;
import com.dev.backend.repository.FornecedorRepository;

@Service
public class FornecedorService {

    @Autowired
    private FornecedorRepository fornecedorRepository;

    // INSERIR
    public Fornecedor inserir(Fornecedor fornecedor) {
        fornecedor.setDataCriacao(new Date());
        Fornecedor novFornecedor = fornecedorRepository.saveAndFlush(fornecedor);
        return novFornecedor;
    }

    // ALTERAR
    public Fornecedor alterar(Fornecedor fornecedor) {
        fornecedor.setDataAtualizacao(new Date());
        return fornecedorRepository.saveAndFlush(fornecedor);
    }

    // EXCLUIR
    public void excluir(Long id) {
        Fornecedor fornecedor = fornecedorRepository.findById(id).get();
        fornecedorRepository.delete(fornecedor);
    }

    // BUSCAR TODOS
    public List<Fornecedor> buscarTodos() {
        return fornecedorRepository.findAll();
    }
}
