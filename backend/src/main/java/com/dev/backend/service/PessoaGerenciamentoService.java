package com.dev.backend.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.entity.Pessoa;
import com.dev.backend.repository.PessoaRepository;

@Service
public class PessoaGerenciamentoService {

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private EmailService emailService;

    public String solicitarCodigo(String email) {
        Pessoa pessoa = pessoaRepository.findByEmail(email);
        pessoa.setCodigoRecuperacaoSenha(getRecuperacaoSenha(pessoa.getId()));
        pessoa.setDataEnvioCodigo(new Date());
        pessoaRepository.saveAndFlush(pessoa);
        emailService.enviarEmailTexto(pessoa.getEmail(), "Código de Recuperação de Senha",
                "Olá, o seu código para recuperação de senha é: " + pessoa.getCodigoRecuperacaoSenha());
        return "Código enviado!";
    }

    public String alterarSenha(Pessoa pessoa) {
        Pessoa pessoaBanco = pessoaRepository.findByEmailAndCodigoRecuperacaoSenha(pessoa.getEmail(),
                pessoa.getCodigoRecuperacaoSenha());
        if (pessoaBanco != null) {
            Date diferenca = new Date(new Date().getTime() - pessoaBanco.getDataEnvioCodigo().getTime());
            if (diferenca.getTime() / 1000 < 900) { // tempo em segundos - 15 minutos = 900 segundos
                // depois que adicionar o spring security é necessário criptografar a senha
                pessoaBanco.setSenha(pessoa.getSenha());
                pessoaBanco.setCodigoRecuperacaoSenha(null); // para invalidar o código se ele tentar usar o mesmo
                pessoaBanco.setDataEnvioCodigo(null);
                pessoaRepository.saveAndFlush(pessoaBanco);
                return "Senha alterada com sucesso!";
            } else {
                return "Tempo expirado, solicite um novo código!";
            }
        } else {
            return "Email ou código não encontrado!";
        }
    }

    private String getRecuperacaoSenha(Long id) {
        DateFormat format = new SimpleDateFormat("ddMMyyyyHHmmssmm");
        return format.format(new Date()) + id;
    }
}
