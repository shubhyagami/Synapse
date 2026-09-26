[K[2m  [2mmodel z-ai/glm-5.3-flash failed, trying next...[0m[0m
[K[2m  [2mmodel deepseek-ai/deepseek-v4.1-flash failed, trying next...[0m[0m
[K[2m  [2mmodel openai/gpt-oss-20b failed, trying next...[0m[0m
[K[2m  [2mmodel openai/gpt-oss-120b failed, trying next...[0m[0m
# Synapse – Autonomous Boardroom Simulation

Synapse implements a virtual boardroom of ten specialized AI agents that collaborate to resolve complex user prompts. By utilizing a structured debate mechanism—where agents generate independent responses, critique their peers, and iterate toward a consensus—Synapse significantly reduces hallucinations and increases the accuracy of the final output compared to single-model approaches.

[![Build](https://github.com/shubhyagami/synapse/actions/workflows/build.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions/workflows/build.yml)
[![Test](https://github.com/shubhyagami/synapse/actions/workflows/test.yml/badge.svg)](https://github.com/shubhyagami/synapse/actions/workflows/test.yml)
[![Coverage](https://coveralls.io/repos/github/shubhyagami/synapse/badge.svg?branch=main)](https://coveralls.io/github/shubhyagami/synapse)
[![Docker Pulls](https://img.shields.io/docker/pulls/shubhyagami/synapse.svg)](https://hub.docker.com/r/shubhyagami/synapse)
[![License](https://img.shields.io/badge/license-proprietary-red.svg)](LICENSE)

---

## Features

- **Multi-Agent Orchestration**: Ten distinct AI roles, each powered by a specialized LLM.
- **Iterative Debate Logic**: A structured pipeline of generation, peer review, and rebuttal to refine answers.
- **Real-time Visualization**: A React-based UI featuring a debate graph and SSE/WebSocket streaming.
- **Enterprise Stack**: Integrated vector search (Qdrant), caching (Redis), and persistent state (PostgreSQL).
- **Flexible LLM Backend**: Seamless model swapping via the NVIDIA NIM API.
- **Containerized Deployment**: Full-stack orchestration via Docker Compose for rapid setup.

---

## Quick Start

### Prerequisites
- Docker and Docker Compose installed.
- NVIDIA NIM API keys.

### Installation
```bash
git clone https://github.com/shubhyagami/synapse.git
cd synapse
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys and database credentials
docker compose up -d
```

**Access the application:**
- **Web UI**: <http://localhost:5173>
- **Backend API**: <http://localhost:8080>

---

## Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.4 | Orchestration, REST API, SSE/WebSockets |
| **Frontend** | React 18, TypeScript, TailwindCSS, React Flow | Debate visualization, streaming UI |
| **LLM Provider** | NVIDIA NIM | Model hosting and inference |
| **Persistence** | PostgreSQL 16, Redis 7, Qdrant 1.9 | State, caching, and vector embeddings |
| **Storage** | MinIO | Log storage and media attachments |
| **Deployment** | Docker Compose | Environment orchestration |

---

## Agent Roles & Models

| Agent | Role | Default Model |
| :--- | :--- | :--- |
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

1. **Input**: User submits a prompt via the frontend.
2. **Generation**: All ten agents generate independent initial responses in parallel.
3. **Critique**: Agents review peer responses for errors or omissions.
4. **Debate**: A structured exchange of rebuttals and evidence.
5. **Refinement**: Agents update their positions based on the debate.
6. **Synthesis**: The CEO agent aggregates the final consensus.
7. **Delivery**: The final answer is streamed back to the user in real time.

---

## Configuration

The backend requires a `.env` file located in the `backend/` directory.

| Variable | Purpose |
| :--- | :--- |
| `NVIDIA_NIM_API_KEY_1…10` | API keys for each of the ten agents |
| `DB_URL` | PostgreSQL JDBC connection URL |
| `REDIS_URL` | Redis connection string |
| `QDRANT_URL` | Qdrant endpoint URL |
| `MINIO_ENDPOINT` | MinIO server URL (e.g., `http://minio:9000`) |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |

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

---

## Changelog

### v1.2.0 (2026-08-21)
- Unified environment configuration for simplified onboarding.
- Implemented SSE streaming for real-time UI updates.
- Optimized cross-review logic to improve consensus accuracy.

---

## License & Support

Synapse is released under a **proprietary license**. All rights reserved. See the [LICENSE](LICENSE) file for details.

**Contributing**: Pull requests are welcome. Please open an issue to discuss proposed features or bug fixes.

**Support**: For technical assistance, open a GitHub issue or contact `shubhyagami@example.com`.

*Last updated: 2026-09-26*
