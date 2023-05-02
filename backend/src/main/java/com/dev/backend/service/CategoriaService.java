package com.dev.backend.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.entity.Categoria;
import com.dev.backend.repository.CategoriaRepository;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    // INSERIR
    public Categoria inserir(Categoria categoria) {
        categoria.setDataCriacao(new Date());
        Categoria novaCategoria = categoriaRepository.saveAndFlush(categoria);
        return novaCategoria;
    }

    // ALTERAR
    public Categoria alterar(Categoria categoria) {
        categoria.setDataAtualizacao(new Date());
        return categoriaRepository.saveAndFlush(categoria);
    }

    // EXCLUIR
    public void excluir(Long id) {
        Categoria categoria = categoriaRepository.findById(id).get();
        categoriaRepository.delete(categoria);
    }

    // BUSCAR TODOS
    public List<Categoria> buscarTodos() {
        return categoriaRepository.findAll();
    }
}
