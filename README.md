[K[2m  [2mmodel deepseek-ai/deepseek-v4.1-flash failed, trying next...[0m[0m
# Synapse – Autonomous Boardroom Simulation

Synapse orchestrates a virtual board of ten AI agents that collaborate to answer user prompts.  
Each agent interprets the prompt independently, critiques its peers, and takes part in a structured debate.  
The CEO then synthesizes a final consensus answer and streams it back to the user.

> **Note** – Synapse is built around the idea that collective reasoning reduces hallucination compared to single‑model approaches.

[![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions/workflows/build.yml)
[![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions/workflows/test.yml)
[![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main)](https://coveralls.io/github/shubhyagami/synapse)
[![Docker Pulls](https://img.shields.io/docker/pulls/shubhyagami/synapse.svg)](https://hub.docker.com/r/shubhyagami/synapse)
[![License](https://img.shields.io/badge/license-proprietary-red.svg)](LICENSE)

---

## Features

| Feature                     | Description |
|-----------------------------|-------------|
| Ten‑agent orchestration     | Every agent has a distinct role and runs its own LLM. |
| Structured debate           | Agents cross‑review and debate to reduce hallucinations. |
| Real‑time UI               | Streams debate flows and graphical results via WebSockets/SSE. |
| Hybrid persistence         | PostgreSQL for long‑term state, Redis for caching, Qdrant for vector search. |
| Modular LLM backend        | Agents use any NVIDIA NIM‑hosted model. |
| Docker Compose stack        | `docker compose up` launches the full environment. |

---

## Architecture Overview

| Layer          | Technology                                               | Purpose |
|----------------|-----------------------------------------------------------|---------|
| **Backend**   | Java 21, Spring Boot 3.4                                 | REST API, WebSocket/SSE, orchestration, scheduling |
| **Frontend**   | Vite + React 18 + TypeScript + Tailwind CSS + React Flow  | Debate graph, result streams, control panel |
| **LLM**        | NVIDIA NIM                                                | Hosts agents’ models |
| **Persistence**| PostgreSQL 16, Redis 7, Qdrant 1.9                      | State, caching, vector search |
| **Object store** | MinIO                                                  | Media attachments, logs |
| **Deployment** | Docker Compose                                           | Container orchestration |

---

## Quick Start

> These steps get the entire stack running locally in a single command.

```bash
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# Copy the example env file and fill in your credentials
cp backend/.env.example backend/.env
# ------------------------------------------------------------------
# Edit `backend/.env` to add:
#   NVIDIA_NIM_API_KEY_1…10  – NIM API keys for the agents
#   DB_URL                   – PostgreSQL JDBC URL
#   REDIS_URL                – Redis connection string
#   QDRANT_URL               – Qdrant endpoint
#   MINIO_ENDPOINT           – MinIO URL
#   MINIO_ACCESS_KEY         – MinIO access key
#   MINIO_SECRET_KEY         – MinIO secret key
# ------------------------------------------------------------------

docker compose up -d
```

Open the web UI at <http://localhost:5173>.  
The UI automatically connects to the backend at <http://localhost:8080>.

---

## Manual Development

These instructions are needed only if you plan to modify the source code.

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

The dev server runs at <http://localhost:5173> and proxies API calls to <http://localhost:8080>.

---

## Environment Variables

The backend reads configuration from a `.env` file in `backend/`.  
Below is a list of required variables.

| Variable                | Purpose |
|--------------------------|---------|
| `NVIDIA_NIM_API_KEY_1…10` | API keys for the ten agents |
| `DB_URL`                 | PostgreSQL JDBC URL |
| `REDIS_URL`              | Redis connection string |
| `QDRANT_URL`             | Qdrant endpoint |
| `MINIO_ENDPOINT`         | MinIO URL (e.g., `http://minio:9000`) |
| `MINIO_ACCESS_KEY`       | MinIO access key |
| `MINIO_SECRET_KEY`       | MinIO secret key |

The file `backend/.env.example` contains placeholder values for quick reference.

---

## Agent Roles

| Agent            | Role                | Default Model                     |
|------------------|---------------------|----------------------------------|
| Alexandra Chen  | CEO                 | `z-ai/glm-5.2`                   |
| Marcus Rivera    | Product Manager     | `z-ai/glm-5.2`                   |
| Priya Sharma     | Backend Engineer    | `poolside/laguna-xs-2.1`         |
| Jake Yamamoto    | Frontend Engineer  | `google/gemma-4-31b-it`         |
| Fatima Al‑Hassan | Cloud Architect     | `poolside/laguna-xs-2.1`         |
| Dmitri Volkov    | Security Engineer   | `nvidia/nemotron-3-ultra-550b-a55b` |
| Sarah Kim        | QA Engineer         | `stepfun-ai/step-3.7-flash`      |
| Leo Dubois       | Marketing Strategist| `moonshotai/kimi-k2.6`           |
| Aisha Patel      | Customer Analyst    | `moonshotai/kimi-k2.6`           |
| Emma Lindström   | UI/UX Designer      | `google/gemma-4-31b-it`         |

---

## Operational Workflow

1. **Prompt** – The user submits a question via the UI.  
2. **Parallel generation** – Each agent produces an independent reply.  
3. **Cross‑review** – Agents evaluate each other’s outputs.  
4. **Debate** – Structured rebuttals and evidence exchange occur.  
5. **Revision** – Agents refine their replies after debate.  
6. **Synthesis** – The CEO aggregates the refined replies into the final answer.  
7. **Delivery** – The consensus answer streams back to the user.

---

## Changelog

### v1.2.0 – 2026‑08‑21

- Unified environment configuration for smoother onboarding.  
- Added SSE streaming for real‑time UI updates.  
- Optimized cross‑review logic, improving consensus accuracy.

---

## License

Synapse is released under a **proprietary license**.  
All rights reserved. See the [LICENSE](LICENSE) file for details.

---

## Contributing & Support

Pull requests are welcome. For new features or bug reports, open a GitHub issue first to discuss.

For technical support, create an issue or email `shubhyagami@example.com`.

*Last updated: 2026‑09‑24*
