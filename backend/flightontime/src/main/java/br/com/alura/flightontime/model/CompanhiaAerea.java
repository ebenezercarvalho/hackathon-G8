package br.com.alura.flightontime.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "lista_companhias_aereas")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CompanhiaAerea {
    @Id
    @Column(name = "airline_id")
    private Integer id;

    @Column(name = "name")
    private String nome;

    @Column(name = "alias")
    private String apelido;

    @Column(name = "iata")
    private String codigoIata;

    @Column(name = "icao")
    private String codigoIcao;

    @Column(name = "country")
    private String pais;

    @Column(name = "active")
    private String ativo;
}
