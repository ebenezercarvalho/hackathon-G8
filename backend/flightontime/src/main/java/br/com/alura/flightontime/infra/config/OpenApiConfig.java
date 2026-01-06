package br.com.alura.flightontime.infra.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
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
                                                .title("✈️ FlightOnTime API")
                                                .version("1.0.0")
                                                .summary("API REST para previsão de atrasos de voos utilizando dados de machine learning.")
                                                .description("""
                                                                Projeto desenvolvido pela **Equipe Chronus** durante o **Hackathon G8 ONE**.

                                                                ## 🚀 Funcionalidades
                                                                * **🔮 Previsão de Atrasos**: Estime a pontualidade de voos com IA.
                                                                * **🔍 Autocomplete**: Busca inteligente de aeroportos e companhias aéreas.

                                                                ## 🛠️ Tecnologias
                                                                * Java 21
                                                                * Spring Boot 4.0.0
                                                                * PostgreSQL 17
                                                                """)
                                                .contact(new Contact()
                                                                .name("Equipe Chronus - Hackathon G8 ONE")))
                                                .externalDocs(new ExternalDocumentation()
                                                                .description("Repositório do Projeto no GitHub")
                                                                .url("https://github.com/ebenezercarvalho/hackathon-G8"));
        }
}
