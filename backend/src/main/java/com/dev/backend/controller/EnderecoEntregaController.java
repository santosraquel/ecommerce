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

import com.dev.backend.entity.EnderecoEntrega;
import com.dev.backend.service.EnderecoEntregaService;

@RestController
@RequestMapping("/api/enderecoEntrega")
public class EnderecoEntregaController {

    @Autowired
    private EnderecoEntregaService enderecoEntregaService;

    // INSERIR
    @PostMapping("/")
    @CrossOrigin("http://localhost:3000")
    public EnderecoEntrega inserir(@RequestBody EnderecoEntrega enderecoEntrega) {
        return enderecoEntregaService.inserir(enderecoEntrega);
    }

    // ALTERAR
    @PutMapping("/")
    @CrossOrigin("http://localhost:3000")
    public EnderecoEntrega alterar(@RequestBody EnderecoEntrega enderecoEntrega) {
        return enderecoEntregaService.alterar(enderecoEntrega);
    }

    // EXCLUIR
    @DeleteMapping("/{id}")
    @CrossOrigin("http://localhost:3000")
    public ResponseEntity<Void> excluir(@PathVariable("id") Long id) {
        enderecoEntregaService.excluir(id);
        return ResponseEntity.ok().build();
    }

    // BUSCAR TODOS
    @GetMapping("/")
    @CrossOrigin("http://localhost:3000")
    public List<EnderecoEntrega> buscarTodos() {
        return enderecoEntregaService.buscarTodos();
    }
}
