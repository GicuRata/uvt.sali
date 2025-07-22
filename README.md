# User Guide for the **uvt.sali** Application

> **Version:** 1.0  
> **Publication Date:** January 13, 2025

**Authors:**  
- Gicu Rata, Alexandru Culicov, Mihail Crivoi  

---

## Abstract

This document describes the steps for installation, configuration, and usage of a web application built using the MERN stack (MongoDB, Express.js, React, Node.js). The application allows room reservations and includes features for authentication, user management, and reservation administration.

---

## Table of Contents

1. [Introduction](#introduction)  
2. [Installation and Configuration](#installation-and-configuration)  
3. [Usage](#usage)  
   1. [User Flow](#user-flow)  
   2. [Admin Flow](#admin-flow)  
4. [Key Features](#key-features)  
5. [Technical Guide (for Developers)](#technical-guide-for-developers)  

---

## Introduction

The **uvt.sali** application for room management and reservations provides both registered users and guests the ability to request and manage room bookings. Administrators can approve/decline requests, add new rooms, and manage all reservations. This section describes the purpose of the application and its main components.

---

## Installation and Configuration

### System Requirements

- Node.js >= v22.11.0
- Remote MongoDB database
- NPM >= 10.9.0
- React >= 18.3.1

### Installation Steps

1. **Download the source code** from the Git repository.
2. **Install the dependencies:**

    ```bash
    # In the terminal, run (from the root folder):
    npm run build
    ```

3. **Configure environment variables** in a `.env` file:

    ```plaintext
    PORT=<port_number>
    MONGO_URI=<mongo_connection_string>
    JWT_SECRET=<jwt_secret_key>
    ADMIN_SECRET=<admin_secret_key>
    EMAIL_USER=<email_user>
    EMAIL_PASS=<email_password>
    ```

4. **Start the application:**

    ```bash
    npm run prod
    ```

    This script runs both the server and client.

---

## Usage

The application offers a dashboard for both users and administrators, as well as a public page for guest reservations.

### User Flow

1. **Register:** Users can create an account using their name, email, and password.
2. **Login:** Users log in with their email and password.
3. **Dashboard:** Once logged in, the user sees a list of available rooms, can book a room, and review their current bookings.
4. **Book Room:** To book a room, the user selects "Book Room", enters the desired date/time, and chooses an available room.
5. **View Bookings:** The "My Bookings" page displays the user's current reservations.

### Admin Flow

1. **Create Admin Account:** This is done through a special endpoint (`/api/auth/create-admin`, accessible only by an admin) that utilizes `ADMIN_SECRET`.
2. **Add Rooms:** In the "Add Room" section, the admin enters the room name, location, capacity, equipment, etc.
3. **Edit/Delete Rooms:** The admin can modify or delete existing rooms.
4. **Manage Reservations:** The admin can view all reservations, approve, decline, or cancel them. This section also includes guest reservations.
5. **Generate QR Code for Guests:** The application allows the generation of a QR code for the guest booking page (e.g., `/guest-book-room`).

---

## Key Features

- **Authentication and Authorization (JWT):** Protect resources based on JWT tokens.
- **Room Management:** Add, edit, delete, and list rooms.
- **User Reservations:** Request, list, and cancel reservations.
- **Guest Reservations:** Request reservations without an account (approval required).
- **Email Notifications (for guests):** Send emails for reservation confirmations/declines.

---

## Technical Guide (for Developers)

This section provides details for programmers or those who wish to extend the existing functionalities.

### Project Structure (Backend)

- **models** – Contains Mongoose schemas (e.g., `user.model.js`, `booking.model.js`, etc.)
- **routes** – Defines REST routes for authentication, bookings, guest-booking, rooms, etc.
- **controllers** – Business logic for each operation (e.g., `booking.controller.js`)
- **config** – Configuration files (e.g., `db.js` for MongoDB, `.env` for environment variables)
- **server.js** – The main file that starts the Express.js application

### Project Structure (Frontend - React)

- **src/pages** – Page components (e.g., `Login.jsx`, `Dashboard.jsx`, `MyBookings.jsx`)
- **src/components** – Reusable components (e.g., `ProtectedRoute.jsx`, `AdminRoute.jsx`)
- **src/context** – Global context for authentication (e.g., `auth.context.jsx`)
- **src/styles** – Style files (CSS/SASS)
- **App.jsx** – Main configuration of routes using React Router

---

&copy; 2025 Development Team. All rights reserved.  
*This guide may be updated periodically. Visit the official repository for the latest version.*
