# Synapse – Autonomous Boardroom Simulation

Synapse orchestrates a virtual board of ten AI agents that collaborate to answer user prompts. Each agent independently interprets the prompt, critiques its peers, and participates in a structured debate until the CEO synthesizes a final consensus answer.

[![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions)
[![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions)
[![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main)](https://coveralls.io/github/shubhyagami/synapse)
[![Docker Pulls](https://img.shields.io/docker/pulls/shubhyagami/synapse.svg)](https://hub.docker.com/r/shubhyagami/synapse)
[![License](https://img.shields.io/badge/license-proprietary-red.svg)](LICENSE)

---

## Core Features

| Feature | Description |
|---------|-------------|
| **Ten‑Agent Orchestration** | Each agent has a distinct role and runs its own model. |
| **Structured Debate** | Agents cross‑review and debate to reduce hallucinations. |
| **Real‑time UI** | Live streaming of debate flows and graph visualizations via WebSockets/SSE. |
| **Hybrid Persistence** | PostgreSQL for long‑term state, Redis for caching, Qdrant for vector search. |
| **Modular LLM Backend** | Agents can use any NVIDIA NIM‑hosted model. |
| **Zero‑config Docker** | `docker compose up` starts the entire stack. |

---

## Architecture Overview

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Backend** | Java 21, Spring Boot 3.4 | REST API, WebSocket/SSE, orchestration, scheduling |
| **Frontend** | Vite + React 18 + TypeScript + Tailwind CSS + React‑Flow | Debate graph, result streams, control panel |
| **LLM Orchestration** | NVIDIA NIM | Hosts and runs agents’ models |
| **Persistence & Search** | PostgreSQL 16, Redis 7, Qdrant 1.9 | State, caching, vector search |
| **Object Store** | MinIO | Media attachments and logs |
| **Deployment** | Docker Compose | Container orchestration |

---

## Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# 2. Configure environment variables
cp backend/.env.example backend/.env
# edit the file: add NIM keys and database credentials

# 3. Start all services
docker compose up -d

# 4. Open the web UI
# http://localhost:5173
```

The UI connects automatically to the backend at `http://localhost:8080`.

---

## Manual Development

> These steps are needed only if you plan to contribute to the code.

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs on `http://localhost:5173` and proxies API calls to `http://localhost:8080`.

---

## Configuration

Edit `backend/.env` to provide the following variables:

| Variable | Purpose |
|----------|---------|
| `NVIDIA_NIM_API_KEY_1…10` | NIM API keys for the ten agents |
| `DB_URL` | PostgreSQL JDBC URL |
| `REDIS_URL` | Redis connection string |
| `QDRANT_URL` | Qdrant endpoint |
| `MINIO_ENDPOINT` | MinIO URL (e.g. `http://minio:9000`) |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |

The `.env.example` file already contains placeholder values.

---

## Agent Roles

| Agent | Role | Default Model |
|-------|------|---------------|
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

## Operational Workflow

1. **Prompt** – User submits a question through the UI.  
2. **Parallel Generation** – Each agent creates an independent reply.  
3. **Cross‑Review** – Agents analyze each other’s outputs.  
4. **Debate** – Structured rebuttals and evidence exchange occur.  
5. **Revision** – Agents update their replies after the debate.  
6. **Synthesis** – CEO aggregates the refined replies into a final answer.  
7. **Delivery** – The consensus answer streams back to the user.

---

## Changelog

### v1.2.0 – 2026‑08‑21

- Unified environment configuration for a smoother onboarding experience.  
- Added SSE streaming for real‑time UI updates.  
- Optimized cross‑review logic, improving consensus accuracy.

---

## License

Synapse is released under a **proprietary license**. All rights reserved. See the [LICENSE](LICENSE) file for details.

---

## Contributing & Support

Pull requests are welcome. For new features or bug reports, open a GitHub issue first to discuss.  
For technical support, create an issue or email `shubhyagami@example.com`.
