# Use a lightweight JDK image
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the locally built JAR into the container
COPY target/BankingApp-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
