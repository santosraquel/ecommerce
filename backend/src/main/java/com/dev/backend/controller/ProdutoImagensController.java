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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.entity.ProdutoImagens;
import com.dev.backend.service.ProdutoImagensService;

@RestController
@RequestMapping("/api/produtoImagens")
public class ProdutoImagensController {
    @Autowired
    private ProdutoImagensService produtoImagensService;

    // INSERIR
    @PostMapping("/")
    @CrossOrigin("http://localhost:3000")
    public ProdutoImagens inserir(@RequestParam("idProduto") Long idProduto, @RequestParam("file") MultipartFile file) {
        return produtoImagensService.inserir(idProduto, file);
    }

    // ALTERAR
    @PutMapping("/")
    @CrossOrigin("http://localhost:3000")
    public ProdutoImagens alterar(@RequestBody ProdutoImagens objeto) {
        return produtoImagensService.alterar(objeto);
    }

    // EXCLUIR
    @DeleteMapping("/{id}")
    @CrossOrigin("http://localhost:3000")
    public ResponseEntity<Void> excluir(@PathVariable("id") Long id) {
        produtoImagensService.excluir(id);
        return ResponseEntity.ok().build();
    }

    // BUSCAR TODOS
    @GetMapping("/")
    @CrossOrigin("http://localhost:3000")
    public List<ProdutoImagens> buscarTodos() {
        return produtoImagensService.buscarTodos();
    }

    @GetMapping("/produto/{id}")
    @CrossOrigin("http://localhost:3000")
    public List<ProdutoImagens> buscarPorProduto(@PathVariable("id") Long idProduto) {
        return produtoImagensService.buscarPorProduto(idProduto);
    }
}
