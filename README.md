# Synapse – AI‑Powered Boardroom Simulation

**Synapse** is a lightweight, open‑source platform that lets ten autonomous agents act as a corporate board. Each agent independently evaluates a user prompt, cross‑reviews the other agents, engages in debate, and refines the response until the “CEO” delivers a consensus reply.

---

## 🚦 Status / CI

| Build | Test | Coverage | Docker Pulls | License |
|-------|------|---------|-------------|---------|
| [![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions/workflows/build.yml) | [![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions/workflows/test.yml) | [![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main)](https://coveralls.io/github/shubhyagami/synapse?branch=main) | [![Docker Pulls](https://img.shields.io/docker/pulls/shubhyagami/synapse.svg)](https://hub.docker.com/r/shubhyagami/synapse) | [![License](https://img.shields.io/badge/license-private-red.svg)](LICENSE) |

---

## 📚 Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Full‑stack Docker](#full‑stack-docker)
  - [Running Components Separately](#running-components-separately)
  - [Environment Variables](#environment-variables)
- [Agents](#agents)
- [Workflow](#workflow)
- [Features](#features)
- [Changelog](#changelog)
- [License](#license)
- [Contributing](#contributing)
- [Questions](#questions)

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# 2. Spin up all services
docker compose up -d

# 3. Prepare secrets
cp backend/.env.example backend/.env
# Edit backend/.env – add your NIM API keys, DB/Redis/Qdrant/MinIO credentials

# 4. Open the UI
open http://localhost:5173   # or navigate in your browser
```

If you prefer to run components locally, see the sections below.

---

## Architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Framer Motion, React Flow | Visualise debate graphs and stream messages |
| **Backend** | Spring Boot 3.4 (Java 21) | REST, WebSocket, and SSE endpoints |
| **LLM Orchestration** | NVIDIA NIM (10 models) | Each agent drives a distinct LLM |
| **Data Store** | PostgreSQL 16, Redis 7, Qdrant 1.9 | Persist conversation state, cache, and vector search |
| **Object Storage** | MinIO | Store media attachments and logs |
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

> The `docker-compose.yml` brings up all services. For a finer‑grained setup, see “Running Components Separately”.

### Full‑stack Docker

```bash
docker compose up -d
```

> Backend → `localhost:8080`  
> Frontend → `localhost:5173`

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

> The UI connects to `http://localhost:8080` by default.

### Environment Variables

Rename `backend/.env.example` to `backend/.env` and replace the placeholders.

| Variable | Description |
|----------|-------------|
| `NVIDIA_NIM_API_KEY_1` … `NVIDIA_NIM_API_KEY_10` | API keys for up to ten NIM models |
| `DB_URL` | PostgreSQL JDBC URL (e.g. `jdbc:postgresql://localhost:5432/synapse`) |
| `REDIS_URL` | Redis connection string |
| `QDRANT_URL` | Qdrant endpoint |
| `MINIO_ENDPOINT` | MinIO URL (e.g. `http://minio:9000`) |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |

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

> Add or replace an agent by updating the corresponding environment variable in `backend/.env` and restarting the backend.

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

The backend orchestrates the process as asynchronous tasks; the frontend streams each contribution in real time via WebSocket/SSE.

---

## Features

- Real‑time collaboration via SSE and WebSocket streams
- Asynchronous execution using Spring Boot’s task executor
- Vector search of long conversations with Qdrant
- Extensible agent roles configurable through environment variables
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

---

## Contributing

Pull requests are welcome.  
Please open an issue first if you have a feature idea or bug report.

---

## Questions

For questions or support, open an issue on GitHub or email shubhyagami@example.com.
