# Yoga App - Full Stack Application

Yoga class management application built with Angular 14 (front-end) and Spring Boot 2.6 (back-end).

## Prerequisites
-   **Java**: Version 11
    -   Check installation: `java -version`
-   **Node.js**: Version 14
    -   Check installation: `node -v`
-   **npm**: Version 6 or higher
    -   Check installation: `npm -v`
-   **Maven**: Version 3.6 or higher
    -   Check installation: `mvn -v`
-   **MySQL**: Version 8.0 or higher
    -   Check installation: `mysql --version`

---

## Technologies Used

### Back-end
-   **Spring Boot** 2.6.1
-   **Spring Security** (JWT)
-   **Spring Data JPA**
-   **MySQL** 8.0+
-   **JUnit 5** (Unit tests)
-   **Mockito** (Mocking framework)
-   **JaCoCo** (Code coverage)
-   **Maven** (Dependency management)

### Front-end
-   **Angular** 14
-   **Angular Material** 14
-   **RxJS** 7.5
-   **TypeScript** 4.7
-   **Jest** 28 (Unit tests)
-   **Cypress** 10 (E2E tests)
-   **Istanbul/NYC** (Code coverage)

---

## Project Structure

```
.
├── back/                          # Spring Boot back-end
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/             # Java source code
│   │   │   └── resources/        # Configuration files
│   │   └── test/
│   │       └── java/             # Unit and integration tests
│   ├── pom.xml                   # Maven configuration
│   └── README.md
│
├── front/                         # Angular front-end
│   ├── src/
│   │   ├── app/                  # Angular source code
│   │   └── assets/               # Images, styles, etc.
│   ├── cypress/
│   │   ├── e2e/                  # E2E tests
│   │   └── fixtures/             # Test data
│   ├── package.json              # npm dependencies
│   └── README.md
│
├── ressources/
│   ├── postman/                  # Postman collection
│   └── sql/                      # SQL scripts
│       └── script.sql
│
└── README.md                      # This file
```

## 🗄️ Database Installation

### 1. Create the Database

Connect to MySQL:

```bash
  mysql -u root -p
```

Create the database and user:

```sql
    CREATE DATABASE test;
    CREATE USER 'user'@'localhost' IDENTIFIED BY '123456';
    GRANT ALL PRIVILEGES ON test.* TO 'user'@'localhost';
    FLUSH PRIVILEGES;
```

### 2. Import the Schema

The SQL script is located in `ressources/sql/script.sql`. Execute it:

```bash
  mysql -u user -p test < ressources/sql/script.sql
```

Enter the password: `123456`

### 3. Verify the Import

Connect and verify the tables:

```bash
  mysql -u user -p yoga
```

```sql
    SHOW TABLES;
    SELECT * FROM USERS;
```

---

## Project Installation

### 1. Clone the Project

```bash
    git clone https://github.com/The-Great-Toad/OC-Java-Angular-P4.git
    cd OC-Java-Angular-P4
```

### 2. Install the Back-end

```bash
    cd back
    mvn clean install
```

### 3. Install the Front-end

```bash
    cd ../front
    npm install
```

---

## Running the Application

### Launch the Back-end (API)

From the `back` folder:

```bash
  mvn spring-boot:run
```

The back-end will be accessible at: **http://localhost:8080**

### Launch the Front-end

In a new terminal, from the `front` folder:

```bash
  npm run start
```

The front-end will be accessible at: **http://localhost:4200**

The application will automatically open in your default browser.

To log in to the application with administrator privileges:

-   **Email**: `yoga@studio.com`
-   **Password**: `test!1234`

---

## Testing

### Back-end Tests (Spring Boot + JUnit)

From the `back` folder:

#### Run Unit Tests Only

```bash
  mvn test -Dtest="*Test"
```

#### Run Integration Tests Only

```bash
  mvn test -Dtest="*IT"
```

### Front-end Tests (Jest)

#### Unit Tests

From the `front` folder:

```bash
    # Run tests
    npm run test
    
    # Run tests in watch mode
    npm run test:watch
    
    # Run tests with coverage
    npm run test:coverage
```

### End-to-End Tests (Cypress)

#### Run E2E Tests

From the `front` folder:

** Important: The frontend must be running before launching E2E tests**

```bash
    # Interactive mode (opens Cypress interface)
    npm run cypress:open
    
    # Headless mode (command line)
    npm run e2e:ci
```

---

## Coverage Reports

### Back-end Coverage (JaCoCo)

#### Generate the Report

From the `back` folder:

```bash
  mvn clean test
```

The JaCoCo report is automatically generated after running the tests.

#### View the Report

The HTML report is located at:

```
back/target/site/jacoco/index.html
```

Open this file in your browser:

**Windows:**

```bash
  start target/site/jacoco/index.html
```

**Mac/Linux:**

```bash
  open target/site/jacoco/index.html
```

### Front-end Coverage (Jest)

#### Generate the Report

From the `front` folder:

```bash
  npm run test:coverage
```

#### View the Report

The HTML report is located at:

```
front/coverage/jest/lcov-report/index.html
```

Open this file in your browser:

**Windows:**

```bash
  start coverage/jest/lcov-report/index.html
```

**Mac/Linux:**

```bash
  open coverage/jest/lcov-report/index.html
```

### End-to-End Coverage (Cypress + NYC)

#### Generate the Report

From the `front` folder:

```bash
    npm run e2e:ci
```

#### View the Report

The HTML report is located at:

```
front/coverage/lcov-report/index.html
```

Open this file in your browser:

**Windows:**

```bash
  start coverage/lcov-report/index.html
```

**Mac/Linux:**

```bash
  open coverage/lcov-report/index.html
```

---

## Troubleshooting

### Database Connection Issues

If you get a MySQL connection error:

1. Verify that MySQL is running
2. Check credentials in `back/src/main/resources/application.properties`
3. Verify that the `yoga` database exists

### Port 8080 Already in Use

If port 8080 is already occupied, you can change it in `back/src/main/resources/application.properties`:

```properties
    server.port=8081
```

Don't forget to update the URL in the front-end (`front/src/proxy.config.json`).

### npm install Errors

If you encounter errors during npm dependencies installation:

```bash
# Remove node_modules folder and package-lock.json
rm -rf node_modules package-lock.json

# Clean npm cache
npm cache clean --force

# Reinstall dependencies
npm install
```

### E2E Tests Failing

1. Make sure the frontend is running on http://localhost:8080
2. Clear Cypress cache: `npx cypress cache clear`


