# Blog API with CRUD Operations in nodejs

  

## Description

  

This is a RESTful Blog API built with **Node.js**, **Express**, and **MongoDB**. The application allows users to register, log in, and manage blog posts. Each post can be created, read, updated, and deleted. It supports JWT (JSON Web Token) authentication and middleware to protect routes that require user authorization.

  

The API follows RESTful conventions for handling requests and responses, providing a simple interface for interacting with blog posts.

  

## Features

  

-  **User Authentication**:

- User registration (email, username, and password).

- User login with JWT-based authentication.

- Secure routes for creating, updating, and deleting posts.

-  **CRUD Operations for Blog Posts**:

- Create a new blog post.

- Read all blog posts or a specific post.

- Update a blog post (only accessible to the post author).

- Delete a blog post (only accessible to the post author).

  

-  **Authorization**:

- JWT authentication to secure API routes.

- Users can only update or delete their own posts.

  

## Tech Stack

  

-  **Backend**: Node.js, Express

-  **Database**: MongoDB (with Mongoose)

-  **Authentication**: JWT (JSON Web Token)

-  **Password Hashing**: bcryptjs

-  **Environment Variables**: dotenv

-  **Testing**: Postman for API testing

  

## API Endpoints

  

### Authentication Routes

  

-  `POST /api/auth/register`: Registers a new user.

-  `POST /api/auth/login`: Logs in an existing user and returns a JWT.

  

### Post Routes (Requires Authentication)

  

-  `GET /api/posts`: Get a list of all blog posts.

-  `POST /api/posts`: Create a new blog post .

-  `GET /api/posts/:slug`: Get a single blog post by slug.

-  `PUT /api/posts/:id`: Update a blog post .

-  `DELETE /api/posts/:id`: Delete a blog post .

  

## Setup

  

### Prerequisites

  

- Node.js and npm installed.

- MongoDB installed locally or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

  

### Steps to Run the Project

  

1.  **Clone the Repository**:

```bash
git clone https://github.com/MoatazMadi/nodejs-blog-api.git
cd nodejs-blog-api
 ```

2.  **Install Dependencies**:
```bash
npm install
 ```  

3.  **Set Up Environment Variables**: create new .env file 
```bash
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=your_port
 ```

4.  **Run the Application**:
```bash
npm run start  
```