# Synapse – AI‑Powered Boardroom Simulation

Synapse is an open‑source platform that orchestrates an autonomous board of ten agents.  
Each agent interprets a user query, cross‑examines its peers, engages in structured debate, and iteratively refines its output until the **CEO** synthesises a consensus answer.

The stack is divided into the following layers:

| Layer | Technology | Purpose |
|-------|-------------|---------|
| **Backend** | Java 21, Spring Boot 3.4 | REST API, WebSocket/SSE, orchestration, task scheduling |
| **Frontend** | Vite + React 18, TypeScript, Tailwind CSS, Framer Motion, React Flow | Visualises debate graphs and streams real‑time messages |
| **LLM Orchestration** | NVIDIA NIM | Each agent drives a distinct large language model |
| **Datastore** | PostgreSQL 16, Redis 7, Qdrant 1.9 | Persists conversation state, caches, and performs vector search |
| **Object Store** | MinIO | Stores media attachments and logs |
| **Deployment** | Docker Compose | One‑click launch of the entire stack |

> **NOTE**  
> Synapse is distributed under a proprietary license. All rights reserved.

---

## Badges

[![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions)
[![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions)
[![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main)](https://coveralls.io/github/shubhyagami/synapse)
[![Docker Pulls](https://img.shields.io/docker/pulls/shubhyagami/synapse.svg)](https://hub.docker.com/r/shubhyagami/synapse)
[![License](https://img.shields.io/badge/license-proprietary-red.svg)](LICENSE)

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

### Running components separately

```bash
# Backend
cd backend
./mvnw spring-boot:run   # Requires Java 21

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

## Agents

| Agent | Role | Base model |
|-------|------|-----------|
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

To change an agent, update the corresponding environment variable in `backend/.env` and restart the backend.

---

## Workflow

1. **User query**  
2. **Independent analysis** (10 agents)  
3. **Cross‑review**  
4. **Critique & debate**  
5. **Iterative improvement**  
6. **Consensus engine**  
7. **CEO summary → User**

The backend runs each step as an asynchronous task; the frontend streams contributions via WebSocket/SSE.

---

## Features

* Real‑time collaboration with WebSocket and SSE  
* Asynchronous, non‑blocking processing through Spring Boot’s task executor  
* Vector search for long conversations using Qdrant  
* Configurable agent roles via environment variables  
* Secure, resilient storage – Redis cache, PostgreSQL persistence, MinIO object store  
* One‑click deployment with Docker Compose  

---

## Docker & CI

| Build | Test | Coverage | Docker Pulls |
|-------|------|----------|--------------|
| ![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg) | ![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg) | ![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main) | ![Docker Pulls](https://img.shields.io/docker/pulls/shubhyagami/synapse.svg) |

---

## Changelog

### v1.2.0 – 2026‑08‑21

* Standardised environment configuration  
* Added SSE streaming for faster UI updates  
* Refined cross‑review logic to improve consensus accuracy  

---

## License

Synapse is distributed under a **proprietary license**. All rights reserved. See the [LICENSE](LICENSE) file for details.

---

## Contributing

Pull requests are welcome. Please open an issue first if you have a feature idea or bug report.

---

## Support

If you encounter a problem or have a question, open an issue on GitHub or email shubhyagami@example.com.
