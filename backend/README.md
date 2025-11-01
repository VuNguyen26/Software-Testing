# Backend (Spring Boot 3 + MySQL + JPA)
## Requirements
- JDK 17+
- MySQL 8 (or use docker-compose below)

## Run MySQL with Docker
```bash
docker compose up -d
```

## Configure
- Default DB: `jdbc:mysql://localhost:3306/sgu_assignment`
- Default user/pass: `root` / `root`
Override with env: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`

## Run tests
```bash
mvn test
```

## Run app
```bash
mvn spring-boot:run
```

## API
- POST `/api/auth/login` body: `{ "username":"admin", "password":"Admin123" }`
- POST `/api/products` header: `Authorization: Bearer demo-token-admin`
```json
{ "name":"Ball", "price":1000, "quantity":1, "description":"", "category":"SPORT" }
```