package com.dev.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.entity.Categoria;
import com.dev.backend.service.CategoriaService;

import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/api/categoria")
public class CategoriaControler {

    @Autowired
    private CategoriaService categoriaService;

    // INSERIR
    @PostMapping("/")
    public Categoria inserir(@RequestBody Categoria categoria) {
        return categoriaService.inserir(categoria);
    }

    // ALTERAR
    @PutMapping("/")
    public Categoria alterar(@RequestBody Categoria categoria) {
        return categoriaService.alterar(categoria);
    }

    // EXCLUIR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathParam("id") Long id) {
        categoriaService.excluir(id);
        return ResponseEntity.ok().build();
    }

    // BUSCAR TODOS
    @GetMapping("/")
    public List<Categoria> buscarTodos() {
        return categoriaService.buscarTodos();
    }
}
