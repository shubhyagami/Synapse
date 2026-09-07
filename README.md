# Synapse – AI‑Powered Boardroom Simulation

Synapse is a lightweight, open‑source platform that simulates a corporate board consisting of ten autonomous agents.  
Each agent evaluates a user prompt, cross‑reviews the others, engages in structured debate, and iteratively refines its output until the “CEO” delivers a consensus answer.

The stack is split into a Java 21 Spring Boot 3.4 backend, a Vite‑React 19 front‑end, and a set of NVIDIA NIM LLMs.  
Data is persisted in PostgreSQL 16, cached in Redis 7, vector‑searched with Qdrant 1.9, and media is stored in MinIO.  
All services are packaged as Docker Compose for a one‑click install.

> [!NOTE]  
> Synapse is licensed under a private license. All rights reserved.

---

## Quickstart

```bash
# 1. Clone the repo
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# 2. Create the runtime environment
cp backend/.env.example backend/.env
#   Edit the file – fill in NIM API keys, database URLs and credentials

# 3. Spin up the stack
docker compose up -d

# 4. Open the UI
open http://localhost:5173   # or visit it in your browser
```

If you prefer to run components separately, see **Running Components Separately** below.

---

## Prerequisites

| Tool | Minimum version |
|------|-----------------|
| Docker | 20.10+ |
| Docker Compose | v2 |
| Java JDK | 21 |
| Node.js | 20+ (npm or yarn) |

---

## Installation

### Full‑stack Docker

```bash
docker compose up -d
```

| Service | URL |
|---------|-----|
| Backend | <http://localhost:8080> |
| Frontend | <http://localhost:5173> |

### Running Components Separately

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd ../frontend
npm install
npm run dev
```

The UI automatically connects to the backend at `http://localhost:8080`.

---

## Environment Configuration

Rename `backend/.env.example` to `backend/.env` and replace placeholders:

| Variable | Description |
|-----------|-------------|
| `NVIDIA_NIM_API_KEY_1` … `NVIDIA_NIM_API_KEY_10` | API keys for up to ten NIM models |
| `DB_URL` | PostgreSQL JDBC URL (e.g. `jdbc:postgresql://localhost:5432/synapse`) |
| `REDIS_URL` | Redis connection string |
| `QDRANT_URL` | Qdrant endpoint |
| `MINIO_ENDPOINT` | MinIO URL (e.g. `http://minio:9000`) |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |

---

## Architecture Overview

| Layer | Tech | Purpose |
|-------|------|---------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Framer Motion, React Flow | Visualise debate graphs, stream real‑time messages |
| **Backend** | Spring Boot 3.4 (Java 21) | REST, WebSocket, SSE, orchestration |
| **LLM Orchestration** | NVIDIA NIM | Each agent drives a distinct LLM |
| **Data Store** | PostgreSQL 16, Redis 7, Qdrant 1.9 | Persist conversation state, cache, vector search |
| **Object Storage** | MinIO | Store media attachments and logs |
| **Deployment** | Docker Compose | One‑click launch of the entire stack |

---

## Agents

| Agent | Role | Base model |
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

To add or replace an agent, update the corresponding environment variable in `backend/.env` and restart the backend.

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

The backend runs the steps as asynchronous tasks; the front‑end streams each contribution in real time via WebSocket/SSE.

---

## Features

* Real‑time collaboration (SSE & WebSocket)  
* Asynchronous processing with Spring Boot’s task executor  
* Vector search of long conversations with Qdrant  
* Configurable agent roles via environment variables  
* Secure storage: Redis cache, PostgreSQL persistence, MinIO object store  
* One‑click deployment with Docker Compose

---

## Docker & CI

| Build | Test | Coverage | Docker Pulls | License |
|-------|------|---------|--------------|---------|
| ![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg) | ![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg) | ![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main) | ![Docker Pulls](https://img.shields.io/docker/pulls/shubhyagami/synapse.svg) | ![License](https://img.shields.io/badge/license-private-red.svg) |

---

## Changelog

### v1.2.0 – 2026‑08‑21

* Standardised environment configuration
* Added SSE streaming for faster UI updates
* Refined cross‑review logic to improve consensus accuracy

---

## License

Synapse is distributed under a **private license**. All rights reserved. See the [LICENSE](LICENSE) file for details.

---

## Contributing

Pull requests are welcome. Please open an issue first if you have a feature idea or bug report.

---

## Questions

For questions or support, open an issue on GitHub or email shubhyagami@example.com.
