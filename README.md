# MERN-Stack-Coding-Challenge
Creating  API to initialize the database then fetching  the JSON from third party API and initializing the database with seed data

# MERN Transactions Dashboard

This project is a full-stack web application built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js). It provides a dashboard to display transaction data, statistics, and a bar chart for user-selected months.

## Features
- **Transactions Table**: Lists transactions based on the selected month.
- **Search Functionality**: Search transactions by title, description, or price.
- **Pagination**: Load the next or previous set of transactions using pagination.
- **Statistics Section**: Displays total sales, sold items, and unsold items.
- **Bar Chart**: Displays a bar chart showing price ranges of transactions for the selected month.

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- npm (comes with Node.js)

---

## Getting Started

### Prerequisites
- Node.js (>=14.x)
- MongoDB (Local/Atlas)
- React (>=17.x)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/mern-transactions-dashboard.git
    cd mern-transactions-dashboard
    ```

2. Install dependencies for both backend and frontend:
    ```bash
    npm install
    ```

3. Set up your MongoDB URI and other environment variables in `.env`.

4. Run the backend:
    ```bash
    npm start
    ```

5. Run the frontend:
    ```bash
    cd mern-frontend
    npm start
    ```

## Postman API Usage

To test the APIs, you can use Postman. Below are the API endpoints and how to make requests.

### 1. Fetch and Seed Data

**Endpoint**: `/initialize`  
**Method**: `GET`  
**Description**: Fetch data from a third-party API and seed the MongoDB database.

**Postman Command**:
```bash
GET http://localhost:3000/initialize
```
### 2. List Transactions

**Endpoint**: `/initialize`  
**Method**: `GET`  
**Description**: Fetch data from a third-party API and seed the MongoDB database.

**Postman Command**:
```bash
GET http://localhost:3000/initialize
```
### 3. Fetch and Seed Data

**Endpoint**: `/transactions`  
**Method**: `GET`  
**Description**: Fetch a paginated list of transactions for the selected month.

**Postman Command**:
```bash
GET http://localhost:3000/transactions?page=1&perPage=10&search=yourSearchTerm
```
### 4.  Get Statistics


**Endpoint**: `/statistics`  
**Method**: `GET`  
**Description**: Retrieve total sales amount, total sold items, and total unsold items for the selected month.

**Postman Command**:
```bash
GET http://localhost:3000/statistics?month=March
```
### 5. Price Chart Data

**Endpoint**: `/price-chart`  
**Method**: `GET`  
**Description**: Fetch data for the bar chart displaying price ranges and the number of items sold for the selected month.

**Postman Command**:
```bash
GET http://localhost:3000/price-chart?month=March

```
### 6. Category Chart Data

**Endpoint**: `/category-chart`  
**Method**: `GET`  
**Description**: Fetch data for the pie chart showing the distribution of categories for the selected month.


**Postman Command**:
```bash
GET http://localhost:3000/category-chart?month=March

```
### 7. Combined Data

**Endpoint**: `/combined`  
**Method**: `GET`  
**Description**: Fetch combined statistics, bar chart, and pie chart data for the selected month.


**Postman Command**:
```bash
GET http://localhost:3000/combined?month=March

```
