package com.dev.backend.controller;

import com.dev.backend.entity.Estado;
import com.dev.backend.service.EstadoService;

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

@RestController // notação para responder a requisições do tipo rest
@RequestMapping("/api/estado") // definindo uma rota padrão para todos os endpoints
public class EstadoController {

    @Autowired
    private EstadoService estadoService;

    @PostMapping("/")
    public Estado inserir(@RequestBody Estado estado) {
        return estadoService.inserir(estado);
    }

    @PutMapping("/")
    public Estado alterar(@RequestBody Estado estado) {
        return estadoService.alterar(estado);
    }

    // EXCLUIR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable("id") Long id) {
        estadoService.excluir(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/")
    public List<Estado> buscarTodos() {
        return estadoService.buscarTodos();
    }
}
