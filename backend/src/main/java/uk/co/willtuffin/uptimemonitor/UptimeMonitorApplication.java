package uk.co.willtuffin.uptimemonitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class UptimeMonitorApplication {

	public static void main(String[] args) {
		SpringApplication.run(UptimeMonitorApplication.class, args);
	}

}
