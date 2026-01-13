package br.com.alura.flightontime.infra.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

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

                        ## 👥 Integrantes

                        **Ebenézer Carvalho | Data Scientist | Líder**
                        * LinkedIn: [https://www.linkedin.com/in/ebenezercarvalho/](https://www.linkedin.com/in/ebenezercarvalho/)
                        * GitHub: [https://github.com/ebenezercarvalho](https://github.com/ebenezercarvalho)
                        
                        **Cassiano Baldin | Data Scientist**
                        * LinkedIn: [https://www.linkedin.com/in/cassiano-baldin/](https://www.linkedin.com/in/cassiano-baldin/)
                        * GitHub: [https://github.com/obaldin](https://github.com/obaldin)

                        **Daniela Vieira | Backend Developer**
                        * LinkedIn: [https://www.linkedin.com/in/dani-vieira/](https://www.linkedin.com/in/dani-vieira/)
                        * GitHub: [https://github.com/danielavieiratester](https://github.com/danielavieiratester)

                        **Lucas Soares | Backend Developer**
                        * LinkedIn: [https://www.linkedin.com/in/lucass-soaress/](https://www.linkedin.com/in/lucass-soaress/)
                        * GitHub: [https://github.com/lucastnsoares](https://github.com/lucastnsoares)
                        
                        **Wallen Silva | Backend Developer**
                        * LinkedIn: [https://www.linkedin.com/in/wallensilva/](https://www.linkedin.com/in/wallensilva/)
                        * GitHub: [https://github.com/wallenoliveira](https://github.com/wallenoliveira)

                        ## 🚀 Funcionalidades
                        * **🔮 Previsão de Atrasos**: Estime a pontualidade de voos com IA.
                        * **🔍 Autocomplete**: Busca inteligente de aeroportos e companhias aéreas.

                        ## 🛠️ Tecnologias
                        * Java 21
                        * Spring Boot 3.4.0
                        * PostgreSQL 17
                        """)
                .contact(new Contact()
                        .name("Equipe Chronus - Hackathon G8 ONE")))
                .externalDocs(new ExternalDocumentation()
                .description("Repositório do Projeto no GitHub")
                .url("https://github.com/ebenezercarvalho/hackathon-G8"))
                .servers(java.util.List.of(new io.swagger.v3.oas.models.servers.Server().url("/api").description("Default Server URL")));
        }
}
