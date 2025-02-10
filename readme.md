
## Gatherly

 - Gatherly is an Event management web app developed using MERN stack.
 - Allows event creation and management tools, attendees list with real time updates.
  
  ## Tech stacks
  - Node.js
  -	Express
  - React JS
  - Context API
  - WebSocket
  - MongoDB

# Project Setup

### **Step 1: Clone the Repository**

Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/PrashantShukla7/Gatherly.git
```
## Backend setup

  ```bash 
  cd backend
  ```

### **Step 1: Install Dependencies**

Run the following command to install dependencies:

```bash
npm install
```
### **Step 2: Set Up the Environment File**

Create a copy of the `.env.example` file and rename it to `.env`:
```bash
MONGODB_URI = "your-mongodb-uri"
JWT_SECRET = "your-jwt-secret"
FRONTEND_URL = "your-frontend-url"
```


### **Step 3: Start the Development Server**

```bash
npm run dev
```

## Frontend setup
```bash
cd client
```

### **Step 1: Install Dependencies**

Run the following command to install dependencies:

```bash
npm install
```

### **Step 2: Set Up the Environment File**

Create a copy of the `.env.example` file and rename it to `.env`:
```bash
VITE_BACKEND_URL = "Your backend url"
VITE_CLOUDINARY_CLOUD_NAME = "Your cloudinary cloud name"
```
### **Step 3: Run Frontend**


```bash
npm run dev
```

