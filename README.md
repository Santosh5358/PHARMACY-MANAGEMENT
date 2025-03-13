# Pharmacy Management System

This is a **Pharmacy Management System** built using **React.js** for the frontend and **Express.js** for the backend with **MongoDB** as the database. The system allows users to manage medicines, make purchases, view previous orders, and manage their profile information, including updating passwords and phone numbers. 

The project enables both **admin** users (for adding, editing, and removing medicines) and **regular users** (for browsing, purchasing medicines, and managing their profile).

**Live Website:** [https://delicate-pithivier-c8ee9e.netlify.app/](https://delicate-pithivier-c8ee9e.netlify.app/)

## Table of Contents
- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)
- [Contributing](#contributing)
- [License](#license)

## Project Description

This project provides an online **Pharmacy Management System** that allows:

- **Admins** to manage the list of medicines (add, remove, and edit).
- **Users** to:
  - Browse available medicines.
  - Purchase medicines.
  - View their previous orders and invoices.
  - Update personal details like password and phone number.

It allows users to interact with the system through a modern web interface, and also provides a backend API to handle authentication, CRUD operations for medicines, and user data management.

## Features

- **Admin Features**:
  - Add, edit, and remove medicines.
  - Manage inventory.
  
- **User Features**:
  - Register and login to the system.
  - Browse available medicines with details (e.g., name, description, price).
  - Make purchases and view previous orders.
  - View invoices for completed orders.
  - Update profile information, including phone number and password.
  
- **Invoice Generation**:
  - Users can download or view invoices for their past orders.

## Technologies Used

- **Frontend**:
  - **React.js**: For building a dynamic user interface.
  - **React Router**: For handling navigation between different pages.
  
- **Backend**:
  - **Express.js**: A web framework for Node.js to handle HTTP requests.
  
- **Database**:
  - **MongoDB**: For storing user data, medicine details, orders, and invoices.
  
- **Others**:
  - **Node.js**: For running the backend server.
  - **Axios**: For making HTTP requests from React to the backend.
  
## Setup Instructions

To run this project locally, follow these steps:

### Prerequisites

Ensure that you have the following installed on your machine:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **MongoDB**: [Install MongoDB](https://www.mongodb.com/try/download/community) or use a cloud-based database service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Steps to Set Up

1. **Clone the Repository**:

   Clone the project to your local machine:

   ```bash
   git clone https://github.com/Santosh5358/PHARMACY-MANAGEMENT.git

   Frontend Setup (React.js):

2.  Navigate to the frontend directory:

bash
Copy
cd PHARMACY-MANAGEMENT/frontend
Install the required frontend dependencies:

bash
Copy
npm install

3. Backend Setup (Express.js):

Now, navigate to the backend directory:

bash
Copy
cd ../backend
Install the backend dependencies:

bash
Copy
npm install

4.  Configure Environment Variables:

You may need to set up the following environment variables for both frontend and backend:

Frontend:
If needed, create a .env file in the frontend directory and add the API base URL for your backend.
Backend:
Create a .env file in the backend directory with the following configuration:

ini
Copy
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
PORT=5000
Replace your-mongodb-uri with your MongoDB connection string (if using MongoDB Atlas, get it from the MongoDB Atlas dashboard).

5.  Start the Backend Server:

Navigate to the backend folder and run:

bash
Copy
npm start
This will start the server on the specified port (default is 5000).

6. Start the Frontend React App:

Go back to the frontend folder and run:

bash
Copy
npm start
This will start the React application on http://localhost:3000.

Running the Project
Once both the frontend and backend are set up and running, you can access the Pharmacy Management System on your local machine by navigating to http://localhost:3000.

You should be able to:

Register and login as a user.
View available medicines, make purchases, and see your order history.
Admin users can add, edit, or remove medicines.
Live Website
You can access the live version of this Pharmacy Management System by visiting the following URL:

Live Website: https://delicate-pithivier-c8ee9e.netlify.app/
