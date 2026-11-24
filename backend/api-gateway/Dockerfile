# Etapa 1: compila el .jar con Maven (la caché de ~/.m2 se comparte entre servicios)
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN --mount=type=cache,id=pcforgery-m2,target=/root/.m2 mvn -B -q package -DskipTests

# Etapa 2: imagen liviana solo con el JRE y el .jar
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/api-gateway.jar app.jar
ENV JAVA_OPTS="-Xms64m -Xmx192m -XX:+UseSerialGC -XX:TieredStopAtLevel=1"
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
