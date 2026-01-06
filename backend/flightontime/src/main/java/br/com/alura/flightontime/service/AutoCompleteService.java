package br.com.alura.flightontime.service;

import br.com.alura.flightontime.dto.response.ResponseAutoCompleteAeroportoDTO;
import br.com.alura.flightontime.dto.response.ResponseAutoCompleteCompanhiaAereaDTO;
import br.com.alura.flightontime.model.Aeroporto;
import br.com.alura.flightontime.model.CompanhiaAerea;
import br.com.alura.flightontime.repository.AeroportoRepository;
import br.com.alura.flightontime.repository.CompanhiaAereaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AutoCompleteService {

    @Autowired
    private AeroportoRepository aeroportoRepository;

    @Autowired
    private CompanhiaAereaRepository companhiaAereaRepository;

    public List<ResponseAutoCompleteAeroportoDTO> autoCompleteAeroportos(String termo) {
        Pageable limite = PageRequest.of(0, 5);

        List<Aeroporto> aeroportosEncontrados = aeroportoRepository.buscaAutoComplete(termo, limite);
        List<ResponseAutoCompleteAeroportoDTO> resultados = new ArrayList<>();
        aeroportosEncontrados.forEach(aeroporto -> {
            resultados.add(new ResponseAutoCompleteAeroportoDTO(aeroporto.getNomeAeroporto(), aeroporto.getCodigoIata(), aeroporto.getCodigoIcao(), aeroporto.getLatitude(), aeroporto.getLongitude()));
        });
        return resultados;
    }

    public List<ResponseAutoCompleteCompanhiaAereaDTO> autoCompleteCompanhiaAerea(String termo) {
        Pageable limite = PageRequest.of(0, 5);
        List<CompanhiaAerea> companhiaAereasEncontradas = companhiaAereaRepository.buscaAutoComplete(termo, limite);
        List<ResponseAutoCompleteCompanhiaAereaDTO> resultados = new ArrayList<>();

        companhiaAereasEncontradas.forEach(c -> {
            resultados.add(new ResponseAutoCompleteCompanhiaAereaDTO(c.getNome(), c.getCodigoIata(), c.getCodigoIcao()));
        });
        return resultados;
    }
}
