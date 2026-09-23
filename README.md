# Church Group Management System — Frontend

## Overview

This repository contains the frontend application for a **Church Group Management System** built with React and TypeScript.

The application provides a web interface for Staff and Group Leaders to manage church groups and their members. It communicates with a separate Django REST Framework backend through REST API requests.

The frontend is hosted and deployed using **Vercel**.

---

## Features

* User login and authentication
* Role-based user interface for Staff and Group Leaders
* Group management
* Member profile management
* Viewing and managing group memberships
* Communication with the Django REST Framework API
* Responsive web interface
* Client-side form handling and validation
* Protected pages based on authentication and user permissions

---

## Tech Stack

* **React**
* **TypeScript**
* **Vite** — development/build tooling
* **npm** — package management
* **Django REST Framework** — backend API
* **Vercel** — frontend hosting and deployment

---


## Prerequisites

Before running the frontend locally, make sure the following are installed:

* **Node.js**
* **npm**
* **Git**

You can verify your installations with:

```bash
node --version
npm --version
git --version
```

---

## Installation

### 1. Clone the Repository

```bash
git clone <FRONTEND_REPOSITORY_URL>
cd <FRONTEND_DIRECTORY>
```

### 2. Install Dependencies

Install the project's dependencies using:

```bash
npm install
```

This installs the packages listed in `package.json`.

## Running the Development Server

Start the frontend development server with:

```bash
npm run dev
```

Vite will provide a local development URL, typically:

```text
http://localhost:5173
```

The exact URL and port may vary depending on the project's Vite configuration.

---

## Application Flow

The frontend communicates with the Django REST Framework backend through REST API requests.

The general flow is:

```text
┌────────────────────────┐
│   React + TypeScript   │
│        Frontend        │
└───────────┬────────────┘
            │
            │ HTTP / REST API
            ▼
┌────────────────────────┐
│   Django REST          │
│   Framework Backend     │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│       Database         │
└────────────────────────┘
```

When a user performs an action in the application, the frontend sends the appropriate API request to the backend. The backend processes the request and returns a response, which the frontend uses to update the interface.

---

## Authentication

The application uses authentication provided by the Django REST Framework backend.

The general authentication flow is:

```text
User
 │
 ▼
Login Page
 │
 ▼
Frontend sends credentials
 │
 ▼
Django REST API
 │
 ▼
Authentication token
 │
 ▼
Frontend stores authentication state
 │
 ▼
Authenticated API requests
```

Protected pages and functionality are restricted based on the authenticated user's role and permissions.

The application supports the following primary roles:

### Staff

Staff members have administrative access to the system.

They can manage:

* User accounts
* Groups
* Member profiles
* Other administrative information

### Group Leaders

Group Leaders have access to the groups they are assigned to.

They can:

* View their assigned groups
* Manage members within their groups
* Create member profiles
* Perform actions allowed by their permissions

---

## API Integration

The frontend communicates with the backend using REST API endpoints.

The backend repository is maintained separately:

```text
<BACKEND_REPOSITORY_URL>
```

The API base URL is configured through an environment variable so that the frontend can communicate with different backend environments.

For example:

```text
Development
Frontend → Local Django API

Production
Frontend → Deployed Django API
```

---

## Deployment

The frontend is deployed using **Vercel**.

The production deployment is connected to this repository so that changes pushed to the repository can be built and deployed through Vercel.

### Production Environment Variables

Environment variables required by the frontend should also be configured in the Vercel project settings.

For example:

```text
VITE_API_URL=<DEPLOYED_BACKEND_URL>
```

The production API URL should point to the deployed Django REST Framework backend.

---

## Building for Production

To create a production build locally:

```bash
npm run build
```

The generated build can be previewed locally using:

```bash
npm run preview
```

The exact build behavior depends on the project's Vite configuration.

---

## Development Workflow

A typical development workflow is:

```text
1. Clone the repository
        ↓
2. Install dependencies
        ↓
3. Configure environment variables
        ↓
4. Start the Django backend
        ↓
5. Start the React development server
        ↓
6. Develop and test frontend features
        ↓
7. Build the application
        ↓
8. Push changes to Git
        ↓
9. Vercel deploys the updated frontend
```

---

## Testing

If automated tests are implemented, run them using the project's configured test command.

For example:

```bash
npm test
```

---

## Related Repository

### Backend

The backend is maintained in a separate repository and provides the REST API consumed by this frontend.

```text
<BACKEND_REPOSITORY_URL>
```

The backend is built with Django REST Framework.

---

