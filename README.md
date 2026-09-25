[K[2m  [2mmodel deepseek-ai/deepseek-v4.1-flash failed, trying next...[0m[0m
# Synapse – Autonomous Boardroom Simulation

Synapse runs a virtual board of ten AI agents that work together to answer user prompts.  
Each agent produces an independent response, critiques others, and participates in a structured debate.  
The CEO agent synthesises a final consensus that is streamed to the user in real time.

> **NOTE:** Collective reasoning in Synapse reduces hallucinations compared to single‑model approaches.

[![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions/workflows/build.yml)
[![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions/workflows/test.yml)
[![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main)](https://coveralls.io/github/shubhyagami/synapse)
[![Docker Pulls](https://img.shields.io/docker/pulls/shubhyagami/synapse.svg)](https://hub.docker.com/r/shubhyagami/synapse)
[![License](https://img.shields.io/badge/license-proprietary-red.svg)](LICENSE)

---

## Quick start

```bash
git clone https://github.com/shubhyagami/synapse.git
cd synapse
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials
docker compose up -d
```

Open the web UI at <http://localhost:5173>.  
The UI connects automatically to the backend at <http://localhost:8080>.

---

## Architecture

| Layer          | Technology                                  | Purpose                              |
|----------------|---------------------------------------------|--------------------------------------|
| **Backend**    | Java 21 + Spring Boot 3.4                   | REST API, WebSocket/SSE, orchestration |
| **Frontend**   | Vite + React 18 + TypeScript + TailwindCSS + React Flow | Debate graph, result streams, control panel |
| **LLM**        | NVIDIA NIM                                 | Hosts each agent’s model              |
| **Persistence**| PostgreSQL 16, Redis 7, Qdrant 1.9          | Long‑term state, caching, vector search |
| **Object store**| MinIO                                      | Media attachments, logs               |
| **Deployment** | Docker Compose                              | Container orchestration                |

---

## Features

- **Ten‑agent orchestration** – Each agent runs its own LLM and has a distinct role.
- **Structured debate** – Peer critiques and rebuttals reduce hallucinations.
- **Real‑time UI** – WebSocket/SSE streams debate flows and final answer.
- **Hybrid persistence** – PostgreSQL for state, Redis for caching, Qdrant for vector search.
- **Extensible LLM backend** – Swap models via NVIDIA NIM API keys.
- **All‑in‑one Docker Compose stack** – `docker compose up` runs the full environment.

---

## Environment configuration

The backend reads a `.env` file in `backend/`.  
Required variables:

| Variable                | Purpose                                 |
|-------------------------|------------------------------------------|
| `NVIDIA_NIM_API_KEY_1…10` | API keys for the ten agents            |
| `DB_URL`                 | PostgreSQL JDBC URL                      |
| `REDIS_URL`              | Redis connection string                  |
| `QDRANT_URL`            | Qdrant endpoint                         |
| `MINIO_ENDPOINT`         | MinIO URL (e.g., `http://minio:9000`)  |
| `MINIO_ACCESS_KEY`       | MinIO access key                        |
| `MINIO_SECRET_KEY`       | MinIO secret key                        |

See `backend/.env.example` for placeholders.

---

## Agent roles

| Agent            | Role                | Default model                     |
|------------------|---------------------|----------------------------------|
| Alexandra Chen  | CEO                 | `z-ai/glm-5.2`                   |
| Marcus Rivera    | Product Manager     | `z-ai/glm-5.2`                   |
| Priya Sharma     | Backend Engineer    | `poolside/laguna-xs-2.1`         |
| Jake Yamamoto     | Frontend Engineer   | `google/gemma-4-31b-it`         |
| Fatima Al‑Hassan | Cloud Architect     | `poolside/laguna-xs-2.1`         |
| Dmitri Volkov     | Security Engineer   | `nvidia/nemotron-3-ultra-550b-a55b` |
| Sarah Kim         | QA Engineer         | `stepfun-ai/step-3.7-flash`      |
| Leo Dubois        | Marketing Strategist | `moonshotai/kimi-k2.6`           |
| Aisha Patel       | Customer Analyst    | `moonshotai/kimi-k2.6`           |
| Emma Lindström    | UI/UX Designer      | `google/gemma-4-31b-it`         |

---

## Operational workflow

1. **Prompt** – User submits a question via the UI.  
2. **Parallel generation** – Each agent produces an independent reply.  
3. **Cross‑review** – Agents evaluate peers’ outputs.  
4. **Debate** – Structured rebuttals and evidence exchange.  
5. **Revision** – Agents refine their replies.  
6. **Synthesis** – CEO aggregates the refined replies into the final answer.  
7. **Delivery** – Consensus answer streams back to the user.

---

## Development

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

The dev server proxies API calls to `http://localhost:8080`.

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

Pull requests are welcome. For new features or bugs, open an issue first to discuss.

For technical support, create an issue or email `shubhyagami@example.com`.

*Last updated: 2026‑09‑25*
