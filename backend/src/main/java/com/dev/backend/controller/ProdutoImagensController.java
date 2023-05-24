package com.dev.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.entity.ProdutoImagens;
import com.dev.backend.service.ProdutoImagensService;

@RestController
@RequestMapping("/api/produtoImagens")
public class ProdutoImagensController {
    @Autowired
    private ProdutoImagensService produtoImagensService;

    // INSERIR
    @PostMapping("/")
    public ProdutoImagens inserir(@RequestBody ProdutoImagens produtoImagens) {
        return produtoImagensService.inserir(produtoImagens);
    }

    // ALTERAR
    @PutMapping("/")
    public ProdutoImagens alterar(@RequestBody ProdutoImagens produtoImagens) {
        return produtoImagensService.alterar(produtoImagens);
    }

    // EXCLUIR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        produtoImagensService.excluir(id);
        return ResponseEntity.ok().build();
    }

    // BUSCAR TODOS
    @GetMapping("/")
    public List<ProdutoImagens> bucarTodos() {
        return produtoImagensService.buscarTodos();
    }
}
