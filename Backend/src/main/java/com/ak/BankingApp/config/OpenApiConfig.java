package com.ak.BankingApp.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenApi(){
        return new OpenAPI()
                .info(new Info()
                        .title("Banking App API")
                        .version("1.0")
                        .description("This API provides banking operations like account management, transactions, and user authentication.")
                        .contact(new Contact()
                                .name("Arun Kargatia")
                                .email("arunkargatia47@gmail.com")
                                .url("https://github.com/ArunKargatia")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Development"),
                        new Server().url("https://api.bankingapp.com").description("Production Server")
                ));
    }
}
