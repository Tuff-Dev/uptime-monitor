package uk.co.willtuffin.uptimemonitor.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI myOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Server URL in Development environment");

        Contact contact = new Contact();
        contact.setEmail("tuff2dev@gmail.com");
        contact.setName("Will Tuffin");
        contact.setUrl("https://www.will-tuffin.co.uk");

        Info info = new Info()
                .title("Uptime Monitor API")
                .version("1.0")
                .contact(contact)
                .description("This API exposes endpoints to manage uptime monitors.");

        return new OpenAPI().info(info).servers(List.of(devServer));
    }
}
