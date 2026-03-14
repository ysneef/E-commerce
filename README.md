# E-Commerce Web Application

## Introduction

This project is a full-stack E-commerce Web Application that allows users to browse products, manage shopping carts, place orders, and manage accounts.

The system also includes an Admin Dashboard for managing products, users, and orders.

The project is built using modern web technologies and follows a monorepo architecture with Turborepo.

---

## Technologies Used

### Frontend

* React
* TypeScript
* TailwindCSS
* Vite
* Redux Toolkit

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication

### Tools

* Turborepo
* Git & GitHub
* RESTful API

---

## Project Structure

```
E-commerce
│
├── apps
│   ├── web          # Client website for customers
│   ├── admin        # Admin dashboard
│   └── api          # Backend server (NodeJS + Express)
│
├── packages
│   └── ui           # Shared UI components
│
├── turbo.json
├── package.json
└── README.md
```

---

## Main Features

### User Features

* User registration and login
* Browse products
* Product detail page
* Add products to cart
* Place orders
* View order history
* Update profile

### Admin Features

* Manage products
* Manage users
* Manage orders
* View system statistics

---

## Installation

### 1. Clone the repository

```
git clone https://github.com/ysneef/E-commerce.git
```

### 2. Navigate to the project

```
cd E-commerce
```

### 3. Install dependencies

```
npm install
```

### 4. Run the development server

```
npm run dev
```

---

## Environment Variables

Create a `.env` file on apps/api:

```
PORT=3001
CONNECTION_STRING=mongodb+srv://<username>:<password>@cluster.mongodb.net/
DB_DATABASE=shoppingonline
```
Ensure you have MongoDB installed and running on your computer, and update the connection URL in the apps\api\utils\MyConstants.js file.

```
const MyConstants = {
  DB_SERVER: process.env.DB_SERVER,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_DATABASE: process.env.DB_DATABASE,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES: process.env.JWT_EXPIRES,

  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS
};

export default MyConstants;
```

---

## Screenshots

(Add screenshots of your website here)

Example:

* Home Page
* Product Page
* Cart Page
* Admin Dashboard

---

## Future Improvements

* Online payment integration
* Product search and filtering
* Product reviews and ratings
* Order tracking
* Performance optimization

---

## Author

Student Project – Web Development Course

---

## License

This project is for educational purposes.
