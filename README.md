# MediLearn AI

MediLearn AI is an AI-driven study platform for medical learners. It creates personalized quizzes, delivers intelligent feedback, and tracks progress while demonstrating a full-stack deployment and monitoring pipeline.

---

## Overview

MediLearn AI combines:

* adaptive quiz generation
* AI-assisted grading and learning feedback
* secure user sessions and persistent progress tracking
* a production-ready deployment workflow with observability

It is designed as both a learning product and a technical showcase.

---

## Key Features

* Personalized quiz creation by topic and context
* AI-powered answer evaluation and feedback
* User profiles, progress tracking, and leaderboard
* Secure authentication with HttpOnly session cookies
* Persistent storage using MongoDB Atlas
* Prometheus metrics and Grafana dashboards for monitoring

---

## Architecture

```text
User → Next.js app → Node backend
     ↓              ↓
  Authentication   MongoDB
                   Metrics → Prometheus → Grafana
```

---

## Tech Stack

* Next.js (App Router)
* TypeScript
* React + Tailwind CSS
* Shadcn/UI components
* Node.js backend server
* MongoDB Atlas
* Google Gemini via Genkit
* Docker and Kubernetes for deployment
* Prometheus + Grafana for observability

---

## Local Setup

### Prerequisites

* Node.js 18+
* npm
* MongoDB Atlas cluster

### Install

```bash
npm install
```

### Environment

Create `.env.local` with values similar to:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/medilearn?retryWrites=true&w=majority
MONGODB_DB_NAME=medilearn
AUTH_JWT_SECRET=YOUR_LONG_RANDOM_SECRET
```

Alternatively, copy the sample environment file:

```bash
cp samples/.env.example .env.local
```

Then edit `.env.local` with your actual values.

### Start the app

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## Sample Files

The `samples/` directory contains template configuration files for quick setup and deployment. These are starting points that you should customize for your own environment.

### Available Samples

| File | Purpose | Use Case |
|------|---------|----------|
| `.env.example` | Environment variables template | Local development setup |
| `deployment.yaml` | Kubernetes deployment manifest | Kubernetes cluster deployment |
| `service.yaml` | Kubernetes service definition | Expose app within/outside K8s cluster |
| `servicemonitor.yaml` | Prometheus ServiceMonitor | Enable Prometheus metrics scraping in K8s |
| `render.yaml` | Render platform configuration | Deploy to Render platform |

### Quick Start with Samples

**For Local Development:**
```bash
cp samples/.env.example .env.local
# Edit .env.local with your actual credentials
```

**For Kubernetes:**
```bash
cp samples/deployment.yaml .
cp samples/service.yaml .
cp samples/servicemonitor.yaml .
# Edit each file to replace placeholders with your values
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f servicemonitor.yaml
```

**For Render:**
```bash
cp samples/render.yaml .
# Use this file in your Render dashboard
```

---

## Docker

Build and run the container:

```bash
docker build -t medilearn-ai .
docker run -p 3000:3000 medilearn-ai
```

---

## Deployment

This repository provides sample deployment configurations for different platforms in the `samples/` directory. See the [Sample Files](#sample-files) section for a complete list and quick-start guide.

### Kubernetes Deployment

Sample Kubernetes manifests are provided in the `samples/` directory.

1. Copy the sample files:
   ```bash
   cp samples/deployment.yaml .
   cp samples/service.yaml .
   cp samples/servicemonitor.yaml .
   ```

2. Edit the files to replace placeholders (e.g., `<YOUR_DOCKER_IMAGE>`, `<YOUR_MONGODB_URI>`) with your actual values.

3. Deploy to Kubernetes:
   ```bash
   kubectl apply -f deployment.yaml
   kubectl apply -f service.yaml
   kubectl apply -f servicemonitor.yaml
   ```

4. Verify deployment:
   ```bash
   kubectl get pods
   kubectl get svc medilearn-service
   ```

5. To access the service (if using minikube):
   ```bash
   minikube service medilearn-service
   ```

### Render Deployment

For deploying on Render, use the sample `render.yaml` from the `samples/` directory:

1. Copy the sample file:
   ```bash
   cp samples/render.yaml .
   ```

2. In your Render dashboard, create a new service and upload or paste the contents of this YAML file.

3. Set the environment variables in Render's dashboard:
   * `MONGODB_URI`
   * `MONGODB_DB_NAME`
   * `AUTH_JWT_SECRET`
   * `GEMINI_API_KEY`

4. Deploy and monitor the service through Render's dashboard.

---

## Monitoring and Observability

### Prometheus

* Scrape the metrics endpoint at:

```text
http://<service-address>/api/metrics
```

### Grafana

* Add Prometheus as a data source
* Build dashboards with application metrics

### Metrics exposed

* `app_requests_total`
* `app_latency_ms`
* `app_errors_total`
* `app_success_total`
* `app_active_users`
* `app_db_query_time_ms`
* `app_uptime_seconds`

---

## Project Structure

* `src/app` — application pages and API routes
* `src/lib` — utilities, database, and auth helpers
* `src/components` — reusable UI components
* `src/ai` — AI flows and integrations with Genkit
* `src/context` — React context for state management
* `src/hooks` — reusable React hooks
* `public/` — static assets
* `functions/` — serverless functions (if using)
* `server.js` — server entry point
* `Dockerfile` — container build definition
* `samples/` — template configuration files for quick deployment:
  * `.env.example` — environment variables template
  * `deployment.yaml` — Kubernetes deployment manifest
  * `service.yaml` — Kubernetes service configuration
  * `servicemonitor.yaml` — Prometheus monitoring configuration
  * `render.yaml` — Render platform deployment config
* `aws-deployment.yaml`, `aws-service.yaml`, `aws-servicemonitor.yaml` — AWS-specific deployment manifests (internal use)
* `docs/` — additional documentation

---

## Future Improvements

* Add P95/P99 latency tracking
* Implement alerting with Grafana Alertmanager
* Add endpoint-level metrics
* Deploy on AWS EKS/ECS
* Integrate Redis caching
* Harden security and authentication

---

## Author

Mukul Deshwal

GitHub: https://github.com/mukuld86

