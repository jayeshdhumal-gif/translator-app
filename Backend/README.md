# Translator Backend

Spring Boot REST API for translator profiles that tourists can browse and hire.

## Requirements

- Java 21 or newer
- Maven 3.9 or newer
- PostgreSQL

Create the database before starting the API:

```sql
CREATE DATABASE translator_db;
```

The default connection is `jdbc:postgresql://localhost:5432/translator_db` with user `postgres` and password `postgres`. Override these values with environment variables when needed:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `PORT`

## Run

From the `Backend` directory:

```bash
mvn spring-boot:run
```

The API starts on `http://localhost:8080`.

## Endpoints

### Create a translator profile

`POST /api/profiles`

```json
{
  "name": "Anika Sharma",
  "email": "anika@example.com",
  "phone": "+91 9876543210",
  "city": "Jaipur",
  "languages": ["Hindi", "English", "French"],
  "bio": "Local translator and cultural guide.",
  "hourlyRate": 20.00
}
```

Returns `201 Created` with the saved profile and generated `id`.

### List translator profiles

`GET /api/profiles`

Returns `200 OK` with an array of saved profiles.

Example curl commands:

```bash
curl -X POST http://localhost:8080/api/profiles \
  -H "Content-Type: application/json" \
  -d '{"name":"Anika Sharma","email":"anika@example.com","phone":"+91 9876543210","city":"Jaipur","languages":["Hindi","English","French"],"bio":"Local translator and cultural guide.","hourlyRate":20.00}'

curl http://localhost:8080/api/profiles
```

Profiles require a name, valid email, city, at least one language, bio, and a positive hourly rate. Invalid requests return `400 Bad Request` with field-level errors.
