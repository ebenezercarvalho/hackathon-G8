package br.com.alura.flightontime.validation;

import br.com.alura.flightontime.dto.VooDTO;
import br.com.alura.flightontime.repository.AeroportoRepository;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AeroportoValidation {
    @Autowired
    private AeroportoRepository aeroportoRepository;

    public List<String> validaAeroportos(VooDTO vooDTO) {
        List<String> listaErros = new ArrayList<>();
        var aeroportoOrigemEncontrado = aeroportoRepository.findByCodigoIata(vooDTO.origem());
        var aeroportoDestinoEncontrado = aeroportoRepository.findByCodigoIata(vooDTO.destino());

        if (aeroportoOrigemEncontrado != null && vooDTO.origem()!= null) {
            System.out.println("Nome aeroporto origem: " + aeroportoOrigemEncontrado.getNomeAeroporto());
        } else {
            listaErros.add("O aeroporto de origem não existe na base de dados.");
        }

        if (aeroportoDestinoEncontrado != null && vooDTO.destino()!= null) {
            System.out.println("Nome aeroporto destino: " + aeroportoDestinoEncontrado.getNomeAeroporto());
        } else {
            listaErros.add("O aeroporto de destino não existe na base de dados.");
        }
        return listaErros;
    }
}
