package br.com.alura.flightontime.service;

import br.com.alura.flightontime.dto.request.RequestPrevisaoDTO;
import br.com.alura.flightontime.dto.request.RequestPrevisaoDataScienceDTO;
import br.com.alura.flightontime.dto.response.ResponsePrevisaoDTO;
import br.com.alura.flightontime.dto.response.ResponsePrevisaoDataScienceDTO;
import br.com.alura.flightontime.infra.exception.ErroConfiguracaoApiException;
import br.com.alura.flightontime.infra.exception.RespostaInvalidaServicoExternoException;
import br.com.alura.flightontime.infra.exception.ServicoExternoIndisponivelException;
import br.com.alura.flightontime.infra.exception.ValidacaoDBException;
import br.com.alura.flightontime.model.PeriodoDia;
import br.com.alura.flightontime.model.ProbabilidadeAtraso;
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

    public ResponsePrevisaoDTO previsao(RequestPrevisaoDTO requestPrevisaoDTO)
            throws RespostaInvalidaServicoExternoException {
        List<String> listaErros = new ArrayList<>();

        validadores.forEach(validacao -> {
            listaErros.addAll(validacao.validar(requestPrevisaoDTO));
        });

        if (!listaErros.isEmpty()) {
            throw new ValidacaoDBException(listaErros);
        }

        try {
            var resposta = restClient.post()
                    .uri(apiUri)
                    .body(this.converteParaRequestPrevisaoDataScienceDTO(requestPrevisaoDTO))
                    .retrieve()
                    .body(ResponsePrevisaoDataScienceDTO.class);
            resposta.validacao();
            return this.converteParaResponsePrevisaoDTO(resposta);
        } catch (IllegalArgumentException ex) {
            throw new ErroConfiguracaoApiException("Erro interno do servidor");
        } catch (ResourceAccessException ex) {
            throw new ServicoExternoIndisponivelException("Serviço de previsão indisponível no momento", ex);
        } catch (HttpStatusCodeException ex) {
            throw new RespostaInvalidaServicoExternoException("Erro ao requisitar serviço de previsão");
        }
    }

    private RequestPrevisaoDataScienceDTO converteParaRequestPrevisaoDataScienceDTO(RequestPrevisaoDTO dto) {
        return new RequestPrevisaoDataScienceDTO(
                dto.codigoIcaoVooOrigem(),
                dto.codigoIcaoVooDestino(),
                dto.codigoIcaoCompanhiaAerea(),
                PeriodoDia.retornaPeriodo(dto.dataPartida().getHour()),
                dto.dataPartida().getHour(),
                dto.dataPartida().getDayOfWeek().getValue() - 1,
                dto.dataPartida().getMonthValue());
    }

    private ResponsePrevisaoDTO converteParaResponsePrevisaoDTO(ResponsePrevisaoDataScienceDTO dto) {
        return new ResponsePrevisaoDTO(this.nomePrevisaoAtraso(dto), dto.probabilidadeAtraso());
    }

    private ProbabilidadeAtraso nomePrevisaoAtraso(ResponsePrevisaoDataScienceDTO dto) {
        if (dto.probabilidadeAtraso() >= 0 && dto.probabilidadeAtraso() < 0.20) {
            return ProbabilidadeAtraso.MUITO_BAIXA;
        } else if (dto.probabilidadeAtraso() >= 0.20 && dto.probabilidadeAtraso() < 0.40) {
            return ProbabilidadeAtraso.BAIXA;
        } else if (dto.probabilidadeAtraso() >= 0.40 && dto.probabilidadeAtraso() < 0.60) {
            return ProbabilidadeAtraso.MEDIA;
        } else if (dto.probabilidadeAtraso() >= 0.60 && dto.probabilidadeAtraso() < 0.80) {
            return ProbabilidadeAtraso.ALTA;
        } else if (dto.probabilidadeAtraso() >= 0.80 && dto.probabilidadeAtraso() <= 1) {
            return ProbabilidadeAtraso.MUITO_ALTA;
        } else {
            throw new RespostaInvalidaServicoExternoException("Probabilidade de atraso inválida");
        }
    }



}
