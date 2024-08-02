# Blog App

A blogging platform for people to use for educational and entertainment purposes. built with Node.js, Express.js, PostgreSQL, and Sequelize ORM.

## Table of Contents

- [Description](#description)
- [Project Structure](#project-structure)
- [Database Setup](#database-setup)
- [Running Migrations and Seeders](#running-migrations-and-seeders)
- [API Endpoints](#api-endpoints)
- [Generic License Statement](#generic-license-statement)

## Description

Blog App is a platform where users can create, edit, and delete posts. They can also comment on posts and manage their profiles. The backend is built using Node.js, Express.js for handling routes, PostgreSQL for the database, and Sequelize as the ORM.

## Project Structure

```

root
|
├── controllers
|   ├─ postController.js
|   ├─ userController.js
|   └─ commentController.js
|
├── services
│   ├─ commentServices.js
│   ├─ postServices.js
│   └─ userServices.js
|
├── routes
|   ├─ index.js
│   ├─ commentRoutes.js
│   ├─ postRoutes.js
│   └─ userRoutes.js
|
├── models
│   ├─ comment.js
│   ├─ post.js
│   ├─ category.js
│   ├─ user.js
│   └─ index.js
|
├── migrations
│   ├─ 20240728132355-create-user.js
│   ├─ 20240730100923-addColumnsUser.js
│   ├─ 20240730114446-create-category.js
│   ├─ 20240731042938-create-post.js
│   ├─ 20240731114359-create-comment.js
│   ├─ 20240801100523-foreignKey.js
│   ├─ 20240801101105-fk-comment.js
│   └─ 20240801101717-fk-parentComment.js
|
├── seeders
│   └─ 20240730115604-insertCategory.js
|
├── utils
│   ├─ constants
|   |  └─ constants.js
|   |
│   └─ helpers
|   |  ├─ bcryptHelper.js
|   |  ├─ jwtHelper.js
|   |  └─ getResponse.js
|   |
│   └─ validations
|   |  ├─ commentValidations.js
|   |  ├─ postValidations.js
|   └  └─ userValidations.js
|
├── middleware
│   ├─ userAuth.js
│   └─ validation.js
|
├── logger
│   └─ logger.js
|
├── nodemailer
│   └─ mailing.js
|
├── logs
│   └─ app.log
|
├── config
│   ├─ config.js
│   ├─ database.js
│   └─ index.js
|
├── README.md
├── package.json
├── env
└── app.js


```

## Database Setup

Ensure you have PostgreSQL installed and running. Create a database for the project.

## Running Migrations and Seeders

To manage the database schema and seed data, use the following Sequelize CLI commands:

1. **Run Migrations:**

```

npx sequelize-cli db:migrate

```

2. **Undo Migrations:**

```

npx sequelize-cli db:migrate:undo

```

3. **Generate a New Model:**

```

npx sequelize-cli model:generate --name ModelName --attributes attribute1:type,attribute2:type

```

4. **Generate a New Migration:**

```

npx sequelize-cli migration:generate --name migration_name

```

5. **Generate Seed Files:**

```

npx sequelize-cli seed:generate --name seed_name

```

6. **Run Seed Files:**

```

npx sequelize-cli db:seed:all

```

7. **Undo Seed Files:**

```

npx sequelize-cli db:seed:undo:all

```

## API Endpoints

### Users

- **GET /users**: Get user
- **GET /users/logout**: Logout user
- **GET /users/verify-email/:id/:token**: Verify Email
- **POST /users/refresh-token**: Refresh Token
- **POST /users/signup**: SignUp user
- **POST /users/login**: Login user
- **POST /users/forgot-password**: Forgot Password
- **POST /users/reset-password/:id/:token**: Reset Password
- **POST /users/change-password**: Change Password
- **PUT /users**: Update user
- **DELETE /users**: Delete user

### Posts

- **GET /posts**: Get all posts
- **GET /posts/my-posts**: Get my posts
- **GET /posts/search**: Search All posts
- **GET /posts/search-my-posts**: Search My posts
- **POST /posts**: Create a new post
- **PUT /posts/:postId**: Update post by ID
- **DELETE /posts/postId**: Delete post by ID

### Comments

- **GET /comments/:postId**: Get all comments of a post
- **GET /comments/:postId/:parentCommentId**: Get all replies of a comment
- **POST /comments/:postId**: Create a new comment on a post
- **PUT /comments/:postId/:id**: Update comment by ID
- **DELETE /comments/:postId/:id**: Delete comment by ID

## Generic License Statement

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). You are free to use, modify, and distribute this software as long as the original authors are credited.

---

```

```
