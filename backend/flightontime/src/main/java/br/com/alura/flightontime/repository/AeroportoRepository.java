package br.com.alura.flightontime.repository;

import br.com.alura.flightontime.model.Aeroporto;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AeroportoRepository extends JpaRepository<Aeroporto, String> {

    Aeroporto findByCodigoIcao(String codigoIcao);

    @Query("SELECT a FROM Aeroporto a WHERE " +
            "(LOWER(a.nomeAeroporto) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(a.codigoIata) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(a.codigoIcao) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
            "LOWER(a.cidade) LIKE LOWER(CONCAT('%', :termo, '%'))) " +
            "ORDER BY " +
            // 1. Brasil como prioridade máxima
            "CASE WHEN a.siglaPais = 'BR' THEN 0 ELSE 1 END ASC, " +

            // 2. Prioriza aeroportos que têm código IATA (filtra aeródromos pequenos)
            "CASE WHEN a.codigoIata IS NOT NULL AND a.codigoIata != '' THEN 0 ELSE 1 END ASC, " +

            // 3. Prioriza quando a CIDADE começa com o termo (Ex: "Guar" -> Guarulhos ganha de Araguari)
            "CASE WHEN LOWER(a.cidade) LIKE LOWER(CONCAT(:termo, '%')) THEN 0 ELSE 1 END ASC, " +

            // 4. Prioriza quando o NOME DO AEROPORTO começa com o termo
            "CASE WHEN LOWER(a.nomeAeroporto) LIKE LOWER(CONCAT(:termo, '%')) THEN 0 ELSE 1 END ASC, " +

            // 5. Critério de desempate alfabético
            "a.cidade ASC, a.nomeAeroporto ASC")
    List<Aeroporto> buscaAutoComplete(String termo, Pageable limite);
}
