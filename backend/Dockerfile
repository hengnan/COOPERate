FROM maven:3.9.6-eclipse-temurin-21 AS build
ADD . /project
WORKDIR /project
RUN mvn -e package -DskipTests

FROM eclipse-temurin:latest
COPY --from=build /project/target/cooperate-0.0.1-SNAPSHOT.jar /app/Main.jar
ENTRYPOINT ["java", "-jar", "/app/Main.jar"]