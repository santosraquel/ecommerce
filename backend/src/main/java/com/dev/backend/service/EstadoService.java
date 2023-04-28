package com.dev.backend.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.entity.Estado;
import com.dev.backend.repository.EstadoRepository;

@Service
public class EstadoService {

    @Autowired // notação para que o Spring gerencie a criação de objetos, ou seja new Object()
    private EstadoRepository estadoRepository; // objeto do tipo EstadoRepository

    // INSERIR: método que retorna o objeto Estado persistido no banco de dados
    public Estado inserir(Estado estado) {
        estado.setDataCriacao(new Date());
        Estado estadoNovo = estadoRepository.saveAndFlush(estado); // criando um novo objeto do tipo Estado e salvando
                                                                   // direto no banco
        return estadoNovo;
    }

    // ALTERAR
    public Estado alterar(Estado estado) {
        estado.setDataAtualizacao(new Date());
        return estadoRepository.saveAndFlush(estado);
    }

    // ESCLUIR
    public void excluir(Long id) {
        // criando objeto do tipo Estado
        Estado estado = estadoRepository.findById(id).get();
        estadoRepository.delete(estado);
    }

    // CONSULTAR: retorna uma lista de Estado
    public List<Estado> buscarTodos() {
        return estadoRepository.findAll();
    }
}
