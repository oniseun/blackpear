Blackpear Health API
====================

The Blackpear Health API is designed to support healthcare professionals by providing secure and efficient access to patient records and clinical observations.

📌 Key Features
---------------

*   Retrieve patient records using either their **NHS number** or **surname**.
*   Retrieve all **observations** recorded for a specific patient.
*   Supports secure and structured access to healthcare data.

📌 Prerequisites
----------------

*   **Node.js**: Version **v18.19.0**
*   **NPM**
*   **NVM** (Node Version Manager)
*   **Docker** (optional, for running the full app)

⚙️ Setup Instructions
---------------------

### 1️⃣ Clone the Repository

git clone https://github.com/oniseun/blackpear.git
cd blackpear/backend

### 2️⃣ Use the Correct Node Version

nvm use

🚀 Running the Application
--------------------------

### Option 1: Run Everything with Docker (Recommended)

This will start the full application including the database, seed data, and backend.

npm run docker:app

### Option 2: Run Only the Database (Then Start Manually)

This starts only MongoDB. You'll need to run seeders manually and start the app separately.

npm run docker:db
npm run setup
npm run seed
npm run start:dev

📜 API Documentation
--------------------

The API documentation (Swagger UI) is available at:

http://localhost:5050/api

🧪 Running Tests
----------------

### Unit Tests

npm run test

### End-to-End Tests

npm run test:e2e

🛠 Additional Information
-------------------------

*   The application is built using **NestJS** for scalable server-side development.
*   Uses **MongoDB** as the primary database.
*   Provides structured logging via **Pino**.

📁 Project Structure
--------------------

backend/
|-- src/
|   |-- modules/
|   |   |-- patient/
|   |   |   |-- patient.dto.ts
|   |   |   |-- patient.controller.ts
|   |   |   |-- patient.service.ts
|   |   |   |-- patient.repository.ts
|   |   |-- observation/
|   |   |   |-- observation.dto.ts
|   |   |   |-- observation.controller.ts
|   |   |   |-- observation.service.ts
|   |   |   |-- observation.repository.ts
|   |-- app.module.ts
|-- .envsample
|-- .env (generated by setup script)
|-- docker-compose.yml
|-- package.json
|-- README.md
|-- tsconfig.json