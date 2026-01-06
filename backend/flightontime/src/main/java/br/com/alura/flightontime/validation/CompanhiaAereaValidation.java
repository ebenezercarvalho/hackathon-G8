package br.com.alura.flightontime.validation;

import br.com.alura.flightontime.dto.request.RequestPrevisaoDTO;
import br.com.alura.flightontime.repository.CompanhiaAereaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class CompanhiaAereaValidation implements VooValidation {
    @Autowired
    private CompanhiaAereaRepository companhiaAereaRepository;

    @Override
    public List<String> validar(RequestPrevisaoDTO dto) {
        List<String> listaErros = new ArrayList<>();
        var companhiaAereaEncontrada = companhiaAereaRepository
                .findByCodigoIcaoAndAtivo(dto.codigoIcaoCompanhiaAerea(), "Y");

        if (companhiaAereaEncontrada == null || dto.codigoIcaoCompanhiaAerea() == null) {
            listaErros.add("A companhia aérea não existe na base de dados.");
        }

        return listaErros;
    }
}
