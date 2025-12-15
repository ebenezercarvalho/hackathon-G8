package br.com.alura.flightontime.repository;

import br.com.alura.flightontime.model.Aeroporto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AeroportoRepository extends JpaRepository<Aeroporto, String> {
    Aeroporto findByCodigoIata(String codigoIata);

}
