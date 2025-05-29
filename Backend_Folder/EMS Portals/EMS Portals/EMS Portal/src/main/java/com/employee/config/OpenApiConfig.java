package com.employee.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI apiInfo() {
        return new OpenAPI()
            .info(new Info().title("Employee Management System API")
                .description("Employee Management System using Spring Boot")
                .version("1.0")
            )
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Dev Server"),
                        new Server().url("https://api.yourdomain.com").description("Production Server")
                ))
                .tags(List.of(
                        new Tag().name("Address API"),
                        new Tag().name("Admin Dashboard API"),
                        new Tag().name("Assist Request API"),
                        new Tag().name("Attendance API"),
                        new Tag().name("Auth API"),
                        new Tag().name("Company API"),
                        new Tag().name("Company Documents API"),
                        new Tag().name("Document API"),
                        new Tag().name("Employee Dashboard API"),
                        new Tag().name("Employee API"),
                        new Tag().name("Event API"),
                        new Tag().name("HR Complaint API"),
                        new Tag().name("Leave API"),
                        new Tag().name("Project API"),
                        new Tag().name("Task API")
                        ));
    }
}
