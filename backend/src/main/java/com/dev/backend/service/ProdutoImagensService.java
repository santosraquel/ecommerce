package com.dev.backend.service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.entity.Produto;
import com.dev.backend.entity.ProdutoImagens;
import com.dev.backend.repository.ProdutoImagensRepository;
import com.dev.backend.repository.ProdutoRepository;

@Service
public class ProdutoImagensService {

    @Autowired
    private ProdutoImagensRepository produtoImagensRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    // INSERIR
    public ProdutoImagens inserir(Long idProduto, MultipartFile file) {
        Produto produto = produtoRepository.findById(idProduto).get();
        ProdutoImagens novoProdutoImagens = new ProdutoImagens();
        try {
            if (!file.isEmpty()) { // verifica se o arquivo é diferente de vazio
                byte[] bytes = file.getBytes(); // obtem o arquivo em bytes
                String nomeImagem = String.valueOf(produto.getId()) + file.getOriginalFilename();
                Path caminho = Paths // define o caminho que será salvo o arquivo
                        .get("c:/imagens/" + nomeImagem);
                Files.write(caminho, bytes);
                novoProdutoImagens.setNome(nomeImagem);

            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        novoProdutoImagens.setProduto(produto);
        novoProdutoImagens.setDataCriacao(new Date());
        novoProdutoImagens = produtoImagensRepository.saveAndFlush(novoProdutoImagens);
        return novoProdutoImagens;
    }

    // ALTERAR
    public ProdutoImagens alterar(ProdutoImagens produtoImagens) {
        produtoImagens.setDataAtualizacao(new Date());
        return produtoImagensRepository.saveAndFlush(produtoImagens);
    }

    // EXCLUIR
    public void excluir(Long id) {
        ProdutoImagens produtoImagens = produtoImagensRepository.findById(id).get();
        produtoImagensRepository.delete(produtoImagens);
    }

    // BUSCAR TODOS
    public List<ProdutoImagens> buscarTodos() {
        return produtoImagensRepository.findAll();
    }

    // BUSCAR IMAGENS DE DETERMINADO PRODUTO
    public List<ProdutoImagens> buscarPorProduto(Long idProduto) {
        List<ProdutoImagens> listaProdutoImagens = produtoImagensRepository.findByProdutoId(idProduto);
        for (ProdutoImagens produtoImagens : listaProdutoImagens) {
            try (InputStream in = new FileInputStream("c:/imagens/" + produtoImagens.getNome())) {
                produtoImagens.setArquivo(IOUtils.toByteArray(in));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return listaProdutoImagens;
    }
}
