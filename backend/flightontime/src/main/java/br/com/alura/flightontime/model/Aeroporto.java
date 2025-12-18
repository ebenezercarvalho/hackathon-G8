package br.com.alura.flightontime.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "lista_aeroportos")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Aeroporto {
    @Id
    @Column(name = "icao")
    private String codigoIcao;

    @Column(name = "iata")
    private String codigoIata;

    @Column(name= "name")
    private String nomeAeroporto;

    @Column(name = "lat")
    private Double latitude;

    @Column(name = "lon")
    private Double longitude;

    @Column(name = "country")
    private String siglaPais;

    @Column(name = "state")
    private String estado;

    @Column(name = "city")
    private String cidade;

    @Column(name = "tz")
    private String timezone;

}
