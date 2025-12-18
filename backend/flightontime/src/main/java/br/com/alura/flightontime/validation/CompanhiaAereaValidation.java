package br.com.alura.flightontime.validation;

import br.com.alura.flightontime.dto.VooDTO;
import br.com.alura.flightontime.repository.CompanhiaAereaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CompanhiaAereaValidation {
    @Autowired
    private CompanhiaAereaRepository companhiaAereaRepository;

    public List<String> validaCompanhiaAerea(VooDTO vooDTO) {
        List<String> listaErros = new ArrayList<>();
        var companhiaAereaEncontrada = companhiaAereaRepository.findByCodigoIcaoAndAtivo(vooDTO.codigoIcaoCompanhiaAerea(), "Y");

        if (companhiaAereaEncontrada != null && vooDTO.codigoIcaoCompanhiaAerea()!= null) {
            System.out.println("Nome companhia aérea : " + companhiaAereaEncontrada.getNome());
        } else {
            listaErros.add("A companhia aérea não existe na base de dados.");
        }
        return listaErros;
    }
}
