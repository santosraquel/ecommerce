package com.dev.backend.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.entity.EnderecoEntrega;
import com.dev.backend.repository.EnderecoEntregaRepository;

@Service
public class EnderecoEntregaService {

    @Autowired
    private EnderecoEntregaRepository enderecoEntregaRepository;

    // INSERIR
    public EnderecoEntrega inserir(EnderecoEntrega enderecoEntrega) {
        enderecoEntrega.setDataCriacao(new Date());
        EnderecoEntrega novoEnderecoEntrega = enderecoEntregaRepository.saveAndFlush(enderecoEntrega);
        return novoEnderecoEntrega;
    }

    // ALTERAR
    public EnderecoEntrega alterar(EnderecoEntrega enderecoEntrega) {
        enderecoEntrega.setDataAtualizacao(new Date());
        return enderecoEntregaRepository.saveAndFlush(enderecoEntrega);
    }

    // EXCLUIR
    public void excluir(Long id) {
        EnderecoEntrega enderecoEntrega = enderecoEntregaRepository.findById(id).get();
        enderecoEntregaRepository.delete(enderecoEntrega);
    }

    // BUSCAR TODOS
    public List<EnderecoEntrega> buscarTodos() {
        return enderecoEntregaRepository.findAll();
    }
}
