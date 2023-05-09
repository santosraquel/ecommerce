package com.dev.backend.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.dev.backend.entity.Produto;
import com.dev.backend.repository.ProdutoRepository;

public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    // INSERIR
    public Produto inserir(Produto produto) {
        produto.setDataCriacao(new Date());
        Produto novoProduto = produtoRepository.saveAndFlush(produto);
        return novoProduto;
    }

    // ALTERAR
    public Produto alterar(Produto produto) {
        produto.setDataAtualizacao(new Date());
        return produtoRepository.saveAndFlush(produto);
    }

    // EXCLUIR
    public void excluir(Long id) {
        Produto produto = produtoRepository.findById(id).get();
        produtoRepository.delete(produto);
    }

    // BUSCAR TODOS
    public List<Produto> buscarTodos() {
        return produtoRepository.findAll();
    }
}
