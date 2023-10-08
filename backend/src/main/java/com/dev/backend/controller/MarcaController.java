package com.dev.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.entity.Marca;
import com.dev.backend.service.MarcaService;

import jakarta.websocket.server.PathParam;

@RestController
@RequestMapping("/api/marca")
public class MarcaController {

    @Autowired
    private MarcaService marcaService;

    // INSERIR
    @PostMapping("/")
    @CrossOrigin("http://localhost:3000")
    public Marca inserir(@RequestBody Marca marca) {
        return marcaService.inserir(marca);
    }

    // ALTERAR
    @PutMapping("/")
    @CrossOrigin("http://localhost:3000")
    public Marca alterar(@RequestBody Marca marca) {
        return marcaService.alterar(marca);
    }

    // EXCLUIR
    @DeleteMapping("/{id}")
    @CrossOrigin("http://localhost:3000")
    public ResponseEntity<Void> excluir(@PathParam("id") Long id) {
        marcaService.excluir(id);
        return ResponseEntity.ok().build();
    }

    // BUSCAR TODOS
    @GetMapping("/")
    @CrossOrigin("http://localhost:3000")
    public List<Marca> buscaTodos() {
        return marcaService.buscarTodos();
    }
}
