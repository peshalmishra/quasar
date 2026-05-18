<h1>📝 Quasar – Full Stack Collaborative Text Editor</h1>

Quasar is a full-stack web application for managing projects and editing documents collaboratively. It features a modern React (Vite) frontend and a Node.js/Express backend, both containerized with Docker for easy deployment.

---

## 🚀 Features

- User authentication and registration
- Project and task management
- Rich text editing with advanced formatting (powered by TipTap)
- Real-time auto-save and PDF export
- Responsive, mobile-friendly UI
- Secure API with JWT authentication
- Dockerized for simple local development and cloud deployment

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TipTap, Bootstrap, Lucide Icons, Axios, Framer Motion, HTML2PDF
- **Backend:** Node.js, Express, MongoDB (via Mongoose)
- **DevOps:** Docker, Docker Compose

---

## 📦 Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/your-username/quasar.git
cd quasar
```

### 2. Set up environment variables

Create a `.env` file in the `backend` folder with the following:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### 3. Run with Docker Compose (recommended)

```sh
docker-compose up --build
```

This will start both frontend and backend containers.

### 4. Or run manually

#### Backend
```sh
cd backend
npm install
npm run dev
```

#### Frontend
```sh
cd frontend
npm install
npm run dev
```

### 5. Access the application

- Frontend: [http://localhost:4173](http://localhost:4173)
- Backend API: [http://localhost:4000](http://localhost:4000)

---

## 📂 Folder Structure

```
quasar/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routers/
│   ├── Middleware/
│   ├── db.js
│   ├── app.js
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── Dockerfile
│   └── vite.config.js
└── docker-compose.yml
```

---

## 📈 Future Enhancements

- Real-time collaboration (multi-user editing)
- Notification system
- Task categories and priorities
- Subtasks and comments
- Cloud deployment guides

---

## ☸️ Kubernetes Deployment (Minikube)

The `k8s/` folder contains production-ready manifests for running Quasar in Minikube with separate frontend and backend services.

### Files included

- `k8s/namespace.yaml` – creates a dedicated `quasar` namespace.
- `k8s/frontend-deployment.yaml` – deployment for the React/Vite frontend.
- `k8s/frontend-service.yaml` – exposes frontend via `NodePort`.
- `k8s/backend-configmap.yaml` – backend configuration values for non-sensitive environment variables.
- `k8s/backend-secret.yaml` – secure backend secrets for MongoDB and JWT.
- `k8s/backend-deployment.yaml` – deployment for the Node/Express backend.
- `k8s/backend-service.yaml` – internal `ClusterIP` service for backend access.
- `k8s/ingress.yaml` – optional ingress route for `quasar.local` (requires an ingress controller).

### Kubernetes setup commands

```sh
kubectl apply -f k8s/namespace.yaml
kubectl apply -n quasar -f k8s/backend-configmap.yaml
kubectl apply -n quasar -f k8s/backend-secret.yaml
kubectl apply -n quasar -f k8s/backend-deployment.yaml
kubectl apply -n quasar -f k8s/backend-service.yaml
kubectl apply -n quasar -f k8s/frontend-deployment.yaml
kubectl apply -n quasar -f k8s/frontend-service.yaml
# Optional ingress if using an ingress controller
kubectl apply -n quasar -f k8s/ingress.yaml
```

### Notes

- Frontend connects to backend at `http://quasar-backend-service:4000` inside the cluster.
- Backend uses environment examples for `MONGO_URI`, `JWT_SECRET`, `PORT`, and `CORS_ORIGIN`.
- The frontend service is exposed externally via NodePort `30073`.
- The backend service remains internal as `ClusterIP`.

### Minikube ingress setup example

If using `minikube` with an NGINX ingress controller:

```sh
minikube addons enable ingress
kubectl apply -n quasar -f k8s/ingress.yaml
```

Then add `quasar.local` to your `/etc/hosts` or system hosts file, pointing to the Minikube IP.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue if you have any suggestions or improvements in mind.

---

## 🧑‍💻 Author

- <a href="https://github.com/mayur777-ui"><img src="https://img.icons8.com/ios-glyphs/30/github.png" alt="GitHub Icon"/> Mayur Lakshkar</a>
- <a href="https://linkedin.com/in/mayur-lakshkar"><img src="https://img.icons8.com/ios-filled/30/linkedin.png" alt="LinkedIn Icon"/> Mayur Lakshkar</a>
