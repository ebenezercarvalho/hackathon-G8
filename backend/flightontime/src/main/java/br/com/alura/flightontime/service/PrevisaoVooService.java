package br.com.alura.flightontime.service;

import br.com.alura.flightontime.dto.RequisicaoPrevisaoVooDTO;
import br.com.alura.flightontime.dto.VooDTO;
import br.com.alura.flightontime.exception.ValidacaoDBException;
import br.com.alura.flightontime.repository.AeroportoRepository;
import br.com.alura.flightontime.repository.CompanhiaAereaRepository;
import br.com.alura.flightontime.validation.AeroportoValidation;
import br.com.alura.flightontime.validation.CompanhiaAereaValidation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PrevisaoVooService {

    @Autowired
    private AeroportoRepository aeroportoRepository;

    @Autowired
    private CompanhiaAereaRepository companhiaAereaRepository;

    @Autowired
    private AeroportoValidation aeroportoValidation;

    @Autowired
    private CompanhiaAereaValidation companhiaAereaValidation;

    public RequisicaoPrevisaoVooDTO previsao(VooDTO vooDTO) {
        List<String> listaErros = new ArrayList<>();
        listaErros.addAll(aeroportoValidation.validaAeroportos(vooDTO));
        listaErros.addAll(companhiaAereaValidation.validaCompanhiaAerea(vooDTO));
        if (!listaErros.isEmpty()) {
            throw new ValidacaoDBException(listaErros);
        }

        return new RequisicaoPrevisaoVooDTO(
                vooDTO.origem(),
                vooDTO.destino(),
                vooDTO.companhia(),
                definirPeriodo(vooDTO.dataPartida().getHour()),
                vooDTO.dataPartida().getHour(),
                vooDTO.dataPartida().getDayOfWeek().getValue(),
                vooDTO.dataPartida().getMonthValue()
        );
    }

    private String definirPeriodo(int hora) {
        if (hora >= 0 && hora < 12) return "Manhã";
        if (hora >= 12 && hora < 18) return "Tarde";
        return "Noite";
    }

}
