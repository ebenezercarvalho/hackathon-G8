package br.com.alura.flightontime.infra.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.time.Duration;

@Configuration
public class RestClientConfig {

    @Value("${api.client.timeout.connect:3}")
    private long connectTimeout;

    @Value("${api.client.timeout.read:3}")
    private long readTimeout;

    @Bean
    public RestClient.Builder restClientBuilder() {
        return RestClient.builder();
    }


    @Bean
    public RestClient restClient(RestClient.Builder builder) {
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .connectTimeout(Duration.ofSeconds(connectTimeout))
                .build();

        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);

        requestFactory.setReadTimeout(Duration.ofSeconds(readTimeout));

        return builder
                .requestFactory(requestFactory)
                .build();
    }
}
