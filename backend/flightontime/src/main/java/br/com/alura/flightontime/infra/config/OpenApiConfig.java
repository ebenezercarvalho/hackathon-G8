package br.com.alura.flightontime.infra.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FlightOnTime API")
                                .summary("API para previsão de atrasos de voos utilizando dados históricos.")
                        .description("")
                        .contact(new Contact()
                                .name("Equipe 26 - Hackathon G8 ONE")
                                .url("https://github.com/ebenezercarvalho/hackathon-G8/"))
                );
    }
}
