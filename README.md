# Synapse – AI‑Powered Boardroom Simulation

A lightweight, open‑source platform that lets ten autonomous agents play the roles of an executive board. Each agent analyzes a user prompt, cross‑checks the others, debates, and refines the answer until the “CEO” delivers a consensus reply.

---

## 🚧 Status

- **Open‑source** – you can run it locally or deploy it in a cloud environment.
- **Tech‑stack** – Java 21, Spring Boot 3.4, React 19, PostgreSQL 16, Redis 7, Qdrant 1.9, MinIO, Docker Compose.

---

## 🏷 Badges

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg)](https://adoptium.net)  
[![Spring Boot 3.4](https://img.shields.io/badge/Spring%20Boot-3.4-brightgreen.svg)](https://spring.io)  
[![React 19](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org)  
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org)  
[![Docker Compose](https://img.shields.io/badge/Docker-Compose-0db7ed.svg)](https://docs.docker.com/compose/)  
[![License](https://img.shields.io/badge/license-private-red.svg)](LICENSE)

---

## 📚 Table of Contents

- [Architecture](#architecture)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
  - [Environment Variables](#environment-variables)
  - [Running Components Separately](#running-components-separately)
- [AI Board Members](#ai-board-members)
- [Discussion Workflow](#discussion-workflow)
- [Feature Highlights](#feature-highlights)
- [Changelog](#changelog)
- [License](#license)

---

## ⚙️ Architecture

| Layer | Technology | Notes |
|-------|------------|-------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Framer Motion, React Flow | Visualises the debate graph and streams agent messages via WebSocket |
| **Backend** | Spring Boot 3.4, Java 21 | Exposes WebSocket and Server‑Sent Events (SSE) endpoints for real‑time updates |
| **AI** | NVIDIA NIM (10 distinct models) | Each agent runs a separate LLM instance |
| **Databases** | PostgreSQL 16 (relational), Redis 7 (caching), Qdrant 1.9 (vector search) | Persist conversation state and embeddings |
| **Storage** | MinIO | Stores media attachments and logs |
| **Orchestration** | Docker Compose | Spin up the full stack with a single command |

---

## 📦 Installation

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Docker | 20.10+ |
| Docker Compose | v2 |
| Java JDK | 21 |
| Node.js | 20+ (npm or yarn) |

> **NOTE**  
> The Docker Compose file launches the entire stack. If you prefer to run services individually, see “Running Components Separately”.

### Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# 2. Start all services
docker compose up -d

# 3. Configure secrets
#    Copy the example and add your NVIDIA NIM keys
cp backend/.env.example backend/.env
nano backend/.env   # or edit in your favourite editor

# 4. (Optional) Run the backend directly
cd backend
./mvnw spring-boot:run

# 5. (Optional) Run the frontend directly
cd ../frontend
npm install
npm run dev
```

Open <http://localhost:5173> to view the boardroom.

### Environment Variables

| Variable | Description |
|---------|--------------|
| `NVIDIA_NIM_API_KEY_1` | API key for the first NIM model |
| `...` | Define one key per model (up to 10) |
| `DB_URL` | PostgreSQL JDBC URL |
| `REDIS_URL` | Redis connection string |
| `QDRANT_URL` | Qdrant endpoint |
| `MINIO_ENDPOINT` | MinIO URL |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |

Rename `backend/.env.example` to `.env` and replace placeholder values.

### Running Components Separately

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
```

Both services must be reachable on the default ports (`8080` for backend, `5173` for frontend). The frontend will fail to connect without the backend running.

---

## 👥 AI Board Members

| Agent | Role | Model |
|-------|------|-------|
| Alexandra Chen | CEO | `z-ai/glm-5.2` |
| Marcus Rivera | Product Manager | `z-ai/glm-5.2` |
| Priya Sharma | Backend Engineer | `poolside/laguna-xs-2.1` |
| Jake Yamamoto | Frontend Engineer | `google/gemma-4-31b-it` |
| Fatima Al‑Hassan | Cloud Architect | `poolside/laguna-xs-2.1` |
| Dmitri Volkov | Security Engineer | `nvidia/nemotron-3-ultra-550b-a55b` |
| Sarah Kim | QA Engineer | `stepfun-ai/step-3.7-flash` |
| Leo Dubois | Marketing Strategist | `moonshotai/kimi-k2.6` |
| Aisha Patel | Customer Analyst | `moonshotai/kimi-k2.6` |
| Emma Lindström | UI/UX Designer | `google/gemma-4-31b-it` |

---

## 🔄 Discussion Workflow

```text
User query
   ↓
Independent analysis (10 agents)
   ↓
Cross‑review
   ↓
Critique & debate
   ↓
Iterative improvement
   ↓
Consensus engine
   ↓
CEO summary → User
```

The workflow is orchestrated by Spring’s async tasks. The frontend subscribes via WebSocket, displaying each contribution in real time.

---

## ⭐ Feature Highlights

- **Real‑time collaboration** – SSE and WebSockets keep the UI live.
- **Asynchronous agent execution** – Spring Boot’s task executor scales with workload.
- **Vector search integration** – Qdrant accelerates similarity queries for long conversations.
- **Extensible agent roles** – Add or replace models by editing `backend/.env`.
- **Secure storage** – MinIO for files, Redis for caching, PostgreSQL for persistence.
- **Docker Compose ready** – One command launches the entire stack.

---

## 📦 Changelog

### v1.2.0 – 2026‑08‑21

- Standardized environment configuration
- Added SSE streaming for faster state updates
- Refined cross‑review and critique logic to improve consensus consistency

---

## 📄 License

Synapse is distributed under a **private license**. All rights reserved.  
See the [LICENSE](LICENSE) file for details.
