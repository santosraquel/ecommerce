package com.dev.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.entity.Produto;
import com.dev.backend.service.ProdutoService;

@RestController
@RequestMapping("/api/produto")
public class ProdutoController {
    @Autowired
    private ProdutoService produtoService;

    // INSERIR
    @PostMapping("/")
    @CrossOrigin("http://localhost:3000")
    public Produto inserir(@RequestBody Produto produto) {
        return produtoService.inserir(produto);
    }

    // ALTERAR
    @PutMapping("/")
    @CrossOrigin("http://localhost:3000")
    public Produto alterar(@RequestBody Produto produto) {
        return produtoService.alterar(produto);
    }

    // EXCLUIR
    @DeleteMapping("/{id}")
    @CrossOrigin("http://localhost:3000")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        produtoService.excluir(id);
        return ResponseEntity.ok().build();
    }

    // BUSCAR TODOS
    @GetMapping("/")
    @CrossOrigin("http://localhost:3000")
    public List<Produto> bucarTodos() {
        return produtoService.buscarTodos();
    }

    // BUSCAR POR ID
    @GetMapping("/{id}")
    @CrossOrigin("http://localhost:3000")
    public Produto bucarPorId(@PathVariable Long id) {
        return produtoService.buscarPorId(id);
    }
}
