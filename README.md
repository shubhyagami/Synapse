# Synapse – Autonomous Boardroom Simulation

Synapse orchestrates an autonomous board of ten specialized AI agents.  
Each agent independently interprets user prompts, cross‑examines its peers, and engages in a structured debate until the **CEO** synthesizes a final, consensus answer.

[![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions)
[![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions)
[![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main)](https://coveralls.io/github/shubhyagami/synapse)
[![Docker Pulls](https://img.shields.io/docker/pulls/shubhyagami/synapse.svg)](https://hub.docker.com/r/shubhyagami/synapse)
[![License](https://img.shields.io/badge/license-proprietary-red.svg)](LICENSE)

---

## Core Features

- **Multi‑Agent Orchestration** – 10 distinct roles working in parallel.
- **Structured Debate** – Cross‑review and critique cycles to reduce hallucinations.
- **Real‑time Visualization** – Live streaming of contributions and debate graphs via WebSockets/SSE.
- **Hybrid Persistence** – PostgreSQL for long‑term data, Redis for caching, and Qdrant for vector search.
- **Modular LLM Back‑end** – Each agent can run a separate model via NVIDIA NIM.
- **One‑Command Deployment** – Docker Compose stack for quick setup.

---

## Architecture Overview

| Layer | Technology | Purpose |
|-------|-------------|---------|
| **Backend** | Java 21, Spring Boot 3.4 | REST API, WebSocket/SSE, orchestration, and scheduling |
| **Frontend** | Vite, React 18, TypeScript, Tailwind, React‑Flow | Visualizes debate graphs and streams results |
| **LLM Orchestration** | NVIDIA NIM | Host and run agents’ models |
| **Persistence & Search** | PostgreSQL 16, Redis 7, Qdrant 1.9 | State, caching, vector search |
| **Object Store** | MinIO | Media attachments and logs |
| **Deployment** | Docker Compose | Container orchestration |

---

## Getting Started

### Prerequisites

- Docker ≥ 20.10 and Docker Compose
- Java JDK 21 (for backend development)
- Node JS ≥ 20 (for frontend development)

### Quick Start (Docker)

```bash
# 1. Clone the repo
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# 2. Configure environment variables
cp backend/.env.example backend/.env
# Edit the file to add NIM keys and database credentials

# 3. Launch the stack
docker compose up -d

# 4. Open the UI
# http://localhost:5173
```

### Manual Development

```bash
# Backend
cd backend
./mvnw spring-boot:run
```

```bash
# Frontend
cd frontend
npm install
npm run dev
```

*The frontend connects to the backend at `http://localhost:8080`.*

---

## Environment Configuration

Edit `backend/.env` with the following variables:

| Variable | Description |
|----------|-------------|
| `NVIDIA_NIM_API_KEY_1…10` | API keys for the ten NIM models |
| `DB_URL` | PostgreSQL JDBC URL |
| `REDIS_URL` | Redis connection string |
| `QDRANT_URL` | Qdrant endpoint |
| `MINIO_ENDPOINT` | MinIO URL (e.g., `http://minio:9000`) |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |

---

## The Boardroom

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

1. **Query Submission** – User enters a prompt via the UI.  
2. **Parallel Analysis** – All 10 agents generate independent interpretations.  
3. **Cross‑Review** – Agents examine peers’ outputs to spot gaps or contradictions.  
4. **Debate & Critique** – Structured cycles of rebuttals and evidence‑based discussion.  
5. **Refinement** – Agents update their responses based on the debate.  
6. **Synthesis** – The CEO aggregates the refined perspectives into a final answer.  
7. **Delivery** – The consensus answer is streamed back to the user.

---

## Changelog

### v1.2.0 (2026‑08‑21)

- Unified environment configuration for easier onboarding.  
- Added SSE streaming for real‑time UI updates.  
- Optimized cross‑review logic to improve consensus accuracy.

---

## License

Synapse is distributed under a **proprietary license**. All rights reserved. See the [LICENSE](LICENSE) file for details.

---

## Contributing & Support

- **Pull requests** are welcome. Please open an issue first to discuss your idea or report a bug.  
- **Technical support** – submit a GitHub issue or email `shubhyagami@example.com`.  

---
