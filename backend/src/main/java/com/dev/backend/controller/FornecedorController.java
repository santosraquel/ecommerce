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

import com.dev.backend.entity.Fornecedor;
import com.dev.backend.service.FornecedorService;

@RestController
@RequestMapping("/api/fornecedor")
public class FornecedorController {

    @Autowired
    private FornecedorService fornecedorService;

    // INSERIR
    @PostMapping("/")
    public Fornecedor inserir(@RequestBody Fornecedor fornecedor) {
        return fornecedorService.inserir(fornecedor);
    }

    // ALTERAR
    @PutMapping("/")
    public Fornecedor alterar(@RequestBody Fornecedor fornecedor) {
        return fornecedorService.alterar(fornecedor);
    }

    // EXCLUIR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable("id") Long id) {
        fornecedorService.excluir(id);
        return ResponseEntity.ok().build();
    }

    // BUSCAR TODOS
    @GetMapping("/")
    public List<Fornecedor> buscarTodos() {
        return fornecedorService.buscarTodos();
    }
}
