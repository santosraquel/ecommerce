package com.dev.backend.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.entity.Permissao;
import com.dev.backend.repository.PermissaoRepository;

@Service
public class PermissaoService {
    @Autowired
    private PermissaoRepository permissaoRepository;

    // INSERIR
    public Permissao inserir(Permissao permissao) {
        permissao.setDataCriacao(new Date());
        Permissao novaPermissao = permissaoRepository.saveAndFlush(permissao);
        return novaPermissao;
    }

    // ALTERAR
    public Permissao alterar(Permissao permissao) {
        permissao.setDataAtualizacao(new Date());
        return permissaoRepository.saveAndFlush(permissao);
    }

    // EXCLUIR
    public void excluir(Long id) {
        Permissao permissao = permissaoRepository.findById(id).get();
        permissaoRepository.delete(permissao);
    }

    // BUSCAR TODOS
    public List<Permissao> buscarTodos() {
        return permissaoRepository.findAll();
    }
}
