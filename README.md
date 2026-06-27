# TechSupport Platform

TechSupport Platform is a full-stack computer maintenance and technical support solution that consolidates front-end and back-end services in a single repository.

## Project Overview

This repository contains:
- `frontend/` — React-based user interface for customer support, community interaction, service booking, and technician workflows.
- `backend/` — Node.js/Express API server for authentication, community posts, online support sessions, specialist management, product scraping, Windows error handling, file uploads, and email notifications.

## Key Features

- User authentication and profile management
- Community discussion and post management
- Remote help session scheduling and specialist support
- Repair shop and product scraping services
- Windows error tracking and troubleshooting resources
- Image and video upload support
- Admin and technician dashboards

## Local Setup

1. Navigate to the backend and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Navigate to the frontend and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

3. Create any required local configuration files (not included in the repository):
   - `backend/.env`
   - `backend/cloudinaryInfo.txt`
   - `backend/config/firebaseServiceAccount.json`
   - TLS certificates under `backend/certs/`
   - Uploaded files under `backend/uploads/`

4. Start backend and frontend services separately according to each package's startup scripts.

## Notes

Sensitive or environment-specific files are intentionally excluded from version control. The following paths are ignored in this repository:
- `backend/certs/`
- `backend/config/`
- `backend/node_modules/`
- `backend/uploads/`
- `backend/.env`
- `backend/cloudinaryInfo.txt`

## Repository Structure

- `backend/` — API server and data handling
- `frontend/` — client application

## Contribution

Follow standard Git workflow and preserve commit history when updating both frontend and backend code. Keep sensitive configuration files local and out of source control.
