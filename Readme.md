# Chatify

**Chatify** is a minimalist and modern chat application designed to facilitate real-time communication among users. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and enhanced with WebSocket support for live updates, Chatify provides an intuitive and engaging chat experience.

## Features

- **User Authentication:** Secure login and signup features using JWT.
- **Real-time Messaging:** Seamless real-time communication with WebSocket integration.
- **Room Management:** Create, join, and manage chat rooms with ease.
- **Message History:** Persistent chat history with support for viewing past messages.

## Installation

To get started with Chatify, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/Chatify.git
    ```
2. **Navigate to the Project Directory**

    ```bash
    cd Chatify
    ```
3. **Install the Required Packages**

    For the backend:
    ```bash
    cd server
    npm install
    ```

    For the frontend:
    ```bash
    cd client
    npm install
    ```

4. **Set Up the Environment Variables**
    
    Create a `.env` file in the `server` directory and add the following environment variables:
    
    ```env
    PORT=3000
    DATABASE_URL=your_mongodb_url
    ACCESS_TOKEN_SECRET=your_jwt_secret
    ```

5. **Start the Development Server**

    For the backend:
    ```bash
    npm start
    ```

    For the frontend:
    ```bash
    npm run dev
    ```

6. **Access the Application**

    Open `http://localhost:3000` in your browser to access Chatify.

