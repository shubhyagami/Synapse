# Synapse – AI‑Powered Boardroom Simulation

**Synapse** is a lightweight, open‑source platform that lets ten autonomous agents play an executive board.  
Each agent analyzes a user prompt, cross‑checks the others, debates, and refines the answer until the “CEO” delivers a consensus reply.

---

## 🚦 Status

![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg)  
![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg)  
![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main)  
![License](https://img.shields.io/badge/license-private-red.svg)

---

## 📚 Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Running the Full Stack](#running-the-full-stack)
  - [Running Services Separately](#running-services-separately)
  - [Environment Variables](#environment-variables)
- [Agents](#agents)
- [Workflow](#workflow)
- [Features](#features)
- [Changelog](#changelog)
- [License](#license)

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# 2. Spin up all services
docker compose up -d

# 3. Configure secrets
cp backend/.env.example backend/.env
# Edit backend/.env with your NIM keys, DB, and storage credentials

# 4. Open the UI
open http://localhost:5173   # or visit in your browser
```

If you prefer a local checkout, see the sections below for running the backend or frontend independently.

---

## Architecture

| Layer | Tech | Purpose |
|-------|------|---------|
| **Frontend** | React 19, TypeScript, Tailwind, Framer Motion, React Flow | Visualises debate graphs and streams messages |
| **Backend** | Spring Boot 3.4 (Java 21) | REST, WebSocket, and SSE endpoints |
| **LLM Orchestration** | NVIDIA NIM (10 models) | Each agent drives a separate LLM |
| **Data Store** | PostgreSQL 16, Redis 7, Qdrant 1.9 | Persist conversation state, cache, and vector search |
| **Object Storage** | MinIO | Media attachments and logs |
| **Deployment** | Docker Compose | One‑click launch of the entire stack |

---

## Installation

### Prerequisites

| Tool | Minimum version |
|------|-----------------|
| Docker | 20.10+ |
| Docker Compose | v2 |
| Java JDK | 21 |
| Node.js | 20+ (npm or yarn) |

> The `docker-compose.yml` file bundles all services. If you want to run components separately, see the “Running Services Separately” section.

### Running the Full Stack

```bash
docker compose up -d
```

The stack starts in the background. The backend will be reachable on port `8080`, the frontend on `5173`.

### Running Services Separately

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd ../frontend
npm install
npm run dev
```

The UI connects to the backend at `http://localhost:8080`.

### Environment Variables

Rename `backend/.env.example` to `.env` and fill in the placeholders.

| Variable | Description |
|----------|-------------|
| `NVIDIA_NIM_API_KEY_1` … `NVIDIA_NIM_API_KEY_10` | API keys for up to ten NIM models |
| `DB_URL` | PostgreSQL JDBC URL (e.g. `postgres://user:pass@localhost:5432/synapse`) |
| `REDIS_URL` | Redis connection string |
| `QDRANT_URL` | Qdrant endpoint |
| `MINIO_ENDPOINT` | MinIO URL (e.g. `http://minio:9000`) |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |

---

## Agents

| Agent | Role | Base Model |
|-------|------|------------|
| Alexandra Chen | CEO | `z-ai/glm-5.2` |
| Marcus Rivera | Product Manager | `z-ai/glm-5.2` |
| Priya Sharma | Backend Engineer | `poolside/laguna-xs-2.1` |
| Jake Yamamoto | Frontend Engineer | `google/gemma-4-31b-it` |
| Fatima Al‑Hassan | Cloud Architect | `poolside/laguna-xs-2.1` |
| Dmitri Volkov | Security Engineer | `nvidia/nemotron-3-ultra-550b-a55b` |
| Sarah Kim | QA Engineer | `stepfun-ai/step-3.7-flash` |
| Leo Dubois | Marketing Strategist | `moonshotai/kimi-k2.6` |
| Aisha Patel | Customer Analyst | `moonshotai/kimi-k2.6` |
| Emma Lindström | UI/UX Designer | `google/gemma-4-31b-it` |

To add or replace an agent, update the `backend/.env` file with the desired model ID and restart the backend.

---

## Workflow

```
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

The backend drives the process with asynchronous tasks; the frontend subscribes via WebSocket and streams each contribution in real time.

---

## Features

- Real‑time collaboration with SSE and WebSocket streams
- Asynchronous execution using Spring Boot’s task executor
- Vector search for long conversations with Qdrant
- Extensible agent roles via environment configuration
- Secure storage: Redis caching, PostgreSQL persistence, MinIO object store
- One‑click launch with Docker Compose

---

## Changelog

### v1.2.0 – 2026‑08‑21

- Standardised environment configuration
- Added SSE streaming for faster UI updates
- Refined cross‑review logic to improve consensus accuracy

---

## License

Synapse is distributed under a **private license**. All rights reserved.  
See the [LICENSE](LICENSE) file for details.
