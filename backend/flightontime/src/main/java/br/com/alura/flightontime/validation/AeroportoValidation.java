package br.com.alura.flightontime.validation;

import br.com.alura.flightontime.dto.request.RequestPrevisaoDTO;
import br.com.alura.flightontime.repository.AeroportoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.List;

@Component
public class AeroportoValidation implements VooValidation {
    @Autowired
    private AeroportoRepository aeroportoRepository;

    @Override
    public List<String> validar(RequestPrevisaoDTO dto) {
        List<String> listaErros = new ArrayList<>();
        var aeroportoOrigemEncontrado = aeroportoRepository.findByCodigoIcao(dto.codigoIcaoVooOrigem());
        var aeroportoDestinoEncontrado = aeroportoRepository.findByCodigoIcao(dto.codigoIcaoVooDestino());

        if (aeroportoOrigemEncontrado == null || dto.codigoIcaoVooOrigem() == null) {
            listaErros.add("O aeroporto de origem não existe na base de dados.");
        }

        if (aeroportoDestinoEncontrado == null || dto.codigoIcaoVooDestino() == null) {
            listaErros.add("O aeroporto de destino não existe na base de dados.");
        }

        return listaErros;
    }
}
