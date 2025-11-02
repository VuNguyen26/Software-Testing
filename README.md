<<<<<<< HEAD
# FloginFE_BE (SGU Assignment Starter)

## Quick Start

### 1) Backend
```bash
cd backend
docker compose up -d              # start MySQL 8 (3306), db=sgu_assignment, user=root/root
mvn spring-boot:run               # run backend on :8080
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env              # edit VITE_API_BASE if needed
npm install
npm run dev                       # open http://localhost:5173
```

### 3) Tests
- Frontend: `npm run test` (Vitest + React Testing Library, coverage HTML in `coverage/`)
- Backend: `mvn test` (JUnit + Mockito)

### 4) Demo credentials
- Username: `admin`
- Password: `Admin123`

---

This starter meets core rules: login + product CRUD endpoints, FE validation, unit tests for FE & BE, minimal integration points.
=======
# FloginFE_BE
>>>>>>> c3265830b36a6eafd079988652e05e23176a9ff3
