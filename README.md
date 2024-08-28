Kettl Commerce API
==================

Kettl Commerce is a scalable, modular e-commerce API built using the Nest.js framework with a microservices architecture. This API is designed to handle various aspects of an e-commerce platform, including product management, order processing, user authentication, and notifications. The project leverages Docker for environment setup, MongoDB for product and user data, MariaDB for order data, Redis for caching, and the ELK stack for logging and monitoring.

Table of Contents
-----------------

-   [Project Overview](#project-overview)
-   [Features](#features)
-   [Technology Stack](#technology-stack)
-   [Architecture](#architecture)
-   [Setup & Installation](#setup--installation)
    -   [Prerequisites](#prerequisites)
    -   [Environment Variables](#environment-variables)
    -   [Installation](#installation)
-   [Running the Project](#running-the-project)
    -   [Using Docker](#using-docker)
    -   [Without Docker](#without-docker)
-   [API Documentation](#api-documentation)
-   [Testing](#testing)
-   [Contributing](#contributing)
-   [License](#license)

Project Overview
----------------

Kettl Commerce API is a robust and flexible backend solution for e-commerce platforms. It is designed to manage products, orders, user authentication, and notifications. The project is built on a microservices architecture using Nest.js, allowing each service to be developed, deployed, and scaled independently.

Features
--------

-   **Microservices Architecture**: Separate services for product management, order processing, user authentication, and notifications.
-   **Event-Driven Communication**: Services communicate asynchronously using Nest.js Event Pattern.
-   **Dockerized Environment**: Entire project is containerized using Docker and Docker Compose for easy setup and scaling.
-   **Database Management**:
    -   MongoDB for managing products and users.
    -   MariaDB for order processing.
    -   Redis for caching.
-   **Logging & Monitoring**: Integrated ELK stack (Elasticsearch, Logstash, Kibana) for log aggregation, monitoring, and visualization.
-   **Unit Testing**: Comprehensive unit tests for services and modules using Jest.
-   **Swagger Documentation**: API documentation generated using Swagger.

Technology Stack
----------------

-   **Framework**: [Nest.js](https://nestjs.com/)
-   **Databases**:
    -   [MongoDB](https://www.mongodb.com/)
    -   [MariaDB](https://mariadb.org/)
    -   [Redis](https://redis.io/)
-   **Containers**: [Docker](https://www.docker.com/)
-   **Logging & Monitoring**: [ELK Stack](https://www.elastic.co/what-is/elk-stack) (Elasticsearch, Logstash, Kibana)
-   **Testing**: [Jest](https://jestjs.io/)
-   **Documentation**: [Swagger](https://swagger.io/)

Architecture
------------

Kettl Commerce API is based on a microservices architecture with the following services:

1.  **Product Service**: Manages products, including CRUD operations and dynamic pricing.
2.  **Order Service**: Handles order processing, status updates, and order tracking.
3.  **Users & Auth Service**: Manages user registration, authentication, and profile management.
4.  **Notification Service**: Sends notifications based on various triggers like order confirmations and password resets.

Each service is containerized using Docker, and they communicate asynchronously using the Nest.js Event Pattern.

Setup & Installation
--------------------

### Prerequisites

-   Docker and Docker Compose installed on your machine.
-   [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
-   [Git](https://git-scm.com/) installed.

### Environment Variables

Each microservice requires a `.env` file with specific configurations. Here's a summary of the environment variables needed:

#### General

-   `NODE_ENV=development`
-   `JWT_SECRET=your_jwt_secret`
-   `JWT_EXPIRATION=3600`

#### MongoDB (Product & User Services)

-   `MONGODB_URI=mongodb://mongo:27017/kettl-commerce`

#### MariaDB (Order Service)

-   `MARIADB_HOST=mariadb`
-   `MARIADB_PORT=3306`
-   `MARIADB_USER=admin`
-   `MARIADB_PASSWORD=kettl-commerce-2202`
-   `MARIADB_DB=order-service`

#### Redis

-   `REDIS_HOST=redis`
-   `REDIS_PORT=6379`

#### ELK Stack

-   `ELASTICSEARCH_URL=http://elasticsearch:9200`

You can generate the necessary `.env` files from the `.env.example` added to each service.

### Installation

1.  **Clone the repository**:

    bash

    Copy code

    `git clone https://github.com/your-username/kettl-commerce.git
    cd kettl-commerce`

2.  **Install dependencies**:

    bash

    Copy code

    `npm install`

3.  **Set up environment variables**:

    -   Create `.env` files for each service based on the provided `.env.example` in each service root folder.

Running the Project
-------------------

### Using Docker

1.  **Build and start the containers**:

    bash

    Copy code

    `docker-compose up --build`

2.  **Access the services**:

    -   **Product Service**: `http://localhost:3001`
    -   **Order Service**: `http://localhost:3005`
    -   **Auth Service**: `http://localhost:3002`
    -   **Notification Service**: `http://localhost:3003`
    -   **ElasticSearch Index**: `http://localhost:9200/kettl-commerce-*/_search?pretty`
    -   **Kibana Dashboard**: `http://localhost:5601`

### Without Docker

1.  **Start MongoDB** and **MariaDB** on your local machine.
2.  **Run each service** individually:

    bash

    Copy code

    `npm run start:dev product-service
    npm run start:dev order-service
    npm run start:dev auth-service
    npm run start:dev notification-service`

API Documentation
-----------------

The API documentation is generated using Swagger. Once the services are running, you can access the Swagger documentation at the following URLs:

-   **Product Service**: `http://localhost:3001/product-service-docs`
-   **Order Service**: `http://localhost:3005/order-service-docs`
-   **Auth Service**: `http://localhost:3002/auth-service-docs`
-   **Notification Service**: `No documentation for Notification service`

Testing
-------

To run the unit tests for the services, use the following command:

bash

Copy code

`npm run test`

The tests are designed to cover all core functionalities, ensuring the reliability of each microservice.

Contributing
------------

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

License
-------

This project is licensed under the MIT License.
