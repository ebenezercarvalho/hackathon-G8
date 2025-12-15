package br.com.alura.flightontime.repository;

import br.com.alura.flightontime.model.CompanhiaAerea;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanhiaAereaRepository extends JpaRepository<CompanhiaAerea, Integer>{
    CompanhiaAerea findByCodigoIcaoAndAtivo(String codigoIcao, String ativo);
}
