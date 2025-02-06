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
        cd blackpear

### 2️⃣ Use the Correct Node Version

        nvm use

🚀 Running the Application
--------------------------

### 1\. Recommended: Using Docker

Ensure your Docker software is running.

1.  Run the app with Docker (this will bootstrap everything: the backend, database, and seeders):
    
        npm run docker:app
    
2.  Open your browser and head to **Swagger API Docs** to test the app: 

        http://localhost:5050/api

### 2\. Alternative: Manual Setup

1.  Use Node.js 18.19.0:
    
        nvm use
    
2.  Set up the environment variables and install dependencies:
    
        npm run setup
    
3.  Start the PostgreSQL database using Docker:
    
        npm run docker:db

4.  Run seeders:
    
        npm run seed
    
5.  Start the application:
    
        npm run start:dev
    
6.  Open your browser and head to **Swagger API Docs** to test the app: 

        http://localhost:5050/api

🧪 Running Tests
----------------

### 1\. Unit and Integration Tests

Run all unit and integration tests using **Jest**:

    npm run test

### 2\. End-to-End (E2E) Tests

Run end-to-end tests using **Jest**:

    npm run test:e2e

The end-to-end tests will execute the test suite located in `/test/app.e2e-spec.ts`.

📜 API Documentation
--------------------

The API documentation (Swagger UI) is available at:

    [http://localhost:5050/api](http://localhost:5050/api)


🛠 Additional Information
-------------------------

*   The application is built using **NestJS** for scalable server-side development.
*   Uses **MongoDB** as the primary database.
*   Provides structured logging via **Pino**.

📁 Project Structure
--------------------


*   data
    *   observations
        *   observation1.json
        *   observation2.json
        *   observation3.json
        *   observation4.json
        *   observation5.json
    *   patients
        *   patient1.json
        *   patient2.json
*   node\_modules
*   src
    *   database
        *   database.module.ts
    *   modules
        *   observation
            *   observation.controller.ts
            *   observation.dto.ts
            *   observation.module.ts
            *   observation.repository.ts
            *   observation.schema.ts
            *   observation.service.ts
        *   patient
            *   patient.controller.ts
            *   patient.dto.ts
            *   patient.module.ts
            *   patient.repository.ts
            *   patient.schema.ts
            *   patient.service.ts
    *   seeders
        *   observation.seed.ts
        *   patient.seed.ts
        *   seed.module.ts
        *   seed.service.ts
        *   seed.ts
    *   app.controller.ts
    *   app.controller.spec.ts
    *   app.module.ts
    *   app.service.ts
    *   main.ts
*   test
    *   app.e2e-spec.ts
    *   jest-e2e.json
*   .env
*   .envsample
*   .eslintrc.js
*   .gitignore
*   .nvmrc
*   .prettierrc
*   docker-compose-db-only.yml
*   docker-compose.yml
*   Dockerfile
*   nest-cli.json
*   package-lock.json
*   package.json
*   README.md
*   tsconfig.build.json
*   tsconfig.json