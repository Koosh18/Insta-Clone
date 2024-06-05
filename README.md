# Insta-Clone


Insta-Clone is a simple web application that mimics some functionalities of Instagram. This application is built with Node.js, Express, MongoDB, and JSON Web Tokens for authentication.

## Features

- User Signup
- User Signin
- Liking , Posting and Commenting on Posts
- Follow features
- Search User Feature

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose)
- bcryptjs (for password hashing)
- jsonwebtoken (for token-based authentication)
- dotenv (for environment variable management)

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/insta-clone.git
    cd insta-clone
    ```

2. Install the dependencies:

    ```bash
    cd server
    npm install
    ```

3. Create a `.env` file in the root directory and add your configuration settings. You can use `example.env` as a reference:

    ```bash
    cp example.env .env
    ```

    Edit the `.env` file with your MongoDB connection string and JWT secret key:

    ```env
    MONGO="mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/yourdbname?retryWrites=true&w=majority"
    JWT_SECRET="your_jwt_secret_key"
    PORT=5000
    ```

4. Start the server:

    ```bash
    node app
    ```

    The server will run on the port specified in your `.env` file (default is 5000).

4. Start the front end :

    ```bash
    cd my-app
    npm start app
    ```


 

### Project Structure

```plaintext
insta-clone/
├── model/
│   ├── post.js
│   └── user.js
├── middleware/
│   └── requirelogin.js
├── routes/
│   ├── auth.js
│   ├── post.js
│   └── user.js
├── .gitignore
├── example.env
├── index.js
├── package.json
└── README.md
