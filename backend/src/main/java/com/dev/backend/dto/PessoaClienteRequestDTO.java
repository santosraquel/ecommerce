package com.dev.backend.dto;

import org.springframework.beans.BeanUtils;

import com.dev.backend.entity.Cidade;
import com.dev.backend.entity.Pessoa;

import lombok.Data;

@Data
public class PessoaClienteRequestDTO {
    private String nome;
    private String cpf;
    private String email;
    private String endereco;
    private String cep;
    private Cidade cidade;

    // método que faz a conversão de PessoaClienteDTO para Pessoa, já que o que
    // temos mapeado no banco é a classe Pessoa
    public Pessoa converter(PessoaClienteRequestDTO pessoaClienteRequestDTO) {
        Pessoa pessoa = new Pessoa();
        BeanUtils.copyProperties(pessoaClienteRequestDTO, pessoa);
        return pessoa;
    }
}
