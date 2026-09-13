# Synapse – AI‑Powered Boardroom Simulation

Synapse is a lightweight, open‑source platform that simulates a corporate board of ten autonomous agents. Each agent evaluates a user prompt, cross‑reviews the others, engages in structured debate, and iteratively refines its output until the “CEO” delivers a consensus answer.

The stack is split into:
- **Backend** – Java 21 Spring Boot 3.4
- **Frontend** – Vite + React 18, TypeScript, Tailwind CSS, Framer Motion, React Flow
- **LLM Orchestration** – NVIDIA NIM models
- **Datastore** – PostgreSQL 16, Redis 7, Qdrant 1.9
- **Object Store** – MinIO

All services are packaged with Docker Compose for a one‑click install.

> **NOTE**  
> Synapse is licensed under a private license. All rights reserved.

---

## Badges

![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg)
![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg)
![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main)
![Docker Pulls](https://img.shields.io/docker/pulls/shubhyagami/synapse.svg)
![License](https://img.shields.io/badge/license-private-red.svg)

---

## Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# 2. Configure environment variables
cp backend/.env.example backend/.env
#    Edit the file – provide NIM API keys, database URLs, and credentials

# 3. Start the stack
docker compose up -d

# 4. Open the UI
#    http://localhost:5173
```

**Running Components Separately**

```bash
# Backend
cd backend
./mvnw spring-boot:run   # JVM 21 required

# Frontend
cd ../frontend
npm install
npm run dev
```

The frontend automatically connects to `http://localhost:8080`.

---

## Prerequisites

| Tool | Minimum version |
|------|-----------------|
| Docker | 20.10+ |
| Docker Compose | v2 |
| Java JDK | 21 |
| Node.js | 20+ (npm or yarn) |

---

## Environment Configuration

Rename `backend/.env.example` to `backend/.env` and fill in the placeholders:

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
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Flow | Visualises debate graphs and streams real‑time messages |
| **Backend** | Spring Boot 3.4 (Java 21) | REST API, WebSocket/SSE, orchestration, task scheduling |
| **LLM Orchestration** | NVIDIA NIM | Each agent drives a distinct LLM |
| **Data Store** | PostgreSQL 16, Redis 7, Qdrant 1.9 | Persist conversation state, cache, vector search |
| **Object Store** | MinIO | Store media attachments and logs |
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

To add or replace an agent, simply update the corresponding environment variable in `backend/.env` and restart the backend.

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

The backend runs each step as an asynchronous task; the frontend streams each contribution in real‑time via WebSocket/SSE.

---

## Features

- Real‑time collaboration with SSE and WebSocket
- Asynchronous, non‑blocking processing via Spring Boot’s task executor
- Vector search for long conversations using Qdrant
- Configurable agent roles through environment variables
- Secure, resilient storage: Redis cache, PostgreSQL persistence, MinIO object store
- One‑click deployment using Docker Compose

---

## Docker & CI

| Build | Test | Coverage | Docker Pulls |
|-------|------|----------|--------------|
| ![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg) | ![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg) | ![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main) | ![Docker Pulls](https://img.shields.io/docker/pulls/shubhyagami/synapse.svg) |

---

## Changelog

### v1.2.0 – 2026‑08‑21

- Standardised environment configuration
- Added SSE streaming for faster UI updates
- Refined cross‑review logic to improve consensus accuracy

---

## License

Synapse is distributed under a **private license**. All rights reserved. See the [LICENSE](LICENSE) file for details.

---

## Contributing

Pull requests are welcome. Please open an issue first if you have a feature idea or bug report.

---

## Support

If you encounter a problem or have a question, open an issue on GitHub or email shubhyagami@example.com.
