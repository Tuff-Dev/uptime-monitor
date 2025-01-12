# Step 0 - Setup the project
## Backend
- Java Spring Boot - Java 21 - Bootstraped with Spring Initializr
- Database - PostgreSQL
- ORM - Hibernate
- JPA - Spring Data JPA
- Testing - JUnit 5
- Logging - SLF4J
- Metrics - Micrometer ? - Set up later
- Monitoring - Spring Boot Actuator

## Frontend
- React
- TailwindCSS
- Vite
- Shadcn/UI

# Step 1 - Enter URL to be monitored
- Create an API endpoint to store the URL in the database
- Also created the get, update and delete endpoints for uptime monitoring

- Build UI to add monitors
- UI to view all monitors has also been created
- UI to view a single monitor has also been created

# Step 2 - Send HTTP HEAD request to the URLs at the specified frequency, storing the result and relevant data for each request in the database.
- Created a scheduled task to send the HTTP HEAD request to the URLs at the specified frequency
- Stored the result and relevant data for each request in the database

# Step 3 - Display the results in the UI
- Added a table to the UI to display the results
- Added a chart to the UI to display the results




