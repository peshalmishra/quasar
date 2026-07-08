# Quasar

Quasar is a full-stack productivity workspace for creating projects, organizing tasks, and writing rich-text documents in a polished single-page experience. The application combines a React + Vite frontend with a Node.js + Express backend and a MongoDB data layer, and it can be run locally with Docker Compose or deployed to Kubernetes.

## Overview

This project is designed around three core workflows:

1. User authentication and account management
2. Project and task tracking with status-based workflows
3. Rich-text document editing with auto-save and export support

The UI is centered around a modern dashboard experience with animated cards, a task board, and a document editor powered by TipTap.

## Key Features

- Secure signup/login with JWT-based authentication
- Project creation, editing, deletion, and membership management
- Task creation and status updates for todo, in progress, and done states
- Dashboard analytics for project and task progress
- Rich text editor with headings, lists, links, highlights, images, and task lists
- Auto-save for document content
- PDF export for documents
- Dockerized frontend, backend, and MongoDB stack
- Kubernetes deployment manifests for local cluster environments

## Architecture

### Frontend

The frontend is a React single-page application built with Vite and React Router. It uses:

- React 18 for component-based UI
- React Router for navigation between auth, dashboard, task board, and editor views
- Framer Motion for animated transitions
- Bootstrap and custom CSS for styling
- Lucide icons for UI visuals
- Axios for API communication
- TipTap for the document editor experience
- html2pdf.js for PDF export

### Backend

The backend is a REST-style API implemented with Express and MongoDB. It provides endpoints for:

- User registration and login
- Project CRUD and member assignment
- Task CRUD, status updates, and attachments
- Project detail and task retrieval operations

Authentication is enforced with JWT middleware via the backend auth layer.

### Data Model

The application uses three main entities:

- User: stores authentication-related profile data and role information
- Project: holds project metadata, owner, members, status, and description
- Task: belongs to a project, can have an assignee, status, and optional attachments

## Main Components

### Frontend components

The main UI pieces are organized in the frontend component tree:

- App.jsx: application router setup and theme provider
- First.jsx: landing experience with sign-in/sign-up entry points
- Login.jsx: authentication UI
- Register.jsx: new user registration UI
- ProtectedRoute.jsx: route guard for authenticated users
- Dashboard.jsx: project overview and analytics dashboard
- ProjectForm.jsx: create/edit project form
- ProjectList.jsx: project listing view
- TaskBoard.jsx: task workflow board UI
- TaskForm.jsx: task create/edit form
- Show.jsx: task/project detail view
- Editor.jsx: document editor experience
- User.jsx: user-related UI
- EditorComponents/EditorToolbar.jsx: formatting toolbar for the editor
- EditorComponents/TOC.jsx: table of contents support for editor content

### Hooks and utilities

- useProjects.js: project data and CRUD logic
- useTasks.js: task data and task-related operations
- use-tiptap-editor.js: editor setup helpers
- use-floating-element.js: UI positioning helpers for floating UI elements

## Technology Stack

### Frontend

- React
- Vite
- React Router DOM
- TipTap editor ecosystem
- Bootstrap
- Framer Motion
- Axios
- Lucide React
- html2pdf.js
- react-beautiful-dnd
- react-hotkeys-hook

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

### DevOps and Deployment

- Docker
- Docker Compose
- Kubernetes manifests in the k8s folder

## Project Structure

```text
.
├── backend/
│   ├── controllers/
│   ├── Middleware/
│   ├── models/
│   ├── routers/
│   ├── app.js
│   ├── db.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── ThemeContext.jsx
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── k8s/
├── docker-compose.yml
└── README.md
```

## Environment Variables

Create a backend/.env file before running the server.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
CORS_ORIGIN=http://localhost:4173
```

## Getting Started

### Prerequisites

- Node.js and npm
- Docker and Docker Compose (optional, recommended)
- MongoDB (or use Docker Compose for a local container)

### Option 1: Run with Docker Compose

```bash
docker compose up --build
```

This starts:

- MongoDB on port 27017
- Backend on port 4000
- Frontend on port 4173

### Option 2: Run locally

#### Backend

```bash
cd backend
npm install
npm start
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Local URLs

- Frontend: http://localhost:4173 (Docker) or http://localhost:5173 (Vite dev server)
- Backend API: http://localhost:4000

## API Overview

The backend exposes the main routes under the following prefixes:

- /User
  - POST /User/register
  - POST /User/login
  - GET /User/showDetails/:id
- /Project
  - POST /Project/create
  - GET /Project/all
  - GET /Project/:id
  - PUT /Project/:id
  - DELETE /Project/:id
  - POST /Project/:id/members
- /Task
  - POST /Task/addtask
  - PUT /Task/edittask/:id
  - PATCH /Task/status/:id
  - DELETE /Task/deleteTask/:id
  - GET /Task/showTask/:id
  - GET /Task/showOne/:id/:projectId
  - GET /Task/byProject/:projectId
  - POST /Task/upload/:id
  - DELETE /Task/:id/attachment/:attachmentId

## Kubernetes Deployment

The k8s folder includes manifests for a basic deployment setup:

- namespace.yaml
- backend-configmap.yaml
- backend-secret.yaml
- backend-deployment.yaml
- backend-service.yaml
- frontend-deployment.yaml
- frontend-service.yaml
- ingress.yaml

Example deployment flow:

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -n quasar -f k8s/backend-configmap.yaml
kubectl apply -n quasar -f k8s/backend-secret.yaml
kubectl apply -n quasar -f k8s/backend-deployment.yaml
kubectl apply -n quasar -f k8s/backend-service.yaml
kubectl apply -n quasar -f k8s/frontend-deployment.yaml
kubectl apply -n quasar -f k8s/frontend-service.yaml
```

## Future Improvements

Potential enhancements for the project include:

- Real-time multi-user collaboration
- Notifications and activity feeds
- Advanced task filtering and search
- Subtasks and comments
- Improved attachment management
- CI/CD pipelines and automated testing

## License

This project is provided for educational and development purposes. Add your preferred license if you plan to distribute or extend it.

## Contributing

Contributions are welcome. If you want to improve the application, open an issue or submit a pull request with a clear description of the change.
