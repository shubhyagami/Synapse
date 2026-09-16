[K[2m  [2mmodel openai/gpt-oss-20b failed, trying next...[0m[0m
[K[2m  [2mmodel openai/gpt-oss-120b failed, trying next...[0m[0m
# Synapse – AI-Powered Boardroom Simulation

Synapse is an orchestration platform that simulates a fully autonomous board of ten specialized AI agents. Each agent independently interprets user queries, cross-examines its peers, and engages in structured debate to iteratively refine results until the **CEO** synthesizes a final consensus answer.

[![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions)
[![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions)
[![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main)](https://coveralls.io/github/shubhyagami/synapse)
[![Docker Pulls](https://img.shields.io/docker/pulls/shubhyagami/synapse.svg)](https://hub.docker.com/r/shubhyagami/synapse)
[![License](https://img.shields.io/badge/license-proprietary-red.svg)](LICENSE)

---

## Core Features

- **Multi-Agent Orchestration:** 10 specialized roles working in parallel to solve complex problems.
- **Structured Debate:** Built-in cross-review and critique cycles to reduce hallucinations and improve accuracy.
- **Real-time Visualization:** Live streaming of agent contributions and debate graphs via WebSockets/SSE.
- **Hybrid Memory:** Long-term conversation state via PostgreSQL, caching via Redis, and vector search via Qdrant.
- **Modular LLM Integration:** Powered by NVIDIA NIM, allowing each agent to drive a distinct model.
- **Simplified Deployment:** Full-stack launch via Docker Compose.

---

## Architecture

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Backend** | Java 21, Spring Boot 3.4 | REST API, WebSocket/SSE, orchestration & scheduling |
| **Frontend** | Vite, React 18, TS, Tailwind, React-Flow | Visualizing debate graphs and streaming messages |
| **LLM Orchestration**| NVIDIA NIM | Model hosting and inference for agents |
| **Datastore** | PostgreSQL 16, Redis 7, Qdrant 1.9 | State persistence, caching, and vector search |
| **Object Store** | MinIO | Media attachments and system logs |
| **Deployment** | Docker Compose | Containerized environment orchestration |

---

## Getting Started

### Prerequisites

- **Docker & Docker Compose** (v20.10+)
- **Java JDK 21** (for local backend development)
- **Node.js 20+** (for local frontend development)

### Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/shubhyagami/synapse.git
cd synapse

# 2. Configure environment variables
cp backend/.env.example backend/.env
# Edit .env to provide NIM API keys and database credentials

# 3. Launch the stack
docker compose up -d

# 4. Access the UI
# http://localhost:5173
```

### Manual Development Setup

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*The frontend expects the backend to be available at `http://localhost:8080`.*

---

## Environment Configuration

Configure your `backend/.env` file with the following variables:

| Variable | Description |
|-----------|-------------|
| `NVIDIA_NIM_API_KEY_1...10` | API keys for the ten NIM models |
| `DB_URL` | PostgreSQL JDBC URL |
| `REDIS_URL` | Redis connection string |
| `QDRANT_URL` | Qdrant endpoint |
| `MINIO_ENDPOINT` | MinIO URL (e.g. `http://minio:9000`) |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |

---

## The Boardroom

| Agent | Role | Default Model |
|-------|------|-----------|
| Alexandra Chen | CEO | `z-ai/glm-5.2` |
| Marcus Rivera | Product Manager | `z-ai/glm-5.2` |
| Priya Sharma | Backend Engineer | `poolside/laguna-xs-2.1` |
| Jake Yamamoto | Frontend Engineer | `google/gemma-4-31b-it` |
| Fatima Al-Hassan | Cloud Architect | `poolside/laguna-xs-2.1` |
| Dmitri Volkov | Security Engineer | `nvidia/nemotron-3-ultra-550b-a55b` |
| Sarah Kim | QA Engineer | `stepfun-ai/step-3.7-flash` |
| Leo Dubois | Marketing Strategist | `moonshotai/kimi-k2.6` |
| Aisha Patel | Customer Analyst | `moonshotai/kimi-k2.6` |
| Emma Lindström | UI/UX Designer | `google/gemma-4-31b-it` |

---

## Operational Workflow

1. **Query Submission:** User provides a prompt via the UI.
2. **Parallel Analysis:** All 10 agents generate independent initial interpretations.
3. **Cross-Review:** Agents analyze peer outputs to find gaps or contradictions.
4. **Debate & Critique:** A structured cycle of rebuttals and evidence-based discussion.
5. **Refinement:** Agents update their responses based on the debate.
6. **Synthesis:** The CEO agent aggregates the refined perspectives into a final consensus.
7. **Delivery:** The final answer is streamed to the user.

---

## Changelog

### v1.2.0 (2026-08-21)
- Standardized environment configuration for easier onboarding.
- Integrated SSE streaming for real-time UI updates.
- Optimized cross-review logic for higher consensus accuracy.

---

## License

Synapse is distributed under a **proprietary license**. All rights reserved. See the [LICENSE](LICENSE) file for details.

## Contributing & Support

- **Contributions:** Pull requests are welcome. Please open an issue to discuss feature ideas or bug reports first.
- **Support:** For technical issues, please open a GitHub issue or contact `shubhyagami@example.com`.
