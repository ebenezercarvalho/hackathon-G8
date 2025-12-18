package br.com.alura.flightontime.repository;

import br.com.alura.flightontime.model.CompanhiaAerea;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanhiaAereaRepository extends JpaRepository<CompanhiaAerea, Integer>{

    CompanhiaAerea findByCodigoIcaoAndAtivo(String codigoIcao, String ativo);

    CompanhiaAerea findByCodigoIataAndAtivo(String codigoIata, String ativo);

    @Query("SELECT c FROM CompanhiaAerea c WHERE " +
            "(LOWER(c.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(c.codigoIata) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(c.codigoIcao) LIKE LOWER(CONCAT('%', :termo, '%'))) " +
            "ORDER BY " +
            // 1. Prioridade: Companhias Ativas (Y) aparecem antes das inativas (N)
            "CASE WHEN c.ativo = 'Y' THEN 0 ELSE 1 END ASC, " +

            // 2. Prioridade: Companhias Brasileiras
            "CASE WHEN c.pais = 'Brazil' OR c.pais = 'BR' THEN 0 ELSE 1 END ASC, " +

            // 3. Melhoria de UX: Nome começa com o termo (Ex: "Azul" aparece antes de "Voo Azul")
            "CASE WHEN LOWER(c.nome) LIKE LOWER(CONCAT(:termo, '%')) THEN 0 ELSE 1 END ASC, " +

            // 4. Critério de desempate alfabético
            "c.nome ASC")
    List<CompanhiaAerea> buscaAutoComplete(String termo, Pageable limite);
}
