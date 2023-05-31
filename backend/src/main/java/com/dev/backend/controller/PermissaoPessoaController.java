// package com.dev.backend.controller;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.dev.backend.entity.PermissaoPessoa;
// import com.dev.backend.service.PermissaoPessoaService;

// @RestController
// @RequestMapping("/api/permissao-pessoa")
// public class PermissaoPessoaController {

// @Autowired
// private PermissaoPessoaService permissaoPessoaService;

// // INSERIR
// @PostMapping("/")
// public PermissaoPessoa inserir(@RequestBody PermissaoPessoa permissaoPessoa)
// {
// return permissaoPessoaService.inserir(permissaoPessoa);
// }

// // ALTERAR
// @PutMapping("/")
// public PermissaoPessoa alterar(@RequestBody PermissaoPessoa permissaoPessoa)
// {
// return permissaoPessoaService.alterar(permissaoPessoa);
// }

// // EXCLUIR
// @DeleteMapping("/{id}")
// public ResponseEntity<Void> excluir(@PathVariable("id") Long id) {
// permissaoPessoaService.excluir(id);
// return ResponseEntity.ok().build();
// }

// // BUSCAR TODOS
// @GetMapping("/")
// public List<PermissaoPessoa> buscarTodos() {
// return permissaoPessoaService.buscarTodos();
// }
// }
