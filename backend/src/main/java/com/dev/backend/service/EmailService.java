package com.dev.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String remetente;

    public String enviarEmailTexto(String destinatario, String titulo, String mensagem) {

        try {
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom(remetente); // remetente
            simpleMailMessage.setTo(destinatario); // destinatario
            simpleMailMessage.setSubject(titulo); // titulo
            simpleMailMessage.setText(mensagem); // mensagem
            javaMailSender.send(simpleMailMessage); // enviando a mensagem
            return "E-mail enviado com sucesso!";
        } catch (Exception ex) {
            return "Erro ao enviar o e-mail";
        }
    }
}
