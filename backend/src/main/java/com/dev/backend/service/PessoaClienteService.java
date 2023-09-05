package com.dev.backend.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.dto.PessoaClienteRequestDTO;
import com.dev.backend.entity.Pessoa;
import com.dev.backend.repository.PessoaClienteRepository;

@Service
public class PessoaClienteService {

    @Autowired
    private PessoaClienteRepository pessoaClienteRepository;

    @Autowired
    private PermissaoPessoaService permissaoPessoaService;

    @Autowired
    private EmailService emailService;

    // INSERIR
    public Pessoa registrar(PessoaClienteRequestDTO pessoaClienteRequestDTO) {
        Pessoa pessoa = new PessoaClienteRequestDTO().converter(pessoaClienteRequestDTO);
        pessoa.setDataCriacao(new Date());
        Pessoa pessoaNova = pessoaClienteRepository.saveAndFlush(pessoa);
        permissaoPessoaService.vincularPessoaPermissaoCliente(pessoaNova);
        emailService.enviarEmailTexto(pessoaNova.getEmail(), "Cadastro na Loja Rosa Neon",
                "Cadastro na loja foi realizado com sucesso! Em breve você receberá a senha de acesso por e-mail");
        return pessoaNova;
    }
}
