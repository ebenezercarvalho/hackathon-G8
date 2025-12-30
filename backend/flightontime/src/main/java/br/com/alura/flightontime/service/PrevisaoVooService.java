package br.com.alura.flightontime.service;

import br.com.alura.flightontime.dto.RespostaPrevisaoDTO;
import br.com.alura.flightontime.dto.VooDTO;
import br.com.alura.flightontime.infra.exception.ErroConfiguracaoApiException;
import br.com.alura.flightontime.infra.exception.RespostaInvalidaServicoExternoException;
import br.com.alura.flightontime.infra.exception.ServicoExternoIndisponivelException;
import br.com.alura.flightontime.infra.exception.ValidacaoDBException;
import br.com.alura.flightontime.validation.VooValidation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Service
public class PrevisaoVooService {
    @Autowired
    private RestClient restClient;

    @Autowired
    private List<VooValidation> validadores = new ArrayList<>();

    @Value("${api.previsao.uri}")
    private URI apiUri;

    public RespostaPrevisaoDTO previsao(VooDTO vooDTO) throws RespostaInvalidaServicoExternoException {
        List<String> listaErros = new ArrayList<>();

        validadores.forEach(validacao -> {listaErros.addAll(validacao.validar(vooDTO));});

        if (!listaErros.isEmpty()) {
            throw new ValidacaoDBException(listaErros);
        }

        try {
            var resposta = restClient.post()
                    .uri(apiUri)
                    .body(vooDTO.converteParaRequisicaoPrevisaoVooDTO())
                    .retrieve()
                    .body(RespostaPrevisaoDTO.class);
            resposta.validacao();
            return resposta;
        } catch (IllegalArgumentException ex) {
            throw new ErroConfiguracaoApiException("Erro interno do servidor");
        }
        catch (ResourceAccessException ex) {
            throw new ServicoExternoIndisponivelException("Serviço de previsão indisponível no momento", ex);
        } catch (HttpStatusCodeException ex) {
            throw new RespostaInvalidaServicoExternoException("Erro ao requisitar serviço de previsão");
        }
    }
}
