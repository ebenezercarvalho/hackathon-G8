package br.com.alura.flightontime.validation;

import br.com.alura.flightontime.dto.VooDTO;
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
    public List<String> validar(VooDTO vooDTO) {
        List<String> listaErros = new ArrayList<>();
        var companhiaAereaEncontrada = companhiaAereaRepository
                .findByCodigoIcaoAndAtivo(vooDTO.codigoIcaoCompanhiaAerea(), "Y");

        if (companhiaAereaEncontrada == null || vooDTO.codigoIcaoCompanhiaAerea() == null) {
            listaErros.add("A companhia aérea não existe na base de dados.");
        }

        return listaErros;
    }
}
